import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Header } from "@/components/Header";

const skinConcernOptions = [
  "Acne / Blemishes",
  "Redness / Inflammation",
  "Fine Lines / Wrinkles",
  "Dark Spots / Hyperpigmentation",
  "Dullness / Lack of Radiance",
  "Loss of Firmness / Elasticity",
  "Enlarged Pores",
  "Uneven Skin Texture",
];

const SkinProfileSetup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [skinDescription, setSkinDescription] = useState("");
  const [ingredientsToAvoid, setIngredientsToAvoid] = useState("");
  const [wantsRecommendations, setWantsRecommendations] = useState<string>("");
  const [isPregnantNursing, setIsPregnantNursing] = useState<string>("");
  const [prescriptionProducts, setPrescriptionProducts] = useState("");
  const [breakoutFrequency, setBreakoutFrequency] = useState<string>("");

  const handleConcernToggle = (concern: string) => {
    if (selectedConcerns.includes(concern)) {
      setSelectedConcerns(selectedConcerns.filter((c) => c !== concern));
    } else if (selectedConcerns.length < 3) {
      setSelectedConcerns([...selectedConcerns, concern]);
    } else {
      toast({
        title: "Maximum selections reached",
        description: "You can select up to 3 skin concerns",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedConcerns.length === 0) {
      toast({
        title: "Required field",
        description: "Please select at least one skin concern",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication error",
          description: "Please log in again",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      if (!breakoutFrequency || !wantsRecommendations || !isPregnantNursing) {
        toast({
          title: "Required fields",
          description: "Please answer all required questions",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const { error } = await supabase.from("skin_profiles").insert({
        user_id: user.id,
        skin_concerns: selectedConcerns,
        skin_description: skinDescription || null,
        ingredients_to_avoid: ingredientsToAvoid || null,
        wants_recommendations: wantsRecommendations === "yes",
        is_pregnant_nursing: isPregnantNursing === "yes",
        prescription_products: prescriptionProducts || null,
        breakout_frequency: breakoutFrequency,
      });

      if (error) throw error;

      toast({
        title: "Profile saved!",
        description: "Your skin profile has been created successfully",
      });

      navigate("/recommendations");
    } catch (error: any) {
      console.error("Error saving skin profile:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((selectedConcerns.length > 0 ? 1 : 0) + 
                    (breakoutFrequency ? 1 : 0) + 
                    (wantsRecommendations ? 1 : 0)) / 3 * 100;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Complete Your Skin Profile</h1>
          <p className="text-muted-foreground mb-4">
            Help us understand your skin better to provide personalized recommendations
          </p>
          <Progress value={progress} className="h-2" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Skin Concerns */}
          <div className="space-y-4">
            <div>
              <Label className="text-lg font-semibold">
                What are your primary skin concerns?
              </Label>
              <p className="text-sm text-muted-foreground">
                You can select up to 3
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {skinConcernOptions.map((concern) => (
                <div
                  key={concern}
                  className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer"
                  onClick={() => handleConcernToggle(concern)}
                >
                  <Checkbox
                    id={concern}
                    checked={selectedConcerns.includes(concern)}
                    onCheckedChange={() => handleConcernToggle(concern)}
                  />
                  <label
                    htmlFor={concern}
                    className="text-sm font-medium cursor-pointer flex-1"
                  >
                    {concern}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Skin Description */}
          <div className="space-y-2">
            <Label htmlFor="skinDescription" className="text-lg font-semibold">
              How would you describe your skin?
            </Label>
            <p className="text-sm text-muted-foreground">
              e.g., Combination, oily T-zone
            </p>
            <Textarea
              id="skinDescription"
              value={skinDescription}
              onChange={(e) => setSkinDescription(e.target.value)}
              placeholder="Describe your skin type..."
              className="min-h-[80px]"
            />
          </div>

          {/* Ingredients to Avoid */}
          <div className="space-y-2">
            <Label htmlFor="ingredientsToAvoid" className="text-lg font-semibold">
              Are there specific ingredients that tend to irritate your skin?
            </Label>
            <p className="text-sm text-muted-foreground">
              List any ingredients you avoid (e.g., fragrance, parabens, sulfates)
            </p>
            <Textarea
              id="ingredientsToAvoid"
              value={ingredientsToAvoid}
              onChange={(e) => setIngredientsToAvoid(e.target.value)}
              placeholder="List ingredients to avoid..."
              className="min-h-[80px]"
            />
          </div>

          {/* Prescription Products */}
          <div className="space-y-2">
            <Label htmlFor="prescriptionProducts" className="text-lg font-semibold">
              Are you currently using prescription skincare or medication?
            </Label>
            <p className="text-sm text-muted-foreground">
              List any prescription products
            </p>
            <Input
              id="prescriptionProducts"
              value={prescriptionProducts}
              onChange={(e) => setPrescriptionProducts(e.target.value)}
              placeholder="List prescription products..."
            />
          </div>

          {/* Recommendations */}
          <div className="space-y-3">
            <Label className="text-lg font-semibold">
              Would you like personalized product recommendations?
            </Label>
            <RadioGroup value={wantsRecommendations} onValueChange={setWantsRecommendations}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="rec-yes" />
                <Label htmlFor="rec-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="rec-no" />
                <Label htmlFor="rec-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Pregnancy/Nursing */}
          <div className="space-y-3">
            <Label className="text-lg font-semibold">
              Are you pregnant or nursing?
            </Label>
            <RadioGroup value={isPregnantNursing} onValueChange={setIsPregnantNursing}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="preg-yes" />
                <Label htmlFor="preg-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="preg-no" />
                <Label htmlFor="preg-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Breakout Frequency */}
          <div className="space-y-3">
            <Label className="text-lg font-semibold">
              How often do you experience breakouts?
            </Label>
            <RadioGroup value={breakoutFrequency} onValueChange={setBreakoutFrequency}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rarely" id="freq-rarely" />
                <Label htmlFor="freq-rarely">Rarely</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sometimes" id="freq-sometimes" />
                <Label htmlFor="freq-sometimes">Sometimes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="often" id="freq-often" />
                <Label htmlFor="freq-often">Often</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="always" id="freq-always" />
                <Label htmlFor="freq-always">Always</Label>
              </div>
            </RadioGroup>
          </div>

          <Button 
            type="submit" 
            size="lg" 
            className="w-full"
            disabled={isSubmitting || selectedConcerns.length === 0}
          >
            {isSubmitting ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </main>
    </div>
  );
};

export default SkinProfileSetup;