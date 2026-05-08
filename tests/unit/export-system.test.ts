import { describe, expect, it } from "vitest";
import { toFlatPatternSvg } from "@/features/patterns/generator";

describe("export system", () => {
  it("creates SVG pattern output", () => {
    const svg = toFlatPatternSvg({
      sizeLabel: "M",
      estimatedFabricMeters: 2.3,
      printableA4Pages: 6,
      complexityScore: 58,
      difficulty: "Advanced",
      fitEaseCm: 3.2,
      cuttingNotes: ["note"],
      panels: [
        { name: "Bodice", widthCm: 40, heightCm: 50, seamAllowanceCm: 1 },
        { name: "Sleeve", widthCm: 20, heightCm: 60, seamAllowanceCm: 1 },
        { name: "Collar", widthCm: 30, heightCm: 12, seamAllowanceCm: 1 },
        { name: "Skirt", widthCm: 70, heightCm: 90, seamAllowanceCm: 1 },
        { name: "Waist panels", widthCm: 50, heightCm: 20, seamAllowanceCm: 1 },
        { name: "Lining panels", widthCm: 60, heightCm: 80, seamAllowanceCm: 1 },
      ],
    });
    expect(svg).toContain("<svg");
    expect(svg).toContain("Bodice");
  });
});
