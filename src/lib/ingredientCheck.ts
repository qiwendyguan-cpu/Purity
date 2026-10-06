// Shared by the How It Works checker (browser) and api/check-product (server),
// so keep imports relative: the API functions don't resolve the "@/" alias.
import {
  poreCloggingIngredients,
  poreCloggingCombinations,
  cautionIngredients,
  type PoreCloggingIngredient,
} from "../data/poreCloggingIngredients";

// Lowercase, drop "#"/"No." before numbers, and turn punctuation into spaces so
// "PEG-8 Stearate", "D&C Red No. 30" and "d&c red #30" compare equal.
const normalize = (text: string) =>
  text
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/\bno\.?\s*(?=\d)/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const containsTerm = (haystack: string, term: string) =>
  ` ${haystack} `.includes(` ${normalize(term)} `);

// Check both with and without parenthetical text, e.g. "Cocos Nucifera (Coconut) Oil"
const variantsOf = (ingredient: string) => [
  normalize(ingredient),
  normalize(ingredient.replace(/\([^)]*\)/g, " ")),
];

const matches = (ingredient: string, entry: PoreCloggingIngredient) =>
  variantsOf(ingredient).some((v) =>
    [entry.name, ...(entry.aliases ?? [])].some((term) => containsTerm(v, term)),
  );

export interface Finding {
  name: string;
  foundAs: string;
}

export interface CheckResult {
  checkedCount: number;
  poreClogging: Finding[];
  caution: Finding[];
}

export const splitIngredients = (input: string) =>
  input
    .replace(/^\s*ingredients\s*:/i, "")
    .split(/[,;\n•·]+/)
    .map((s) => s.trim().replace(/\.$/, ""))
    .filter(Boolean);

export const checkIngredients = (input: string): CheckResult => {
  const ingredients = splitIngredients(input);

  const poreClogging: Finding[] = [];
  const caution: Finding[] = [];
  const seen = new Set<string>();

  for (const ingredient of ingredients) {
    const hit = poreCloggingIngredients.find((entry) => matches(ingredient, entry));
    if (hit) {
      if (!seen.has(hit.name)) poreClogging.push({ name: hit.name, foundAs: ingredient });
      seen.add(hit.name);
      continue;
    }
    const mild = cautionIngredients.find((entry) => matches(ingredient, entry));
    if (mild && !seen.has(mild.name)) {
      caution.push({ name: mild.name, foundAs: ingredient });
      seen.add(mild.name);
    }
  }

  const all = normalize(ingredients.join(" , "));
  for (const combo of poreCloggingCombinations) {
    if (combo.requires.every((term) => containsTerm(all, term))) {
      poreClogging.push({ name: combo.name, foundAs: combo.requires.join(" + ") });
    }
  }

  return { checkedCount: ingredients.length, poreClogging, caution };
};
