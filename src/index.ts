import { type Region, getRegion } from "./mapping";
import { RATES, ROUTE_INDEX, type RouteType } from "./rates";
import { isRemoteArea } from "./remote-areas";

export interface ShippingFeeParams {
  originZip: string | number;
  destZip: string | number;
  weight: number;
}

export interface ShippingFeeResult {
  success: boolean;
  fee: number;
  details: {
    originRegion: Region;
    destRegion: Region;
    routeType: RouteType;
    baseFee: number;
    surcharge: number;
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
