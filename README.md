# thai-shipping-fee 🚚🇹🇭

[![npm version](https://img.shields.io/npm/v/thai-shipping-fee.svg)](https://www.npmjs.com/package/thai-shipping-fee)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

A lightweight, blazing-fast (O(1) lookup), and zero-dependency JavaScript/TypeScript library for calculating domestic shipping fees in Thailand. 

The calculation logic and rates are strictly based on the **Shopee Standard Delivery** matrix, including cross-region rules and remote area (islands/mountains) surcharges.

---

## 🌟 Features

- **Ultra Lightweight (< 5KB):** Uses smart 2-digit postal code prefix matching instead of shipping heavy geographic JSON databases.
- **High Performance:** Guaranteed O(1) time complexity lookups using native JavaScript Objects and `Set` structures.
- **Zero Dependencies:** Runs seamlessly on Node.js, Browsers, and Edge runtimes (e.g., Cloudflare Workers, Vercel Functions).
- **TypeScript First:** Built with TypeScript, providing strong typing and excellent Developer Experience (DX) out of the box.
- **Universal Support:** Pre-bundled into both `ESM` and `CommonJS` formats.

---

## 📦 Installation

You can install the package using your favorite package manager:

```bash
# Using npm
npm install thai-shipping-fee

# Using pnpm
pnpm add thai-shipping-fee

# Using yarn
yarn add thai-shipping-fee
```

---

## 🚀 Usage

### Basic Example

Simply provide the origin postal code, destination postal code, and the weight of the parcel (in kilograms).

```typescript
import { calculateShippingFee } from 'thai-shipping-fee';

try {
  const result = calculateShippingFee({
    originZip: '10200', // Bangkok (BKK)
    destZip: '50000',   // Chiang Mai (UPC)
    weight: 3.5         // Kilograms
  });

  console.log(`Total Fee: ${result.fee} THB`); 
  // Output: Total Fee: 77 THB
  
  console.log(result.details);
  /* Output:
  {
    originRegion: 'BKK_VICINITY',
    destRegion: 'NORTH',
    routeType: 'BKK_UPC',
    baseFee: 77,
    surcharge: 0,
    isRemoteArea: false
  }
  */
} catch (error) {
  console.error("Calculation Error:", error.message);
}
```

### Remote Area Example (Islands / Deep South)

If the destination is in a designated remote area (e.g., Mae Hong Son, Islands in Surat Thani, or the Deep South), an automatic **50 THB surcharge** is applied.

```typescript
import { calculateShippingFee } from 'thai-shipping-fee';

const result = calculateShippingFee({
  originZip: '10200', // Bangkok
  destZip: '58000',   // Mae Hong Son (Remote Area)
  weight: 1.0         // 1 Kg
});

console.log(result.fee); // 38 (Base) + 50 (Surcharge) = 88 THB
console.log(result.details.isRemoteArea); // true
console.log(result.details.surcharge); // 50
```

---

## 🧠 How It Works (Architecture)

To keep the library as small as possible for edge environments, we avoid loading massive JSON arrays of every sub-district in Thailand. 

1. **Prefix Mapping (`REGION_MAP`):** The library reads only the **first 2 digits** of the postal code to determine the region (`BKK_VICINITY`, `NORTH`, `NORTHEAST`, `SOUTH`, `UPC_OTHER`).
2. **Remote Area Checking (`REMOTE_AREAS`):** A static `Set` containing the exact 5-digit postal codes of remote areas is used to perform a fast `O(1)` check.
3. **Matrix Lookup (`RATES`):** Based on the regions, a `RouteType` is resolved (e.g., `BKK_BKK`, `UPC_UPC_CROSS_REGION`). This type and the provided weight are then used to pull the exact fee from a 2D rates matrix.

---

## 📖 API Reference

### `calculateShippingFee(params: ShippingFeeParams): ShippingFeeResult`

Calculates the total shipping fee and returns detailed routing information.

**Parameters:**

| Property | Type | Description |
| :--- | :--- | :--- |
| `originZip` | `string` \| `number` | The 5-digit postal code of the sender. |
| `destZip` | `string` \| `number` | The 5-digit postal code of the receiver. |
| `weight` | `number` | The weight of the parcel in kilograms (kg). |

**Returns:**

Returns an object (`ShippingFeeResult`) containing:

| Property | Type | Description |
| :--- | :--- | :--- |
| `success` | `boolean` | `true` if the calculation was successful. |
| `fee` | `number` | The total calculated fee (Base Fee + Surcharge) in THB. |
| `details.originRegion` | `Region` | The resolved region of the sender. |
| `details.destRegion` | `Region` | The resolved region of the receiver. |
| `details.routeType` | `RouteType` | The internal routing classification (e.g., `BKK_UPC`). |
| `details.baseFee` | `number` | The fee before any remote area surcharges. |
| `details.surcharge` | `number` | Additional charges applied (usually `50` or `0`). |
| `details.isRemoteArea` | `boolean` | `true` if the destination is a remote area. |

**Errors:**
- Throws an error if `weight` exceeds the maximum supported tier.
- Throws an error if required parameters are missing.

---

## 🛠️ Development & Testing

If you want to contribute or modify the package locally:

1. Clone the repository.
2. Install dependencies using `pnpm`:
   ```bash
   pnpm install
   ```
3. Run unit tests (powered by Vitest):
   ```bash
   pnpm test
   ```
4. Build the package (powered by tsup):
   ```bash
   pnpm build
   ```

---

## 🤖 LLM Use Cases (Scenarios)

This library is designed to be easily manipulated or tested by Large Language Models (LLMs). Here are a couple of scenarios:

- **Scenario 1: UI Generation & Testing**
  Prompt an LLM to generate a user interface (UI) to test and verify if the library calculates shipping fees correctly in a real-world application.

- **Scenario 2: Rate Adjustment (Easy)**
  You can instruct an LLM to override the default rates by writing a custom `rates.ts` file. You can utilize the core logic to generate a new rate configuration. The current rate structure can be found at: [src/rates.ts](https://github.com/ingpawat/Thai-Shipping-Fee/blob/main/src/rates.ts).

---

## 📄 License

This project is licensed under the MIT License.