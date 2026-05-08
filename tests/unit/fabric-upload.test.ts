import { describe, expect, it } from "vitest";
import { validateFabricUpload } from "@/utils/fabric";

describe("fabric upload validation", () => {
  it("accepts valid png under limit", () => {
    const file = new File([new Uint8Array(1024)], "fabric.png", { type: "image/png" });
    expect(validateFabricUpload(file).valid).toBe(true);
  });

  it("rejects unsupported extension", () => {
    const file = new File([new Uint8Array(1024)], "fabric.gif", { type: "image/gif" });
    expect(validateFabricUpload(file).valid).toBe(false);
  });
});
