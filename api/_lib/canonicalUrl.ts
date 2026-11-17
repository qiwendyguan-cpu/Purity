// Same product page -> same canonical form, ignoring tracking parameters.
// Used as the dedup key for published products (unique in the database).
export const canonicalUrl = (url: string): string => {
  const u = new URL(url);
  for (const key of [...u.searchParams.keys()]) {
    if (/^(utm_|ref|tag|gclid|fbclid|srsltid|_pos|_sid|_ss|cid|clickid)/i.test(key)) u.searchParams.delete(key);
  }
  u.hash = "";
  return `${u.protocol}//${u.hostname.replace(/^www\./, "")}${u.pathname.replace(/\/$/, "")}${u.search}`.toLowerCase();
};
