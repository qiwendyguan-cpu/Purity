// Community-added products, stored in Supabase (Lovable Cloud). Writes only go
// through the `publish_product()` SECURITY DEFINER function in the database —
// the anon key used here cannot INSERT/UPDATE/DELETE the table directly, and
// `publish_product` itself dedupes on the unique `canonical_url` column.

import { createClient } from "@supabase/supabase-js";

export interface CommunityProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  price?: string;
  image: string;
  externalUrl: string;
  retailer: string;
  linkToShop: true;
  createdAt: string;
}

const MAX_PRODUCTS = 300;

const config = () => {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  return url && key ? { url, key } : undefined;
};

export const storeConfigured = () => Boolean(config());

const client = () => {
  const c = config();
  if (!c) throw new Error("Storage is not configured");
  return createClient(c.url, c.key, { auth: { persistSession: false } });
};

interface ProductRow {
  id: string;
  name: string;
  brand: string | null;
  category: string | null;
  price_text: string | null;
  image: string | null;
  image_url: string | null;
  external_url: string | null;
  retailer: string | null;
  created_at: string;
}

const PRODUCT_COLUMNS = "id, name, brand, category, price_text, image, image_url, external_url, retailer, created_at";

const toCommunityProduct = (row: ProductRow): CommunityProduct => ({
  id: row.id,
  name: row.name,
  brand: row.brand ?? "",
  category: row.category ?? "other",
  price: row.price_text ?? undefined,
  image: row.image ?? row.image_url ?? "/placeholder.svg",
  externalUrl: row.external_url ?? "",
  retailer: row.retailer ?? "",
  linkToShop: true,
  createdAt: row.created_at,
});

// Pre-existing catalog rows (seeded before this feature) have no canonical_url;
// only rows published through the checker carry one, so it's the filter that
// distinguishes "community product" from "legacy catalog row" in this table.
export const listProducts = async (): Promise<CommunityProduct[]> => {
  const { data, error } = await client()
    .from("products")
    .select(PRODUCT_COLUMNS)
    .not("canonical_url", "is", null)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(toCommunityProduct);
};

export const hasProduct = async (canonical: string): Promise<boolean> => {
  const { count, error } = await client()
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("canonical_url", canonical);
  if (error) throw new Error(error.message);
  return (count ?? 0) > 0;
};

export const productCount = async (): Promise<number> => {
  const { count, error } = await client()
    .from("products")
    .select("id", { count: "exact", head: true })
    .not("canonical_url", "is", null);
  if (error) throw new Error(error.message);
  return count ?? 0;
};

export interface PublishInput {
  canonicalUrl: string;
  name: string;
  brand?: string;
  category?: string;
  price: string;
  image: string;
  externalUrl: string;
  retailer?: string;
  ingredients?: string;
  checkResult?: unknown;
  source: "link" | "manual";
}

export const saveProduct = async (input: PublishInput): Promise<CommunityProduct> => {
  const { data, error } = await client().rpc("publish_product", {
    p_canonical_url: input.canonicalUrl,
    p_name: input.name,
    p_brand: input.brand ?? null,
    p_category: input.category ?? null,
    p_price: input.price,
    p_image: input.image,
    p_external_url: input.externalUrl,
    p_retailer: input.retailer ?? null,
    p_ingredients: input.ingredients ?? null,
    p_check_result: input.checkResult ?? null,
    p_source: input.source,
  });
  if (error) throw new Error(error.message);
  const row = (Array.isArray(data) ? data[0] : data) as ProductRow | undefined;
  if (!row) throw new Error("Publish failed");
  return toCommunityProduct(row);
};

export { MAX_PRODUCTS };

// Rate limiting previously ran on Upstash Redis, which was never actually
// provisioned (storeConfigured() was false in production), so no request was
// ever throttled live. There's no equivalent on Supabase yet, so this is a
// deliberate no-op until a real limiter is added.
export const withinRateLimit = async (_ip: string, _limit = 10, _windowSeconds = 3600) => true;
