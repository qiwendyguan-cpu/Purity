import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Search, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";
import {
  poreCloggingIngredients,
  poreCloggingCombinations,
  cautionIngredients,
  type PoreCloggingIngredient,
} from "@/data/poreCloggingIngredients";

const MAX_LENGTH = 6000;

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

interface Finding {
  name: string;
  foundAs: string;
}

interface CheckResult {
  checkedCount: number;
  poreClogging: Finding[];
  caution: Finding[];
}

const checkIngredients = (input: string): CheckResult => {
  const ingredients = input
    .replace(/^\s*ingredients\s*:/i, "")
    .split(/[,;\n•·]+/)
    .map((s) => s.trim().replace(/\.$/, ""))
    .filter(Boolean);

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

export const PoreCloggingChecker = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<CheckResult | null>(null);

  const handleCheck = () => setResult(checkIngredients(input));
  const handleClear = () => {
    setInput("");
    setResult(null);
  };

  return (
    <Card className="overflow-hidden rounded-2xl border-sage/30 shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-[55%_45%]">
        {/* Checker */}
        <div className="p-6 md:p-10 space-y-5">
          <h2 className="text-3xl md:text-4xl leading-tight">
            <span className="font-light">Pore-Clogging </span>
            <span className="font-bold">Ingredients Checker</span>
          </h2>
          <p className="text-sm text-muted-foreground">
            Check any skincare, makeup, or hair product for pore-clogging ingredients. Search the
            full product name plus "ingredients", copy the ingredient list, and paste it below.
          </p>
          <div>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. Water, Glycerin, Isopropyl Myristate, Cetearyl Alcohol, Shea Butter…"
              maxLength={MAX_LENGTH}
              rows={8}
              className="resize-y bg-background text-base"
              aria-label="Ingredient list"
            />
            {input.length > MAX_LENGTH - 200 && (
              <p className="text-xs text-destructive text-right mt-1">
                {MAX_LENGTH - input.length} characters remaining
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleCheck}
              disabled={!input.trim()}
              size="lg"
              className="rounded-full shadow-md gap-2"
            >
              <Search className="h-4 w-4" />
              Check Ingredients
            </Button>
            <Button onClick={handleClear} variant="outline" size="lg" className="rounded-full">
              Clear
            </Button>
          </div>
        </div>

        {/* Image, replaced by results after a check */}
        {result ? (
          <div className="p-6 md:p-10 md:pl-4 flex flex-col justify-center space-y-4 bg-gradient-to-br from-cream/40 to-background" aria-live="polite">
            {result.poreClogging.length > 0 ? (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">
                      {result.poreClogging.length} pore-clogging ingredient
                      {result.poreClogging.length > 1 ? "s" : ""} found
                    </p>
                    <p className="text-sm text-muted-foreground">This product is not acne-safe.</p>
                  </div>
                </div>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {result.poreClogging.map((f) => (
                    <li
                      key={f.name}
                      title={`Found as: ${f.foundAs}`}
                      className="rounded-full bg-background border border-destructive/30 px-3 py-1 text-xs font-medium"
                    >
                      {f.name}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="rounded-xl border border-primary/30 bg-primary/10 p-4 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">No pore-clogging ingredients found</p>
                  <p className="text-sm text-muted-foreground">
                    None of the {result.checkedCount} ingredient{result.checkedCount === 1 ? "" : "s"} you
                    entered are on our pore-clogging list.
                  </p>
                </div>
              </div>
            )}

            {result.caution.length > 0 && (
              <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 flex items-start gap-3">
                <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Use with caution</p>
                  <p className="text-sm text-muted-foreground">
                    {result.caution.map((f) => f.name).join(", ")}{" "}
                    {result.caution.length > 1 ? "are" : "is"} mildly comedogenic and can be a problem
                    when combined with other pore-clogging ingredients.
                  </p>
                </div>
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              Checked {result.checkedCount} ingredient{result.checkedCount === 1 ? "" : "s"}. Formulas
              change, so always confirm against the ingredient list on the actual package. Labels like
              "non-comedogenic" or "won't clog pores" don't guarantee a product is acne-safe.
            </p>
          </div>
        ) : (
          <div className="relative hidden md:block min-h-[320px]">
            <img
              src={heroBanner}
              alt=""
              className="absolute inset-0 w-full h-full object-cover object-right"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-card via-card/40 to-transparent" />
          </div>
        )}
      </div>
    </Card>
  );
};
