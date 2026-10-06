import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface SkinProfile {
  skin_concerns: string[];
  skin_description: string | null;
  ingredients_to_avoid: string | null;
  breakout_frequency: string;
  is_pregnant_nursing: boolean;
}

const allProducts = [
  { id: "1", name: "Cetaphil Gentle Cleanser", brand: "Cetaphil", price: "$14.99", rating: 4.5, image: "cetaphil", category: "cleanser", concerns: ["Acne / Blemishes", "Redness / Inflammation"] },
  { id: "2", name: "Hydrating Face Cleanser", brand: "CeraVe", price: "$24.99", rating: 4.7, image: "cleanser", category: "cleanser", concerns: ["Dullness / Lack of Radiance", "Uneven Skin Texture"] },
  { id: "3", name: "Nourishing Moisturizer", brand: "Neutrogena", price: "$34.99", rating: 4.8, image: "moisturizer", category: "moisturizer", concerns: ["Fine Lines / Wrinkles", "Loss of Firmness / Elasticity"] },
  { id: "4", name: "Vitamin C Serum", brand: "SkinCeuticals", price: "$39.99", rating: 4.6, image: "serum", category: "serum", concerns: ["Dark Spots / Hyperpigmentation", "Dullness / Lack of Radiance"] },
  { id: "5", name: "Shiseido Eye Cream", brand: "Shiseido", price: "$45.99", rating: 4.9, image: "shiseido", category: "eye-care", concerns: ["Fine Lines / Wrinkles"] },
  { id: "6", name: "Daily Sunscreen SPF 50", brand: "La Roche-Posay", price: "$19.99", rating: 4.7, image: "sunscreen", category: "sunscreen", concerns: ["Dark Spots / Hyperpigmentation"] },
  { id: "7", name: "Balancing Toner", brand: "Thayers", price: "$22.99", rating: 4.5, image: "toner", category: "toner", concerns: ["Enlarged Pores", "Uneven Skin Texture"] },
  { id: "8", name: "Youth to the People Cleanser", brand: "Youth to the People", price: "$36.99", rating: 4.8, image: "yttp", category: "cleanser", concerns: ["Acne / Blemishes", "Enlarged Pores"] },
];

const Recommendations = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [skinProfile, setSkinProfile] = useState<SkinProfile | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<typeof allProducts>([]);

  useEffect(() => {
    const fetchSkinProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast({
            title: "Authentication required",
            description: "Please log in to view recommendations",
            variant: "destructive",
          });
          navigate("/auth");
          return;
        }

        const { data, error } = await supabase
          .from("skin_profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error) {
          if (error.code === "PGRST116") {
            toast({
              title: "No profile found",
              description: "Please complete your skin profile first",
              variant: "destructive",
            });
            navigate("/skin-profile-setup");
          }
          throw error;
        }

        setSkinProfile(data);
        
        // Match products based on skin concerns
        const matched = allProducts.filter(product => 
          product.concerns.some(concern => 
            data.skin_concerns.includes(concern)
          )
        );
        
        // If no matches, show some default recommendations
        setRecommendedProducts(matched.length > 0 ? matched : allProducts.slice(0, 6));
      } catch (error: any) {
        console.error("Error fetching skin profile:", error);
        toast({
          title: "Error",
          description: "Failed to load recommendations",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSkinProfile();
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Skeleton className="h-10 w-64 mb-4" />
            <Skeleton className="h-6 w-96" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-80" />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Personalized Recommendations</h1>
          <p className="text-muted-foreground">
            Based on your skin concerns: {skinProfile?.skin_concerns.join(", ")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {recommendedProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No product recommendations available at this time.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Recommendations;