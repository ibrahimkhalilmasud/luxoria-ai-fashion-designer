import { describe, expect, it } from "vitest";
import { deriveGarmentFromBrief } from "@/features/designer/assistant";
import { defaultGarment } from "@/types/garment";

describe("design assistant", () => {
  it("maps bridal-style brief to matching configuration", () => {
    const result = deriveGarmentFromBrief(
      "Create a bridal floor dress with sweetheart neckline, lace overlay and organza volume.",
      defaultGarment,
    );
    expect(result.nextGarment.silhouette).toBe("Bridal gown");
    expect(result.nextGarment.length).toBe("Floor length");
    expect(result.nextGarment.neckline).toBe("Sweetheart");
    expect(result.nextGarment.fabric.type).toBe("Organza");
    expect(result.nextGarment.layers).toContain("Lace overlay");
    expect(result.matchedRules.length).toBeGreaterThan(0);
  });
});
