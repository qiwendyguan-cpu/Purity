// Scraped "brand" fields are sometimes polluted by loyalty-widget copy
// ("Earn 4,000 Bonus Points") or a store's own handle/slug ("storename-B2B")
// rather than an actual brand name. Reject anything implausible and fall
// back to the retailer name, which is already derived from a cleaner
// source (og:site_name).

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

const PROMO_KEYWORDS = /\b(earn|bonus|points?|rewards?|loyalty|save|off|sale|discount|subscribe|sign[\s-]?up|free shipping|gift card)\b/i;

const isPlausibleBrand = (brand: string, retailer?: string): boolean => {
  const trimmed = brand.trim();
  if (!trimmed || trimmed.length > 40) return false;
  if (trimmed.split(/\s+/).length > 5) return false;
  if (PROMO_KEYWORDS.test(trimmed)) return false;
  // Large/grouped numbers ("4,000", "2048") read as promo or product-code text, not a brand
  if (/\d{1,3}(,\d{3})+|\d{3,}/.test(trimmed)) return false;

  if (retailer) {
    const nb = normalize(trimmed);
    const nr = normalize(retailer);
    // A store's own slug/handle, possibly with a suffix like "-B2B" — same
    // entity as the retailer, not a distinct third-party brand worth keeping
    if (nb && nr && (nb.startsWith(nr) || nr.startsWith(nb))) return false;
  }

  return true;
};

export const sanitizeBrand = (rawBrand: string | undefined | null, retailer: string | undefined | null): string | undefined => {
  const candidate = rawBrand?.trim();
  const cleanRetailer = retailer?.trim();
  if (candidate && isPlausibleBrand(candidate, cleanRetailer)) return candidate;
  return cleanRetailer || undefined;
};
