// POST /api/check-product  { url }
// Reads a product page, finds its ingredient list, checks it against the
// pore-clogging list, and publishes passing in-stock products to the home page.

import { createHash } from "node:crypto";
import { checkIngredients, type CheckResult } from "../src/lib/ingredientCheck";
import { extractProduct, type ExtractedProduct } from "./_lib/extractProduct";
import { fetchPublicPage, FetchError } from "./_lib/safeFetch";
import {
  hasProduct,
  productCount,
  saveProduct,
  storeConfigured,
  withinRateLimit,
  MAX_PRODUCTS,
  type CommunityProduct,
} from "./_lib/store";

type Status = "invalid" | "blocked" | "unreachable" | "no_ingredients" | "pore_clogging" | "passed" | "rate_limited";

interface Response_ {
  status: Status;
  message: string;
  product?: { name?: string; brand?: string; image?: string; price?: string; retailer: string; url: string };
  ingredients?: string;
  result?: CheckResult;
  published?: boolean;
  publishNote?: string;
}

const json = (body: Response_, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });

// Short lists are often fragments of the real list; don't auto-publish on them
const MIN_INGREDIENTS_TO_PUBLISH = 8;

const CURRENCY_SYMBOLS: Record<string, string> = { USD: "$", AUD: "A$", CAD: "C$", NZD: "NZ$", GBP: "£", EUR: "€", JPY: "¥" };

const formatPrice = (price?: number, currency?: string) => {
  if (!price) return undefined;
  const code = (currency ?? "USD").toUpperCase();
  const amount = price.toFixed(code === "JPY" ? 0 : 2);
  return CURRENCY_SYMBOLS[code] ? `${CURRENCY_SYMBOLS[code]}${amount}` : `${code} ${amount}`;
};

const CATEGORY_KEYWORDS: [RegExp, string][] = [
  [/\b(sunscreen|sun ?cream|spf|sunblock|sun protect)/i, "sunscreen"],
  [/\b(body wash|shower gel|shower cream)/i, "body wash"],
  [/\bdry shampoo/i, "dry shampoo"],
  [/\bshampoo/i, "shampoo"],
  [/\bconditioner/i, "conditioner"],
  [/\b(cleanser|face wash|cleansing)/i, "cleanser"],
  [/\b(toner|essence)/i, "toner"],
  [/\bserum/i, "serum"],
  [/\b(moisturi[sz]er|moisturi[sz]ing cream|face cream|lotion|gel cream)/i, "moisturizer"],
  [/\b(hair ?spray)/i, "hair spray"],
  [/\b(foundation|concealer|primer|powder|blush|bronzer|mascara|lipstick|setting spray)/i, "makeup"],
  [/\bmask\b/i, "mask"],
];
const guessCategory = (name: string) => CATEGORY_KEYWORDS.find(([re]) => re.test(name))?.[1] ?? "other";

// Same product page → same id, ignoring tracking parameters
const canonicalUrl = (url: string) => {
  const u = new URL(url);
  for (const key of [...u.searchParams.keys()]) {
    if (/^(utm_|ref|tag|gclid|fbclid|srsltid|_pos|_sid|_ss|cid|clickid)/i.test(key)) u.searchParams.delete(key);
  }
  u.hash = "";
  return `${u.protocol}//${u.hostname.replace(/^www\./, "")}${u.pathname.replace(/\/$/, "")}${u.search}`.toLowerCase();
};

const retailerName = (extracted: ExtractedProduct, url: string) => {
  if (extracted.siteName && extracted.siteName.length <= 40) return extracted.siteName;
  const host = new URL(url).hostname.replace(/^www\./, "");
  const base = host.split(".")[0];
  return base.charAt(0).toUpperCase() + base.slice(1);
};

// "Product Name | Store" → "Product Name"
const cleanName = (name: string | undefined, retailer: string) => {
  if (!name) return undefined;
  const parts = name.split(/\s+[|–—-]\s+/);
  const trimmed = parts.length > 1 && parts[parts.length - 1].toLowerCase().includes(retailer.toLowerCase().split(" ")[0])
    ? parts.slice(0, -1).join(" - ")
    : name;
  return trimmed.trim().slice(0, 140);
};

