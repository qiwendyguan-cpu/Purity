// Fetches a public web page on behalf of a visitor. Refuses private/internal
// addresses (including via redirects) so the function can't be used to reach
// anything that isn't on the public internet.

import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

const MAX_BYTES = 4_000_000;
const TIMEOUT_MS = 12_000;
const MAX_REDIRECTS = 4;

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
};

const isPrivateAddress = (ip: string) => {
  if (isIP(ip) === 6) {
    const v6 = ip.toLowerCase();
    if (v6.startsWith("::ffff:")) return isPrivateAddress(v6.slice(7));
    return v6 === "::1" || v6 === "::" || /^(fc|fd|fe8|fe9|fea|feb)/.test(v6);
  }
  const [a, b] = ip.split(".").map(Number);
  return (
    a === 10 || a === 127 || a === 0 || a >= 224 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 100 && b >= 64 && b <= 127)
  );
};

export class FetchError extends Error {
  constructor(public code: "invalid_url" | "blocked" | "unreachable" | "too_large", message: string) {
    super(message);
  }
}

const assertPublicUrl = async (url: URL) => {
  if (!["http:", "https:"].includes(url.protocol)) throw new FetchError("invalid_url", "Only http(s) links are supported.");
  if (url.username || url.password) throw new FetchError("invalid_url", "Links with credentials aren't supported.");
  if (url.port && !["80", "443"].includes(url.port)) throw new FetchError("invalid_url", "That link uses an unsupported port.");
  const host = url.hostname.replace(/^\[|\]$/g, "");
  const addresses = isIP(host) ? [{ address: host }] : await lookup(host, { all: true }).catch(() => []);
  if (addresses.length === 0) throw new FetchError("unreachable", "That website couldn't be found.");
  if (addresses.some((a) => isPrivateAddress(a.address))) throw new FetchError("invalid_url", "That link isn't a public website.");
};

export const fetchPublicPage = async (rawUrl: string): Promise<{ html: string; finalUrl: string; status: number }> => {
  let url: URL;
  try {
    url = new URL(rawUrl.trim());
  } catch {
    throw new FetchError("invalid_url", "That doesn't look like a valid link.");
  }

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    await assertPublicUrl(url);
    let res: Response;
    try {
      res = await fetch(url, { headers: BROWSER_HEADERS, redirect: "manual", signal: AbortSignal.timeout(TIMEOUT_MS) });
    } catch {
      throw new FetchError("unreachable", "The store's page didn't respond in time.");
    }

    if (res.status >= 300 && res.status < 400 && res.headers.get("location")) {
      url = new URL(res.headers.get("location")!, url);
      continue;
    }

    const length = Number(res.headers.get("content-length") ?? 0);
    if (length > MAX_BYTES) throw new FetchError("too_large", "That page is too large to read.");
    const html = (await res.text()).slice(0, MAX_BYTES);

    const looksLikeBotWall = html.length < 60000 && /captcha|robot or human|access denied|are you a human|px-captcha/i.test(html.slice(0, 20000));
    if (res.status === 401 || res.status === 403 || res.status === 429 || looksLikeBotWall) {
      throw new FetchError("blocked", "This store blocks automated page reading.");
    }
    if (!res.ok) throw new FetchError("unreachable", `The store's page returned an error (${res.status}).`);
    return { html, finalUrl: url.toString(), status: res.status };
  }
  throw new FetchError("unreachable", "That link redirected too many times.");
};
