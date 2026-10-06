// GET /api/community-products — products added through the link checker, newest first

import { listProducts, storeConfigured } from "./_lib/store.js";

export async function GET() {
  const products = storeConfigured() ? await listProducts().catch(() => []) : [];
  return new Response(JSON.stringify(products), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, s-maxage=30, stale-while-revalidate=300",
    },
  });
}