export async function POST(request: Request) {
  let url: string | undefined;
  try {
    url = (await request.json())?.url;
  } catch {
    // fall through to validation below
  }
  if (!url || typeof url !== "string" || url.length > 2000) {
    return json({ status: "invalid", message: "Please paste a product link starting with https://" }, 400);
  }

  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || request.headers.get("x-real-ip") || "unknown";
  if (storeConfigured() && !(await withinRateLimit(ip).catch(() => true))) {
    return json({ status: "rate_limited", message: "You've checked a lot of links. Please try again in an hour." }, 429);
  }

  let page: Awaited<ReturnType<typeof fetchPublicPage>>;
  try {
    page = await fetchPublicPage(url);
  } catch (err) {
    if (err instanceof FetchError) {
      const status: Status = err.code === "blocked" ? "blocked" : err.code === "invalid_url" ? "invalid" : "unreachable";
      const hint = err.code === "blocked" ? " Copy the ingredient list from the page and paste it in the box above instead." : "";
      return json({ status, message: err.message + hint });
    }
    return json({ status: "unreachable", message: "We couldn't open that page." });
  }

  const extracted = extractProduct(page.html);
  const retailer = retailerName(extracted, page.finalUrl);
  const name = cleanName(extracted.name, retailer);
  const imageUrl = extracted.image ? new URL(extracted.image, page.finalUrl).toString().replace(/^http:\/\//, "https://") : undefined;
  const image = imageUrl && !/no-image|placeholder|\.gif(\?|$)/i.test(imageUrl) ? imageUrl : undefined;
  const price = formatPrice(extracted.price, extracted.currency);
  const productInfo = { name, brand: extracted.brand, image, price, retailer, url: page.finalUrl };

  if (!extracted.ingredients) {
    return json({
      status: "no_ingredients",
      message: "We couldn't find an ingredient list on that page. Copy the ingredients from the page and paste them in the box above instead.",
      product: productInfo,
    });
  }

  const result = checkIngredients(extracted.ingredients);
  if (result.poreClogging.length > 0) {
    return json({
      status: "pore_clogging",
      message: "This product contains pore-clogging ingredients.",
      product: productInfo,
      ingredients: extracted.ingredients,
      result,
    });
  }

  // Passed: publish to the home page if it's a buyable product with the details a card needs
  const base = { status: "passed" as const, message: "No pore-clogging ingredients found.", product: productInfo, ingredients: extracted.ingredients, result };
  const id = `c-${createHash("sha1").update(canonicalUrl(page.finalUrl)).digest("hex").slice(0, 12)}`;

  let publishNote: string | undefined;
  if (result.checkedCount < MIN_INGREDIENTS_TO_PUBLISH)
    publishNote = "Not added to the home page: the ingredient list we found looks incomplete. Please confirm it against the package.";
  else if (!storeConfigured()) publishNote = "Adding products to the home page isn't set up yet.";
  else if (!name || !image?.startsWith("https://")) publishNote = "Not added to the home page: we couldn't read the product's name or photo.";
  else if (extracted.availability === "out_of_stock") publishNote = "Not added to the home page: this product is out of stock.";
  else if (!extracted.hasCartButton && extracted.availability !== "in_stock") publishNote = "Not added to the home page: we couldn't confirm this page sells the product.";

  if (publishNote) return json({ ...base, published: false, publishNote });

  try {
    if (await hasProduct(id)) return json({ ...base, published: true, publishNote: "This product is already on Purity's home page." });
    if ((await productCount()) >= MAX_PRODUCTS) return json({ ...base, published: false, publishNote: "Not added: the community product list is full." });

    const product: CommunityProduct = {
      id,
      name: name!,
      brand: (extracted.brand ?? retailer).slice(0, 60),
      category: guessCategory(name!),
      price,
      image: image!,
      externalUrl: page.finalUrl,
      retailer,
      linkToShop: true,
      createdAt: new Date().toISOString(),
    };
    await saveProduct(product);
    return json({ ...base, published: true, publishNote: "Added to Purity's home page." });
  } catch {
    return json({ ...base, published: false, publishNote: "Not added: saving the product failed. Please try again." });
  }
}
