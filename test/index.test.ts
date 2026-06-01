import { describe, expect, it } from "vitest";
import { calculateShippingFee } from "../src/index";

describe("calculateShippingFee", () => {
  it("calculates BKK to BKK correctly", () => {
    const result = calculateShippingFee({
      originZip: "10200",
      destZip: "11000",
      weight: 1.5,
    });
    expect(result.success).toBe(true);
    expect(result.fee).toBe(35);
    expect(result.details.routeType).toBe("BKK_BKK");
    expect(result.details.isRemoteArea).toBe(false);
  });

  it("calculates BKK to UPC correctly", () => {
    const result = calculateShippingFee({
      originZip: "10200",
      destZip: "50000",
      weight: 3.5,
    });
    expect(result.fee).toBe(77);
    expect(result.details.routeType).toBe("BKK_UPC");
  });

  it("adds remote area surcharge correctly", () => {
    const result = calculateShippingFee({
      originZip: "10200",
      destZip: "58000",
      weight: 1,
    });
    expect(result.fee).toBe(38 + 50); // BKK_UPC + 50
    expect(result.details.isRemoteArea).toBe(true);
    expect(result.details.surcharge).toBe(50);
  });

  it("throws an error if weight exceeds limits", () => {
    expect(() =>
      calculateShippingFee({
        originZip: "10200",
        destZip: "11000",
        weight: 10,
      }),
    ).toThrowError("Weight exceeds maximum supported limit");
  });
});
