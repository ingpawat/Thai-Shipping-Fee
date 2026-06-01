import { type Region, getRegion } from "./mapping";
import { RATES, ROUTE_INDEX, type RouteType } from "./rates";
import { isRemoteArea } from "./remote-areas";

/**
 * Parameters required to calculate the shipping fee.
 */
export interface ShippingFeeParams {
  /** The 5-digit postal code of the sender (Origin) */
  originZip: string | number;
  /** The 5-digit postal code of the receiver (Destination) */
  destZip: string | number;
  /** The weight of the parcel in kilograms (kg) */
  weight: number;
}

/**
 * The detailed result of the shipping fee calculation.
 */
export interface ShippingFeeResult {
  /** Indicates if the calculation was successful */
  success: boolean;
  /** The total calculated shipping fee (Base Fee + Surcharge) in THB */
  fee: number;
  details: {
    /** The resolved geographic region of the sender */
    originRegion: Region;
    /** The resolved geographic region of the receiver */
    destRegion: Region;
    /** The routing classification used to determine the rate */
    routeType: RouteType;
    /** The base fee before any remote area surcharges */
    baseFee: number;
    /** The additional remote area surcharge applied (0 or 50) */
    surcharge: number;
    /** True if the destination postal code is classified as a remote area */
    isRemoteArea: boolean;
  };
}

function getRouteType(originRegion: Region, destRegion: Region): RouteType {
  const isOriginBKK = originRegion === "BKK_VICINITY";
  const isDestBKK = destRegion === "BKK_VICINITY";

  if (isOriginBKK && isDestBKK) return "BKK_BKK";
  if (isOriginBKK && !isDestBKK) return "BKK_UPC";
  if (!isOriginBKK && isDestBKK) return "UPC_BKK";

  return originRegion === destRegion
    ? "UPC_UPC_SAME_REGION"
    : "UPC_UPC_CROSS_REGION";
}

/**
 * Calculates the domestic shipping fee in Thailand based on Shopee Standard Delivery rates.
 *
 * @param params - An object containing originZip, destZip, and weight.
 * @returns A ShippingFeeResult object with the total fee and routing details.
 * @throws Will throw an error if parameters are missing or if the weight exceeds the maximum limit (20kg).
 */
export function calculateShippingFee({
  originZip,
  destZip,
  weight,
}: ShippingFeeParams): ShippingFeeResult {
  if (!originZip || !destZip || weight === undefined) {
    throw new Error(
      "Missing required parameters: originZip, destZip, or weight",
    );
  }

  const originRegion = getRegion(originZip);
  const destRegion = getRegion(destZip);

  const routeType = getRouteType(originRegion, destRegion);
  const columnIndex = ROUTE_INDEX[routeType];

  const rateRow = RATES.find((row) => weight <= row[0]);
  if (!rateRow) {
    throw new Error("Weight exceeds maximum supported limit");
  }

  const baseFee = rateRow[columnIndex];
  const isRemote = isRemoteArea(destZip);
  const surcharge = isRemote ? 50 : 0;

  return {
    success: true,
    fee: baseFee + surcharge,
    details: {
      originRegion,
      destRegion,
      routeType,
      baseFee,
      surcharge,
      isRemoteArea: isRemote,
    },
  };
}
