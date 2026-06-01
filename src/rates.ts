export type RouteType =
  | "BKK_BKK"
  | "BKK_UPC"
  | "UPC_BKK"
  | "UPC_UPC_SAME_REGION"
  | "UPC_UPC_CROSS_REGION";

// MaxWeight, BKK_BKK, BKK_UPC, UPC_BKK, UPC_UPC_SAME_REGION, UPC_UPC_CROSS_REGION
export const RATES: number[][] = [
  [0.5, 29, 38, 35, 29, 38],
  [1.0, 29, 38, 35, 29, 38],
  [2.0, 35, 48, 48, 35, 48],
  [3.0, 42, 54, 54, 42, 54],
  [4.0, 55, 77, 73, 55, 77],
  [5.0, 55, 91, 86, 55, 91],
];

export const ROUTE_INDEX: Record<RouteType, number> = {
  BKK_BKK: 1,
  BKK_UPC: 2,
  UPC_BKK: 3,
  UPC_UPC_SAME_REGION: 4,
  UPC_UPC_CROSS_REGION: 5,
};
