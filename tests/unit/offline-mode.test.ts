import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("offline mode", () => {
  it("defines service worker cache list", () => {
    const sw = fs.readFileSync("public/sw.js", "utf8");
    expect(sw).toContain("CACHE_NAME");
    expect(sw).toContain("fetch");
  });
});
