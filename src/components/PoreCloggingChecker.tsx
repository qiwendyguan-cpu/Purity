import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search, AlertTriangle, CheckCircle2, Info, Link2, Loader2, Store } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";
import { checkIngredients, type CheckResult } from "@/lib/ingredientCheck";

const MAX_LENGTH = 6000;

// Response from /api/check-product
interface LinkCheckResponse {
  status: "invalid" | "blocked" | "unreachable" | "no_ingredients" | "pore_clogging" | "passed" | "rate_limited";
  message: string;
  product?: { name?: string; brand?: string; image?: string; price?: string; retailer: string; url: string };
  ingredients?: string;
  result?: CheckResult;
  published?: boolean;
  publishNote?: string;
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

const IngredientResult = ({ result }: { result: CheckResult }) => (
  <>
    {result.poreClogging.length > 0 ? (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">{plural(result.poreClogging.length, "pore-clogging ingredient")} found</p>
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
            None of the {plural(result.checkedCount, "ingredient")} checked are on our pore-clogging list.
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
            {result.caution.map((f) => f.name).join(", ")} {result.caution.length > 1 ? "are" : "is"} mildly
            comedogenic and can be a problem when combined with other pore-clogging ingredients.
          </p>
        </div>
      </div>
    )}
  </>
);

const LinkResult = ({ data }: { data: LinkCheckResponse }) => {
  const { product } = data;
  return (
    <>
      {product?.name && (
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl border bg-background p-3 hover:shadow-sm transition-shadow"
        >
          {product.image && <img src={product.image} alt="" className="h-14 w-14 rounded-md object-contain bg-white" />}
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">{product.brand ?? product.retailer}</p>
            <p className="text-sm font-medium line-clamp-2">{product.name}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Store className="h-3 w-3" /> {product.retailer}
              {product.price && ` · ${product.price}`}
            </p>
          </div>
        </a>
      )}

      {data.result ? (
        <IngredientResult result={data.result} />
      ) : (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm">{data.message}</p>
        </div>
      )}

      {data.status === "passed" && data.publishNote && (
        <p className={`text-sm flex items-start gap-2 ${data.published ? "text-primary font-medium" : "text-muted-foreground"}`}>
          {data.published ? <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" /> : <Info className="h-4 w-4 mt-0.5 shrink-0" />}
          <span>
            {data.publishNote}{" "}
            {data.published && (
              <Link to="/" className="underline">
                See it on the home page
              </Link>
            )}
          </span>
        </p>
      )}

      {data.ingredients && (
        <details className="text-xs text-muted-foreground">
          <summary className="cursor-pointer">Ingredients we found on the page</summary>
          <p className="mt-2 leading-relaxed">{data.ingredients}</p>
        </details>
      )}
    </>
  );
};

export const PoreCloggingChecker = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<CheckResult | null>(null);
  const [link, setLink] = useState("");
  const [linkLoading, setLinkLoading] = useState(false);
  const [linkResult, setLinkResult] = useState<LinkCheckResponse | null>(null);

  const handleCheck = () => {
    setLinkResult(null);
    setResult(checkIngredients(input));
  };

  const handleClear = () => {
    setInput("");
    setResult(null);
    setLink("");
    setLinkResult(null);
  };

  const handleCheckLink = async () => {
    const url = /^https?:\/\//i.test(link.trim()) ? link.trim() : `https://${link.trim()}`;
    setResult(null);
    setLinkLoading(true);
    try {
      const res = await fetch("/api/check-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      setLinkResult(await res.json());
    } catch {
      setLinkResult({ status: "unreachable", message: "Something went wrong checking that link. Please try again." });
    } finally {
      setLinkLoading(false);
    }
  };

  const showResults = result || linkResult || linkLoading;

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

          {/* Check by product link */}
          <div className="pt-5 border-t space-y-3">
            <p className="text-sm font-medium">Or paste a product link</p>
            <p className="text-xs text-muted-foreground">
              We'll find the ingredient list on the page and check it. Acne-safe products are added to
              Purity's home page.
            </p>
            <form
              className="flex flex-col sm:flex-row gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                if (link.trim() && !linkLoading) handleCheckLink();
              }}
            >
              <div className="relative flex-1">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  inputMode="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://www.example.com/product-page"
                  className="pl-9 h-11 rounded-full bg-background"
                  aria-label="Product link"
                />
              </div>
              <Button type="submit" disabled={!link.trim() || linkLoading} size="lg" className="rounded-full shadow-md gap-2">
                {linkLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Check Link
              </Button>
            </form>
          </div>
        </div>

        {/* Image, replaced by results after a check */}
        {showResults ? (
          <div
            className="p-6 md:p-10 md:pl-4 flex flex-col justify-center space-y-4 bg-gradient-to-br from-cream/40 to-background"
            aria-live="polite"
          >
            {linkLoading ? (
              <div className="flex items-center gap-3 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <p className="text-sm">Reading the product page…</p>
              </div>
            ) : linkResult ? (
              <LinkResult data={linkResult} />
            ) : (
              result && <IngredientResult result={result} />
            )}

            {!linkLoading && (
              <p className="text-xs text-muted-foreground">
                Formulas change, so always confirm against the ingredient list on the actual package. Labels
                like "non-comedogenic" or "won't clog pores" don't guarantee a product is acne-safe.
              </p>
            )}
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
