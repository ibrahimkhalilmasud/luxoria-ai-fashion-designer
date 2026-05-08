import { describe, expect, it } from "vitest";
import { defaultGarment } from "@/types/garment";
import { generatePattern } from "@/features/patterns/generator";

describe("pattern generation", () => {
  it("generates panels and usage estimate", () => {
    const pattern = generatePattern(defaultGarment, 1.2);
    expect(pattern.panels).toHaveLength(6);
    expect(pattern.estimatedFabricMeters).toBeGreaterThan(0);
    expect(pattern.complexityScore).toBeGreaterThan(0);
    expect(pattern.fitEaseCm).toBeGreaterThan(0);
    expect(pattern.cuttingNotes.length).toBeGreaterThan(0);
  });
});
