// POST /api/publish-manual-product  { name, brand?, price, externalUrl, ingredients }
// For the "paste an ingredient list" path, which has no scraped page to pull a
// name/photo/price from. The ingredient check is re-run here server-side —
// the client's "this passed" is never trusted on its own.

import { checkIngredients, type CheckResult } from "../src/lib/ingredientCheck.js";
import { canonicalUrl } from "./_lib/canonicalUrl.js";
import { guessCategory } from "./_lib/categorize.js";
import { MIN_INGREDIENTS_TO_PUBLISH } from "./check-product.js";
import { hasProduct, productCount, saveProduct, storeConfigured, MAX_PRODUCTS } from "./_lib/store.js";

interface Body {
  name?: string;
  brand?: string;
  price?: string;
  externalUrl?: string;
  ingredients?: string;
}

interface Response_ {
  status: "invalid" | "pore_clogging" | "passed";
  message: string;
  result?: CheckResult;
  published?: boolean;
  publishNote?: string;
}

const json = (body: Response_, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });

const retailerFromUrl = (url: string) => {
  const host = new URL(url).hostname.replace(/^www\./, "");
  const base = host.split(".")[0];
  return base.charAt(0).toUpperCase() + base.slice(1);
};

export async function POST(request: Request) {
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return json({ status: "invalid", message: "Invalid request." }, 400);
  }

  const name = body.name?.trim().slice(0, 140);
  const brand = body.brand?.trim().slice(0, 60);
  const price = body.price?.trim();
  const ingredients = body.ingredients?.trim();

  if (!name) return json({ status: "invalid", message: "Please enter the product's name." }, 400);
  if (!price) return json({ status: "invalid", message: "Please enter the product's price." }, 400);
  if (!ingredients) return json({ status: "invalid", message: "Please paste the ingredient list." }, 400);

  let externalUrl: string;
  try {
    const u = new URL(body.externalUrl?.trim() ?? "");
    if (!/^https?:$/.test(u.protocol)) throw new Error("not http(s)");
    externalUrl = u.toString();
  } catch {
    return json({ status: "invalid", message: "Please enter a valid shop link starting with https://" }, 400);
  }

  // Never trust the client's own verdict — recompute the check server-side.
  const result = checkIngredients(ingredients);
  if (result.poreClogging.length > 0) {
    return json({ status: "pore_clogging", message: "This product contains pore-clogging ingredients.", result });
  }

  const base = { status: "passed" as const, message: "No pore-clogging ingredients found.", result };
  const canonical = canonicalUrl(externalUrl);

  let publishNote: string | undefined;
  if (result.checkedCount < MIN_INGREDIENTS_TO_PUBLISH)
    publishNote = "Not added to the home page: that ingredient list looks incomplete. Please confirm it against the package.";
  else if (!storeConfigured()) publishNote = "Adding products to the home page isn't set up yet.";

  if (publishNote) return json({ ...base, published: false, publishNote });

  try {
    if (await hasProduct(canonical)) return json({ ...base, published: true, publishNote: "This product is already on Purity's home page." });
    if ((await productCount()) >= MAX_PRODUCTS) return json({ ...base, published: false, publishNote: "Not added: the community product list is full." });

    await saveProduct({
      canonicalUrl: canonical,
      name,
      brand: brand ?? retailerFromUrl(externalUrl),
      category: guessCategory(name),
      price,
      image: "/placeholder.svg",
      externalUrl,
      retailer: retailerFromUrl(externalUrl),
      ingredients,
      checkResult: result,
      source: "manual",
    });
    return json({ ...base, published: true, publishNote: "Added to Purity's home page." });
  } catch {
    return json({ ...base, published: false, publishNote: "Not added: saving the product failed. Please try again." });
  }
}
