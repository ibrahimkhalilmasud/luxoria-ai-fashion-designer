import type { FabricType } from "@/types/garment";

const VALID_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 5 * 1024 * 1024;

export function validateFabricUpload(file: File): { valid: boolean; reason?: string } {
  if (!VALID_TYPES.has(file.type)) {
    return { valid: false, reason: "Only JPG, PNG, and WEBP are supported." };
  }
  if (file.size > MAX_BYTES) {
    return { valid: false, reason: "File size must be 5MB or less." };
  }
  return { valid: true };
}

export function getFabricSuggestion(type: FabricType): string {
  const map: Record<FabricType, string> = {
    Silk: "Silk pairs with evening gowns and fluid A-line drapes.",
    Satin: "Satin performs best in mermaid and evening silhouettes.",
    Chiffon: "Chiffon works for flowing layers and fit-and-flare styles.",
    Georgette: "Georgette supports modern couture with soft structure.",
    Lace: "Lace is ideal for bridal overlays and transparent top layers.",
    Organza: "Organza adds dramatic volume for ball gowns and sleeves.",
    "Embroidery fabrics": "Embroidery fabrics shine as statement overlays and bodice accents.",
    Velvet: "Velvet is best for structured gowns and luxury winter looks.",
  };
  return map[type];
}
