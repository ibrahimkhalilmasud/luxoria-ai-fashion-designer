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
  complexityScore: number;
  difficulty: "Standard" | "Advanced" | "Couture";
  fitEaseCm: number;
  cuttingNotes: string[];
  panels: PatternPanel[];
};

export function generatePattern(garment: Garment, seamAllowanceCm: number): GeneratedPattern {
  const scale = Math.max(0.8, garment.measurements.height / 168);
  const bust = garment.measurements.bust * scale;
  const waist = garment.measurements.waist * scale;
  const hip = garment.measurements.hip * scale;

  const silhouetteFactor: Record<Garment["silhouette"], number> = {
    "A-line": 1.06,
    Mermaid: 1.03,
    Kaftan: 1.1,
    Abaya: 1.12,
    "Evening gown": 1.14,
    "Bridal gown": 1.2,
    "Straight cut": 1,
    "Ball gown": 1.26,
    "Fit-and-flare": 1.12,
    "Contemporary couture": 1.16,
  };

  const lengthFactor: Record<Garment["length"], number> = {
    Mini: 0.78,
    Knee: 0.9,
    Midi: 1,
    "Floor length": 1.14,
    Tail: 1.22,
  };

  const sleeveFactor: Record<Garment["sleeves"], number> = {
    "Full flare": 1.1,
    "Puff sleeves": 1.08,
    "Bell sleeves": 1.1,
    "Bishop sleeves": 1.12,
    Sleeveless: 0.6,
    "Cape sleeves": 1.2,
  };

  const baseSilhouette = silhouetteFactor[garment.silhouette];
  const baseLength = lengthFactor[garment.length];
  const baseSleeve = sleeveFactor[garment.sleeves];
  const layerFactor = 1 + garment.layers.length * 0.08;
  const stretchRelief = 1 - Math.min(0.14, Math.max(0, garment.fabric.stretch * 0.12));
  const panelScale = baseSilhouette * baseLength * layerFactor * stretchRelief;

  const fitEaseCm = Number((Math.max(2, bust * 0.04) * (1 - garment.fabric.stretch * 0.4)).toFixed(1));

  const panels: PatternPanel[] = [
    {
      name: "Bodice",
      widthCm: Math.round((bust * 0.5 + fitEaseCm) * panelScale),
      heightCm: Math.round(bust * 0.34 * baseLength),
      seamAllowanceCm,
    },
    {
      name: "Sleeve",
      widthCm: Math.round(garment.measurements.armLength * 0.55 * baseSleeve * layerFactor),
      heightCm: Math.round(garment.measurements.armLength * baseSleeve),
      seamAllowanceCm,
    },
    {
      name: "Collar",
      widthCm: Math.round(waist * 0.44 + fitEaseCm * 0.6),
      heightCm: Math.round(10 + garment.layers.length * 1.5),
      seamAllowanceCm,
    },
    {
      name: "Skirt",
      widthCm: Math.round((Math.max(waist, hip * 0.92) * 1.32 + fitEaseCm * 1.4) * panelScale),
      heightCm: Math.round(garment.measurements.height * 0.48 * baseLength),
      seamAllowanceCm,
    },
    {
      name: "Waist panels",
      widthCm: Math.round((waist * 0.72 + fitEaseCm * 0.8) * panelScale),
      heightCm: Math.round(18 * (1 + garment.fabric.shininess * 0.2)),
      seamAllowanceCm,
    },
    {
      name: "Lining panels",
      widthCm: Math.round(waist * 0.88 * (1 + garment.layers.length * 0.06)),
      heightCm: Math.round(garment.measurements.height * 0.42 * baseLength),
      seamAllowanceCm,
    },
  ];

  const area = panels.reduce((sum, panel) => sum + panel.widthCm * panel.heightCm, 0) / 10000;
  const complexityRaw =
    baseSilhouette * 20 +
    baseLength * 16 +
    baseSleeve * 16 +
    garment.layers.length * 8 +
    garment.fabric.shininess * 12 +
    (garment.closure === "Lace up" ? 6 : 2);
  const complexityScore = Math.min(100, Math.round(complexityRaw));
  const difficulty: GeneratedPattern["difficulty"] =
    complexityScore >= 70 ? "Couture" : complexityScore >= 52 ? "Advanced" : "Standard";
  const cuttingNotes = [
    `Stabilize ${garment.neckline.toLowerCase()} neckline with lightweight interfacing.`,
    garment.closure === "Lace up"
      ? "Add reinforcement tape on closure edge to handle lacing tension."
      : `Prepare closure allowance for ${garment.closure.toLowerCase()} finish.`,
    garment.layers.length > 1
      ? "Cut overlay layers separately and baste before final seam assembly."
      : "Single-layer assembly allows direct seam joining and faster finishing.",
  ];

  return {
    sizeLabel: garment.sizePreset,
    estimatedFabricMeters: Number((area * (1.24 + garment.layers.length * 0.05)).toFixed(2)),
    printableA4Pages: Math.ceil(area * 4),
    complexityScore,
    difficulty,
    fitEaseCm,
    cuttingNotes,
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
