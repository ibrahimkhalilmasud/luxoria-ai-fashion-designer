import { describe, expect, it } from "vitest";
import { defaultGarment } from "@/types/garment";
import { getSketchPath } from "@/features/designer/sketch";

describe("garment sketch rendering", () => {
  it("returns path for each view", () => {
    expect(getSketchPath(defaultGarment, "front")).toContain("M");
    expect(getSketchPath(defaultGarment, "back")).toContain("M");
    expect(getSketchPath(defaultGarment, "side")).toContain("M");
  });
});
