import type { Garment } from "@/types/garment";

export type PatternPanel = {
  name: "Bodice" | "Sleeve" | "Collar" | "Skirt" | "Waist panels" | "Lining panels";
  widthCm: number;
  heightCm: number;
  seamAllowanceCm: number;
};

export type GeneratedPattern = {
  sizeLabel: string;
  estimatedFabricMeters: number;
  printableA4Pages: number;
  panels: PatternPanel[];
};

export function generatePattern(garment: Garment, seamAllowanceCm: number): GeneratedPattern {
  const scale = Math.max(0.8, garment.measurements.height / 168);
  const bust = garment.measurements.bust * scale;
  const waist = garment.measurements.waist * scale;

  const panels: PatternPanel[] = [
    { name: "Bodice", widthCm: Math.round(bust * 0.52), heightCm: Math.round(bust * 0.36), seamAllowanceCm },
    { name: "Sleeve", widthCm: Math.round(garment.measurements.armLength * 0.55), heightCm: Math.round(garment.measurements.armLength), seamAllowanceCm },
    { name: "Collar", widthCm: Math.round(waist * 0.45), heightCm: 10, seamAllowanceCm },
    { name: "Skirt", widthCm: Math.round(waist * 1.4), heightCm: Math.round(garment.measurements.height * 0.48), seamAllowanceCm },
    { name: "Waist panels", widthCm: Math.round(waist * 0.75), heightCm: 18, seamAllowanceCm },
    { name: "Lining panels", widthCm: Math.round(waist * 0.9), heightCm: Math.round(garment.measurements.height * 0.42), seamAllowanceCm },
  ];

  const area = panels.reduce((sum, panel) => sum + panel.widthCm * panel.heightCm, 0) / 10000;

  return {
    sizeLabel: garment.sizePreset,
    estimatedFabricMeters: Number((area * 1.3).toFixed(2)),
    printableA4Pages: Math.ceil(area * 4),
    panels,
  };
}

export function toFlatPatternSvg(pattern: GeneratedPattern): string {
  const rects = pattern.panels
    .map((panel, i) => {
      const x = 20 + (i % 2) * 220;
      const y = 20 + Math.floor(i / 2) * 130;
      return `<g><rect x="${x}" y="${y}" width="180" height="90" fill="none" stroke="#d4af37"/><text x="${x + 8}" y="${y + 20}" fill="#fff" font-size="12">${panel.name}</text><text x="${x + 8}" y="${y + 36}" fill="#aaa" font-size="11">${panel.widthCm}x${panel.heightCm} cm</text></g>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="460" height="430" viewBox="0 0 460 430"><rect width="460" height="430" fill="#111"/>${rects}</svg>`;
}
