import type { MaterialItem, PriceQuote } from "./types";

// ---------------------------------------------------------------------------
// Mock local pricing engine.
//
// In production this is where we'd call a retailer pricing API (Home Depot,
// Lowe's, local lumberyards) keyed off the user's ZIP. For the MVP we model a
// few "local" retailers with deterministic per-material base prices and a
// per-retailer multiplier + availability profile so the Cost Comparison view
// has something realistic to chew on.
// ---------------------------------------------------------------------------

interface RetailerProfile {
  name: string;
  multiplier: number;
  distanceMi: number;
  availability: PriceQuote["availability"];
}

const RETAILERS: RetailerProfile[] = [
  { name: "Hometown Hardware", multiplier: 1.0, distanceMi: 2.4, availability: "in-stock" },
  { name: "MegaBuild Warehouse", multiplier: 0.92, distanceMi: 6.1, availability: "in-stock" },
  { name: "Corner Lumber Co.", multiplier: 1.08, distanceMi: 1.2, availability: "limited" },
];

// Deterministic base unit prices (USD) by a normalized material key.
const BASE_PRICES: Record<string, number> = {
  "2x6x8 pt": 11.48,
  "2x6x8": 8.97,
  "2x8x8 cedar": 19.85,
  "2x4x8": 5.62,
  "4x4x8 pt": 14.3,
  "corner bracket": 3.85,
  "exterior screws": 9.97,
  "landscape fabric": 12.5,
  "garden soil": 6.97,
  "wood sealer": 24.5,
  default: 7.5,
};

function priceFor(item: MaterialItem): number {
  const key = item.spec.toLowerCase();
  for (const k of Object.keys(BASE_PRICES)) {
    if (k !== "default" && key.includes(k)) return BASE_PRICES[k];
  }
  // category fallbacks
  if (item.category === "soil") return BASE_PRICES["garden soil"];
  if (item.category === "hardware") return BASE_PRICES["corner bracket"];
  if (item.category === "liner") return BASE_PRICES["landscape fabric"];
  if (item.category === "finish") return BASE_PRICES["wood sealer"];
  return BASE_PRICES.default;
}

export function quoteRetailers(materials: MaterialItem[]): PriceQuote[] {
  return RETAILERS.map((r) => {
    const lineItems = materials.map((m) => {
      const unitPrice = Math.round(priceFor(m) * r.multiplier * 100) / 100;
      return {
        name: m.name,
        qty: m.quantity,
        unitPrice,
        total: Math.round(unitPrice * m.quantity * 100) / 100,
      };
    });
    const total = Math.round(lineItems.reduce((s, li) => s + li.total, 0) * 100) / 100;
    return {
      retailer: r.name,
      total,
      lineItems,
      availability: r.availability,
      distanceMi: r.distanceMi,
    };
  }).sort((a, b) => a.total - b.total);
}
