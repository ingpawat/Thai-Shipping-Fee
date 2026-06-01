export type Region =
  | "BKK_VICINITY"
  | "NORTH"
  | "NORTHEAST"
  | "SOUTH"
  | "UPC_OTHER";

export const REGION_MAP: Record<string, Region> = {
  // BKK & Vicinity
  "10": "BKK_VICINITY",
  "11": "BKK_VICINITY",
  "12": "BKK_VICINITY",
  "13": "BKK_VICINITY",
  "73": "BKK_VICINITY", // Nakhon Pathom

  // North
  "50": "NORTH",
  "51": "NORTH",
  "52": "NORTH",

  // Northeast
  "30": "NORTHEAST",
  "40": "NORTHEAST",

  // South
  "80": "SOUTH",
  "83": "SOUTH",
  "90": "SOUTH",
};

export function getRegion(postalCode: string | number): Region {
  const prefix = postalCode.toString().substring(0, 2);
  return REGION_MAP[prefix] || "UPC_OTHER";
}
