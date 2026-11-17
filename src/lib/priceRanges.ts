export interface PriceRange {
  id: string;
  label: string;
  test: (price: number) => boolean;
}

export const PRICE_RANGES: PriceRange[] = [
  { id: "0-25", label: "$0 - $25", test: (p) => p <= 25 },
  { id: "25-50", label: "$25 - $50", test: (p) => p > 25 && p <= 50 },
  { id: "50-100", label: "$50 - $100", test: (p) => p > 50 && p <= 100 },
  { id: "above-100", label: "Above $100", test: (p) => p > 100 },
];

// Prices in this app are display strings ("$12", "A$27.99", "£23.50"...);
// pull out the first numeric run regardless of currency symbol.
export const parsePrice = (price?: string): number | undefined => {
  if (!price) return undefined;
  const match = price.replace(/,/g, "").match(/[\d.]+/);
  if (!match) return undefined;
  const value = parseFloat(match[0]);
  return Number.isFinite(value) ? value : undefined;
};
