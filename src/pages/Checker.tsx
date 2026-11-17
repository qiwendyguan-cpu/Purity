import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PoreCloggingChecker } from "@/components/PoreCloggingChecker";
import {
  poreCloggingIngredients,
  poreCloggingCombinations,
  cautionIngredients,
} from "@/data/poreCloggingIngredients";

// Group the full pore-clogging list by first letter for display
const comedogenicIngredients = [
  ...poreCloggingIngredients.map((i) => i.name),
  ...poreCloggingCombinations.map((c) => c.name),
]
  .sort((a, b) => a.localeCompare(b))
  .reduce<{ letter: string; items: string[] }[]>((groups, name) => {
    const letter = name[0].toUpperCase();
    const group = groups.find((g) => g.letter === letter);
    if (group) group.items.push(name);
    else groups.push({ letter, items: [name] });
    return groups;
  }, []);
const comedogenicCount = poreCloggingIngredients.length + poreCloggingCombinations.length;

const Checker = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-4 py-8 px-6 rounded-2xl bg-gradient-to-br from-sage/20 to-cream">
            <h1 className="text-4xl font-bold">Ingredients Checker</h1>
            <p className="text-lg text-sage-foreground max-w-2xl mx-auto">
              Check any product's ingredient list against our pore-clogging database
            </p>
          </div>

          {/* Pore-Clogging Ingredients Checker */}
          <PoreCloggingChecker />

          {/* Comedogenic Ingredients */}
          <Card className="border-sand/50 bg-gradient-to-br from-sand/20 to-background">
            <CardHeader>
              <CardTitle className="text-2xl">Comedogenic Ingredients We Screen For</CardTitle>
              <p className="text-sm text-muted-foreground">
                The {comedogenicCount} pore-clogging ingredients we screen for (updated 1/1/23)
              </p>
            </CardHeader>
            <CardContent>
              <div className="columns-2 md:columns-4 gap-6">
                {comedogenicIngredients.map((section) => (
                  <div key={section.letter} className="break-inside-avoid mb-6">
                    <h3 className="font-bold text-lg mb-2 text-primary">{section.letter}</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {section.items.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2 italic">
                Also use with caution: {cautionIngredients.map((i) => i.name).join(", ")}.
                These are mildly comedogenic and can be a problem when formulated with other pore-clogging
                ingredients.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checker;
