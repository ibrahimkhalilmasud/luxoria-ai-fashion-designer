export type Silhouette =
  | "A-line"
  | "Mermaid"
  | "Kaftan"
  | "Abaya"
  | "Evening gown"
  | "Bridal gown"
  | "Straight cut"
  | "Ball gown"
  | "Fit-and-flare"
  | "Contemporary couture";

export type Sleeve =
  | "Full flare"
  | "Puff sleeves"
  | "Bell sleeves"
  | "Bishop sleeves"
  | "Sleeveless"
  | "Cape sleeves";

export type Neckline =
  | "Jewel"
  | "V-neck"
  | "Boat neck"
  | "Sweetheart"
  | "Square"
  | "Halter";

export type DressLength = "Mini" | "Knee" | "Midi" | "Floor length" | "Tail";

export type Closure = "Zipper" | "Buttons" | "Open back" | "Lace up";

export type Layer =
  | "Lining"
  | "Lace overlay"
  | "Embroidery layer"
  | "Transparent chiffon layer";

export type FabricType =
  | "Silk"
  | "Satin"
  | "Chiffon"
  | "Georgette"
  | "Lace"
  | "Organza"
  | "Embroidery fabrics"
  | "Velvet";

export type Measurements = {
  bust: number;
  waist: number;
  hip: number;
  shoulder: number;
  armLength: number;
  height: number;
};

export type SizePreset = "XS" | "S" | "M" | "L" | "XL" | "Custom";

export type Garment = {
  silhouette: Silhouette;
  neckline: Neckline;
  sleeves: Sleeve;
  layers: Layer[];
  closure: Closure;
  length: DressLength;
  fabric: {
    type: FabricType;
    textureUrl: string;
    opacity: number;
    shininess: number;
    stretch: number;
  };
  measurements: Measurements;
  sizePreset: SizePreset;
};

export const defaultMeasurements: Measurements = {
  bust: 86,
  waist: 68,
  hip: 94,
  shoulder: 40,
  armLength: 58,
  height: 168,
};

export const defaultGarment: Garment = {
  silhouette: "A-line",
  neckline: "V-neck",
  sleeves: "Puff sleeves",
  layers: ["Lining"],
  closure: "Zipper",
  length: "Midi",
  fabric: {
    type: "Satin",
    textureUrl: "/fabric-textures/satin.svg",
    opacity: 1,
    shininess: 0.6,
    stretch: 0.2,
  },
  measurements: defaultMeasurements,
  sizePreset: "M",
};
