import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, UserCheck, Sparkles } from "lucide-react";
import { AccountPromptModal } from "@/components/AccountPromptModal";
import { PoreCloggingChecker } from "@/components/PoreCloggingChecker";

const comedogenicIngredients = [
  { letter: "A", items: ["Acetylated Lanolin", "Acetylated Lanolin Alcohol", "Active Soil Complex", "Ahnfeltia Concinna", "Alaria Esculenta", "Algae Extract", "Algin", "Argan Oil", "Argania Spinosa", "Ascophyllum Nodosum", "Avocado Oil"] },
  { letter: "B", items: ["Bismuth Oxychloride", "Black Kelp", "Bladderwack", "Blue Algae", "Blue Green Algae", "Brown Algae", "Butyl Stearate"] },
  { letter: "C", items: ["Carrageenan", "Carrageenan Moss", "Cetyl Acetate", "Cetearyl Alcohol & Ceteareth 20", "Chlorella", "Chondrus Crispus", "Coal Tar", "Cocoa Butter", "Coconut Alkanes", "Coconut Butter", "Cocos Nucifera (Coconut) Oil", "Colloidal Sulfur", "Corallina Officinalis", "Cotton Awws", "Cotton Seed Oil", "Crithmum Maritimum"] },
  { letter: "D-G", items: ["D&C Red #3, #17, #21, #30, #36", "Dilsea Carnosa", "Dioctyl Succinate", "Dulse", "Ecklonia", "Enteromorpha Compressa", "Ethoxylated Lanolin", "Ethylhexyl Palmitate", "Evening Primrose Oil", "Fucus Vesiculosus", "Glyceryl Stearate SE", "Glyceryl 3-Diisostearate", "Grapeseed Oil"] },
];

const HowItWorks = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-4 py-8 px-6 rounded-2xl bg-gradient-to-br from-sage/20 to-cream">
            <h1 className="text-4xl font-bold">How Purity Works</h1>
            <p className="text-lg text-sage-foreground max-w-2xl mx-auto">
              Your trusted resource for acne-safe beauty products
            </p>
          </div>
          
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-sage/30 bg-gradient-to-br from-cream to-background">
              <CardHeader>
                <Sparkles className="h-10 w-10 text-primary mb-2" />
                <CardTitle>AI-Powered Screening</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Every product undergoes state-of-the-art AI screening, automatically reviewing ingredient lists against the latest scientific research.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-primary/30 bg-gradient-to-br from-sage/10 to-background">
              <CardHeader>
                <UserCheck className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Expert Verified</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Our non-comedogenic standards are reviewed by trusted dermatologists in the skincare industry.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-warm-beige/50 bg-gradient-to-br from-warm-beige/30 to-background">
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Your Safety First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Only products that fully pass our "acne-safe" screening are listed. Enjoy confident shopping.
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Process Details */}
          <Card className="border-sage/30 bg-gradient-to-br from-sage/5 via-cream/30 to-background">
            <CardHeader>
              <CardTitle className="text-2xl">Our Screening Process</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Every product on Purity undergoes a state-of-the-art AI screening process. Our technology automatically reviews each ingredient list and cross-checks it with the latest scientific research and dermatological data to ensure every product is free from known pore-clogging (comedogenic) ingredients.
              </p>
              <p className="text-muted-foreground">
                Only products that fully pass this "acne-safe" screening are listed, so you never have to do the research yourself. Enjoy easy, confident shopping—your skin's safety is always our first priority.
              </p>
            </CardContent>
          </Card>
          
          {/* Expert Verification */}
          <Card className="border-warm-beige/50 bg-gradient-to-br from-warm-beige/20 via-sand/10 to-background">
            <CardHeader>
              <CardTitle className="text-2xl">Expert-Verified Ingredient Standards</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Our non-pore-clogging (non-comedogenic) ingredient list is reviewed and verified by a panel of trusted, well-known dermatologists in the skincare industry.
              </p>
              <p className="text-muted-foreground">
                This ensures that every product you see meets the highest acne-safe standard, grounded in expert clinical knowledge and real-world skin health experience. Shop with confidence knowing our standards are third-party validated and continually updated by industry leaders.
              </p>
            </CardContent>
          </Card>

          {/* Pore-Clogging Ingredients Checker */}
          <PoreCloggingChecker />

          {/* Continue CTA Section */}
          <Card className="bg-gradient-to-br from-sage/30 via-cream to-warm-beige/30 border-primary/30 shadow-lg">
            <CardContent className="py-12 text-center space-y-4">
              <h3 className="text-3xl font-bold text-sage-foreground">Ready to shop with confidence?</h3>
              <p className="text-sage-foreground/80 max-w-2xl mx-auto text-lg">
                Explore our curated collection of acne-safe beauty products, all verified to meet the highest non-comedogenic standards.
              </p>
              <Button onClick={() => setIsModalOpen(true)} size="lg" className="mt-6 shadow-md">
                Continue Exploring
              </Button>
            </CardContent>
          </Card>
          
          {/* Comedogenic Ingredients */}
          <Card className="border-sand/50 bg-gradient-to-br from-sand/20 to-background">
            <CardHeader>
              <CardTitle className="text-2xl">Comedogenic Ingredients We Screen For</CardTitle>
              <p className="text-sm text-muted-foreground">
                These are some of the pore-clogging ingredients we automatically filter out
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {comedogenicIngredients.map((section) => (
                  <div key={section.letter}>
                    <h3 className="font-bold text-lg mb-2 text-primary">{section.letter}</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {section.items.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4 italic">
                ...and many more. Our complete list is continuously updated based on the latest research.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
      
      <AccountPromptModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
};

export default HowItWorks;
