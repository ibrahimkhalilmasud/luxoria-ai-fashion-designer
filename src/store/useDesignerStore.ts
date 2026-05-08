import { create } from "zustand";
import { persist } from "zustand/middleware";
import { db } from "@/services/db";
import { defaultGarment, defaultMeasurements, type Garment, type Measurements, type SizePreset } from "@/types/garment";

type DesignerState = {
  garment: Garment;
  projectName: string;
  seamAllowanceCm: number;
  sketchView: "front" | "back" | "side";
  updateGarment: <K extends keyof Garment>(field: K, value: Garment[K]) => void;
  updateMeasurements: (measurements: Measurements) => void;
  applyPreset: (preset: SizePreset) => void;
  setProjectName: (name: string) => void;
  setSketchView: (view: "front" | "back" | "side") => void;
  setSeamAllowance: (value: number) => void;
  saveProject: () => Promise<void>;
};

const presets: Record<Exclude<SizePreset, "Custom">, Measurements> = {
  XS: { bust: 80, waist: 62, hip: 88, shoulder: 37, armLength: 56, height: 160 },
  S: { bust: 84, waist: 66, hip: 92, shoulder: 39, armLength: 57, height: 164 },
  M: defaultMeasurements,
  L: { bust: 94, waist: 76, hip: 102, shoulder: 42, armLength: 59, height: 170 },
  XL: { bust: 102, waist: 84, hip: 110, shoulder: 44, armLength: 61, height: 174 },
};

export const useDesignerStore = create<DesignerState>()(
  persist(
    (set, get) => ({
      garment: defaultGarment,
      projectName: "Luxoria Couture Draft",
      seamAllowanceCm: 1.2,
      sketchView: "front",
      updateGarment: (field, value) =>
        set((state) => ({ garment: { ...state.garment, [field]: value } })),
      updateMeasurements: (measurements) =>
        set((state) => ({
          garment: { ...state.garment, measurements, sizePreset: "Custom" },
        })),
      applyPreset: (preset) => {
        if (preset === "Custom") {
          set((state) => ({ garment: { ...state.garment, sizePreset: preset } }));
          return;
        }
        set((state) => ({
          garment: {
            ...state.garment,
            sizePreset: preset,
            measurements: presets[preset],
          },
        }));
      },
      setProjectName: (projectName) => set({ projectName }),
      setSketchView: (sketchView) => set({ sketchView }),
      setSeamAllowance: (seamAllowanceCm) => set({ seamAllowanceCm }),
      saveProject: async () => {
        const state = get();
        await db.projects.put({
          id: "latest",
          name: state.projectName,
          garment: state.garment,
          updatedAt: new Date().toISOString(),
        });
      },
    }),
    {
      name: "luxoria-store",
      partialize: (state) => ({
        garment: state.garment,
        projectName: state.projectName,
        seamAllowanceCm: state.seamAllowanceCm,
        sketchView: state.sketchView,
      }),
    },
  ),
);
