import type { Closure, DressLength, FabricType, Layer, Neckline, Silhouette, Sleeve } from "@/types/garment";

export const silhouettes: Silhouette[] = [
  "A-line",
  "Mermaid",
  "Kaftan",
  "Abaya",
  "Evening gown",
  "Bridal gown",
  "Straight cut",
  "Ball gown",
  "Fit-and-flare",
  "Contemporary couture",
];

export const sleeves: Sleeve[] = [
  "Full flare",
  "Puff sleeves",
  "Bell sleeves",
  "Bishop sleeves",
  "Sleeveless",
  "Cape sleeves",
];

export const necklines: Neckline[] = ["Jewel", "V-neck", "Boat neck", "Sweetheart", "Square", "Halter"];

export const lengths: DressLength[] = ["Mini", "Knee", "Midi", "Floor length", "Tail"];

export const closures: Closure[] = ["Zipper", "Buttons", "Open back", "Lace up"];

export const layers: Layer[] = ["Lining", "Lace overlay", "Embroidery layer", "Transparent chiffon layer"];

export const fabrics: FabricType[] = [
  "Silk",
  "Satin",
  "Chiffon",
  "Georgette",
  "Lace",
  "Organza",
  "Embroidery fabrics",
  "Velvet",
];
