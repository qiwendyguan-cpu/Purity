// Pulls product details and an ingredient list out of a retailer's HTML page
// using structured data (JSON-LD, meta tags, embedded JSON) and text heuristics.

export interface ExtractedProduct {
  name?: string;
  brand?: string;
  image?: string;
  price?: number;
  currency?: string;
  availability?: "in_stock" | "out_of_stock" | "unknown";
  hasCartButton: boolean;
  siteName?: string;
  ingredients?: string;
}

const decodeEntities = (s: string) =>
  s
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;|&#x27;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));

const stripTags = (html: string) => decodeEntities(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

// Visible text with line breaks at block boundaries, so a section ends where the page's block ends
const htmlToText = (html: string) =>
  decodeEntities(
    html
      .replace(/<(script|style|noscript|svg|template)[\s\S]*?<\/\1>/gi, " ")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/?(p|div|li|ul|ol|h[1-6]|section|article|tr|td|dd|dt|details|summary|button)[^>]*>/gi, "\n")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/[ \t\r\f\v]+/g, " ")
    .replace(/\n\s*/g, "\n");

const meta = (html: string, key: string) => {
  const re = new RegExp(
    `<meta[^>]+(?:property|name|itemprop)=["']${key}["'][^>]*content=["']([^"']*)["']|<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name|itemprop)=["']${key}["']`,
    "i",
  );
  const m = html.match(re);
  const value = m?.[1] ?? m?.[2];
  return value ? decodeEntities(value).trim() : undefined;
};

// Walk JSON-LD blocks (including @graph arrays) looking for a Product
const findJsonLdProduct = (html: string): Record<string, any> | undefined => {
  const blocks = html.match(/<script[^>]+application\/ld\+json[^>]*>[\s\S]*?<\/script>/gi) ?? [];
  const visit = (node: any): any => {
    if (!node || typeof node !== "object") return undefined;
    if (Array.isArray(node)) {
      for (const n of node) {
        const hit = visit(n);
        if (hit) return hit;
      }
      return undefined;
    }
    const type = node["@type"];
    if (type === "Product" || (Array.isArray(type) && type.includes("Product"))) return node;
    return visit(node["@graph"]) ?? visit(node.mainEntity);
  };
  for (const block of blocks) {
    try {
      const json = JSON.parse(block.replace(/^<script[^>]*>|<\/script>$/gi, "").trim());
      const product = visit(json);
      if (product) return product;
    } catch {
      // Malformed JSON-LD is common; skip it
    }
  }
  return undefined;
};

const firstImage = (image: any): string | undefined => {
  if (!image) return undefined;
  if (typeof image === "string") return image;
  if (Array.isArray(image)) return firstImage(image[0]);
  return image.url ?? image.contentUrl;
};

const MIN_INGREDIENTS = 5;
const NOT_INCI_WORDS = /\b(the|your|you|our|we|helps?|use|apply|please|click|shop|order|free|reviews?|delivery|cart|learn|more|this|with|for|and)\b/i;
const INCI_LOOKING = /(ate|ide|ine|ol|ene|one|ane|oil|acid|extract|water|aqua|butter|wax|gum|ester|in|il|ose|cone|oxide|ium|ic|yl)\b/i;

