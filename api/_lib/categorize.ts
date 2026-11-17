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

export const guessCategory = (name: string) => CATEGORY_KEYWORDS.find(([re]) => re.test(name))?.[1] ?? "other";
