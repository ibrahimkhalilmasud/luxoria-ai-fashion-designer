import type { Garment } from "@/types/garment";

type AssistantResult = {
  nextGarment: Garment;
  matchedRules: string[];
};

const FABRIC_KEYWORDS: Array<{ keywords: string[]; value: Garment["fabric"]["type"] }> = [
  { keywords: ["silk"], value: "Silk" },
  { keywords: ["satin", "glossy"], value: "Satin" },
  { keywords: ["chiffon", "airy"], value: "Chiffon" },
  { keywords: ["georgette"], value: "Georgette" },
  { keywords: ["lace"], value: "Lace" },
  { keywords: ["organza", "volume"], value: "Organza" },
  { keywords: ["embroider", "embellished"], value: "Embroidery fabrics" },
  { keywords: ["velvet"], value: "Velvet" },
];

const SILHOUETTE_KEYWORDS: Array<{ keywords: string[]; value: Garment["silhouette"] }> = [
  { keywords: ["a-line", "aline"], value: "A-line" },
  { keywords: ["mermaid"], value: "Mermaid" },
  { keywords: ["kaftan"], value: "Kaftan" },
  { keywords: ["abaya", "modest"], value: "Abaya" },
  { keywords: ["evening"], value: "Evening gown" },
  { keywords: ["bridal", "wedding"], value: "Bridal gown" },
  { keywords: ["straight"], value: "Straight cut" },
  { keywords: ["ball gown", "princess"], value: "Ball gown" },
  { keywords: ["fit and flare", "fit-and-flare"], value: "Fit-and-flare" },
  { keywords: ["couture", "runway"], value: "Contemporary couture" },
];

const SLEEVE_KEYWORDS: Array<{ keywords: string[]; value: Garment["sleeves"] }> = [
  { keywords: ["full flare"], value: "Full flare" },
  { keywords: ["puff"], value: "Puff sleeves" },
  { keywords: ["bell"], value: "Bell sleeves" },
  { keywords: ["bishop"], value: "Bishop sleeves" },
  { keywords: ["sleeveless", "no sleeve"], value: "Sleeveless" },
  { keywords: ["cape"], value: "Cape sleeves" },
];

const NECKLINE_KEYWORDS: Array<{ keywords: string[]; value: Garment["neckline"] }> = [
  { keywords: ["jewel", "high neck"], value: "Jewel" },
  { keywords: ["v-neck", "v neck"], value: "V-neck" },
  { keywords: ["boat"], value: "Boat neck" },
  { keywords: ["sweetheart"], value: "Sweetheart" },
  { keywords: ["square"], value: "Square" },
  { keywords: ["halter"], value: "Halter" },
];

const LENGTH_KEYWORDS: Array<{ keywords: string[]; value: Garment["length"] }> = [
  { keywords: ["mini"], value: "Mini" },
  { keywords: ["knee"], value: "Knee" },
  { keywords: ["midi"], value: "Midi" },
  { keywords: ["floor"], value: "Floor length" },
  { keywords: ["tail", "train"], value: "Tail" },
];

const CLOSURE_KEYWORDS: Array<{ keywords: string[]; value: Garment["closure"] }> = [
  { keywords: ["zipper", "zip"], value: "Zipper" },
  { keywords: ["buttons", "button"], value: "Buttons" },
  { keywords: ["open back"], value: "Open back" },
  { keywords: ["lace up", "laced"], value: "Lace up" },
];

const LAYER_KEYWORDS: Array<{ keywords: string[]; value: Garment["layers"][number] }> = [
  { keywords: ["lining", "structured"], value: "Lining" },
  { keywords: ["lace overlay"], value: "Lace overlay" },
  { keywords: ["embroidery"], value: "Embroidery layer" },
  { keywords: ["chiffon layer", "transparent"], value: "Transparent chiffon layer" },
];

function findMatch<T>(text: string, dictionary: Array<{ keywords: string[]; value: T }>): T | undefined {
  return dictionary.find((entry) => entry.keywords.some((keyword) => text.includes(keyword)))?.value;
}

function extractLayers(text: string): Garment["layers"] {
  return LAYER_KEYWORDS.filter((entry) => entry.keywords.some((keyword) => text.includes(keyword))).map(
    (entry) => entry.value,
  );
}

export function deriveGarmentFromBrief(brief: string, current: Garment): AssistantResult {
  const text = brief.toLowerCase();
  const matchedRules: string[] = [];
  const nextGarment: Garment = {
    ...current,
    fabric: { ...current.fabric },
  };

  const silhouette = findMatch(text, SILHOUETTE_KEYWORDS);
  if (silhouette) {
    nextGarment.silhouette = silhouette;
    matchedRules.push(`silhouette → ${silhouette}`);
  }

  const sleeves = findMatch(text, SLEEVE_KEYWORDS);
  if (sleeves) {
    nextGarment.sleeves = sleeves;
    matchedRules.push(`sleeves → ${sleeves}`);
  }

  const neckline = findMatch(text, NECKLINE_KEYWORDS);
  if (neckline) {
    nextGarment.neckline = neckline;
    matchedRules.push(`neckline → ${neckline}`);
  }

  const length = findMatch(text, LENGTH_KEYWORDS);
  if (length) {
    nextGarment.length = length;
    matchedRules.push(`length → ${length}`);
  }

  const closure = findMatch(text, CLOSURE_KEYWORDS);
  if (closure) {
    nextGarment.closure = closure;
    matchedRules.push(`closure → ${closure}`);
  }

  const fabric = findMatch(text, FABRIC_KEYWORDS);
  if (fabric) {
    nextGarment.fabric.type = fabric;
    matchedRules.push(`fabric → ${fabric}`);
  }

  const layers = extractLayers(text);
  if (layers.length > 0) {
    nextGarment.layers = Array.from(new Set(layers));
    matchedRules.push(`layers → ${nextGarment.layers.join(", ")}`);
  }

  if (text.includes("modest")) {
    nextGarment.length = "Floor length";
    nextGarment.neckline = "Jewel";
    nextGarment.sleeves = "Full flare";
    if (!nextGarment.layers.includes("Lining")) {
      nextGarment.layers = [...nextGarment.layers, "Lining"];
    }
    matchedRules.push("modest profile tuning");
  }

  if (text.includes("glam") || text.includes("red carpet")) {
    nextGarment.fabric.shininess = Math.min(1, current.fabric.shininess + 0.2);
    matchedRules.push("boosted fabric shine");
  }

  return { nextGarment, matchedRules };
}
