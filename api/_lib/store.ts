// Community-added products, stored in Upstash Redis (Vercel Storage → Upstash for Redis).
// Talks to the Upstash REST API directly so no extra npm dependency is needed.

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

const PRODUCTS_KEY = "community:products";
const MAX_PRODUCTS = 300;

const config = () => {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : undefined;
};

export const storeConfigured = () => Boolean(config());

const redis = async <T>(...command: (string | number)[]): Promise<T> => {
  const c = config();
  if (!c) throw new Error("Storage is not configured");
  const res = await fetch(c.url, {
    method: "POST",
    headers: { Authorization: `Bearer ${c.token}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
  });
  const body = await res.json();
  if (!res.ok || body.error) throw new Error(body.error ?? `Redis error ${res.status}`);
  return body.result as T;
};

export const listProducts = async (): Promise<CommunityProduct[]> => {
  const flat = await redis<string[]>("HGETALL", PRODUCTS_KEY);
  const products: CommunityProduct[] = [];
  for (let i = 1; i < flat.length; i += 2) {
    try {
      products.push(JSON.parse(flat[i]));
    } catch {
      // skip corrupt entries
    }
  }
  return products.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
};

export const hasProduct = async (id: string) => (await redis<number>("HEXISTS", PRODUCTS_KEY, id)) === 1;

export const productCount = () => redis<number>("HLEN", PRODUCTS_KEY);

export const saveProduct = (product: CommunityProduct) =>
  redis<number>("HSET", PRODUCTS_KEY, product.id, JSON.stringify(product));

export { MAX_PRODUCTS };

// Fixed-window limit per visitor IP; returns false once the limit is exceeded
export const withinRateLimit = async (ip: string, limit = 10, windowSeconds = 3600) => {
  const key = `ratelimit:check:${ip}:${Math.floor(Date.now() / 1000 / windowSeconds)}`;
  const count = await redis<number>("INCR", key);
  if (count === 1) await redis("EXPIRE", key, windowSeconds);
  return count <= limit;
};
