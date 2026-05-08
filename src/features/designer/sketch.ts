import type { Garment } from "@/types/garment";

export type SketchView = "front" | "back" | "side";

export function getSketchPath(garment: Garment, view: SketchView): string {
  const base = garment.silhouette === "Mermaid" ? "M110 20 C 140 90, 140 210, 110 260 L 70 260 C 40 210, 40 90, 70 20 Z" : "M100 20 C 140 80, 150 180, 120 260 L 60 260 C 30 180, 40 80, 80 20 Z";
  if (view === "side") {
    return "M90 20 C 120 100, 120 180, 95 260 L 70 260 C 65 170, 65 90, 75 20 Z";
  }
  if (view === "back") {
    return base.replace("C 140 80", "C 135 70");
  }
  return base;
}

export function getStitchGuidePath(): string {
  return "M90 40 L90 250 M65 100 L115 100 M60 150 L120 150";
}