// Strict check that a single block of text is a comma-separated INCI list.
// Navigation menus, marketing copy and disclaimers must fail this, because a
// false "list" would wrongly pass a product.
const inciListScore = (text: string): number | undefined => {
  if (!text || text.includes("\n") || text.length > 6000) return undefined;
  const parts = text.split(/[,;]/).map((p) => p.trim().replace(/\.$/, "")).filter(Boolean);
  if (parts.length < MIN_INGREDIENTS) return undefined;
  const plausible = parts.filter(
    (p) => p.length >= 2 && p.length <= 70 && /^[\p{L}\d(]/u.test(p) && p.split(/\s+/).length <= 7 && !NOT_INCI_WORDS.test(p.replace(/\(.*?\)/g, "")),
  );
  const inciLike = parts.filter((p) => INCI_LOOKING.test(p.replace(/\(.*?\)|\d+(\.\d+)?\s*%?/g, "").trim()));
  if (plausible.length / parts.length < 0.85 || inciLike.length / parts.length < 0.5) return undefined;
  return parts.length + (/\b(aqua|water|eau)\b/i.test(text) ? 10 : 0);
};

// Trim a candidate to the list itself: lists usually end in "." followed by a disclaimer
const trimCandidate = (raw: string) => {
  let text = raw.replace(/^\s*(ingredients?|inci|full ingredients? list)\s*[:\-–]?\s*/i, "").trim();
  const sentenceBreak = text.search(/\.\s+(?=[A-Z*]|Please|May contain|Subject to)/);
  if (sentenceBreak > 40) text = text.slice(0, sentenceBreak);
  return text.trim();
};

// "Key ingredients", "Free from", "Hero ingredients"... are partial lists, not the full list
const PARTIAL_LIST_LABEL = /(key|hero|star|active|featured|highlighted|free (of|from)|without|no|clean|powerful|main)\s*$/i;

const findIngredients = (html: string): string | undefined => {
  const candidates: string[] = [];

  // 1. Embedded JSON fields (Shopify, Next.js and retailer app data)
  const jsonField = /"(?:ingredients|ingredientList|ingredient_list|ingredientsList|inci|fullIngredients|ingredients_text)"\s*:\s*"((?:[^"\\]|\\.){20,8000})"/gi;
  for (const m of html.matchAll(jsonField)) {
    let value: string;
    try {
      value = JSON.parse(`"${m[1]}"`);
    } catch {
      value = m[1];
    }
    // The field may hold HTML; check each block separately
    candidates.push(...htmlToText(value).split("\n"));
  }

  // 2. Visible text following an "Ingredients" label: the rest of that line, or the next few lines
  const text = htmlToText(html);
  for (const m of text.matchAll(/\b(?:full )?ingredients?(?: list)?\b\s*[:\-–]?/gi)) {
    if (PARTIAL_LIST_LABEL.test(text.slice(Math.max(0, m.index! - 20), m.index!))) continue;
    const lines = text.slice(m.index! + m[0].length, m.index! + m[0].length + 8000).split("\n");
    candidates.push(...lines.slice(0, 4));
  }

  let best: { text: string; score: number } | undefined;
  for (const c of candidates) {
    const trimmed = trimCandidate(c);
    const score = inciListScore(trimmed);
    if (score !== undefined && (!best || score > best.score)) best = { text: trimmed, score };
  }
  return best?.text;
};

export const extractProduct = (html: string): ExtractedProduct => {
  const ld = findJsonLdProduct(html);
  const offers = Array.isArray(ld?.offers) ? ld.offers[0] : ld?.offers;
  const offer = offers?.offers ? (Array.isArray(offers.offers) ? offers.offers[0] : offers.offers) : offers;

  const priceRaw = offer?.price ?? offer?.lowPrice ?? meta(html, "product:price:amount") ?? meta(html, "og:price:amount");
  const price = priceRaw != null ? Number(String(priceRaw).replace(/[^0-9.]/g, "")) : undefined;

  const availabilityRaw = String(offer?.availability ?? meta(html, "product:availability") ?? "");
  const availability = /outofstock|out of stock|soldout|discontinued/i.test(availabilityRaw)
    ? "out_of_stock"
    : /instock|in stock|limitedavailability|onlineonly/i.test(availabilityRaw)
      ? "in_stock"
      : "unknown";

  const brand = typeof ld?.brand === "string" ? ld.brand : ld?.brand?.name;

  return {
    name: (ld?.name && stripTags(String(ld.name))) || meta(html, "og:title"),
    brand: brand ? stripTags(String(brand)) : meta(html, "product:brand"),
    image: firstImage(ld?.image) ?? meta(html, "og:image"),
    price: price && Number.isFinite(price) && price > 0 ? price : undefined,
    currency: offer?.priceCurrency ?? meta(html, "product:price:currency") ?? meta(html, "og:price:currency"),
    availability,
    hasCartButton: /add[\s-]*to[\s-]*(cart|bag|basket|trolley)|buy now|ajouter au panier|in den warenkorb|zum warenkorb/i.test(html),
    siteName: meta(html, "og:site_name"),
    ingredients: findIngredients(html),
  };
};
