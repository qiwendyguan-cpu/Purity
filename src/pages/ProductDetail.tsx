import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ExternalLink } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import productImage from "@/assets/product-cleanser.jpg";

const ProductDetail = () => {
  const { id } = useParams();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">Purity</Link>
          {" / "}
          <Link to="/" className="hover:text-primary">Skincare</Link>
          {" / "}
          <span>Cleanser</span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            <img 
              src={productImage} 
              alt="Cetaphil Gentle Skin Cleanser"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Cetaphil</p>
              <h1 className="text-3xl font-bold mb-4">Jumbo Cetaphil Gentle Face Cleanser</h1>
              
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 fill-accent text-accent" />
                  <Star className="h-5 w-5 fill-accent text-accent" />
                  <Star className="h-5 w-5 fill-accent text-accent" />
                  <Star className="h-5 w-5 fill-accent text-accent" />
                  <Star className="h-5 w-5 fill-accent text-accent" />
                </div>
                <span className="font-medium">4.8 out of 5</span>
                <Link to="#reviews" className="text-sm text-primary hover:underline">
                  See all reviews
                </Link>
              </div>
              
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-4xl font-bold">$12</span>
                <Badge className="bg-primary">Target</Badge>
              </div>
              
              <Button size="lg" className="w-full mb-2">
                <ExternalLink className="mr-2 h-4 w-4" />
                Get This Deal
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Link directs to third-party vendor
              </p>
            </div>
            
            <Card>
              <CardContent className="pt-6">
                <h2 className="font-bold text-xl mb-3">Gentle Skin Cleanser</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Be kind to your sensitive skin with CETAPHIL Gentle Skin Cleanser, a creamy, non-foaming daily facial cleanser that's ideal for dry to normal skin types. This gentle yet effective face wash uses micellar technology to remove dirt, makeup and impurities while hydrating the skin, helping to keep your skin's natural pH balance in check. Formulated with a new blend of key ingredients: hydrating glycerin, panthenol (vitamin B5) to hydrate, soothe and preserve the skin barrier, and niacinamide (vitamin B3) to help smooth skin texture and retain skin moisture.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Ingredients */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="font-bold text-xl mb-3">Ingredients</h2>
            <p className="text-sm text-muted-foreground">
              Water, Glycerin, Cetearyl Alcohol, Panthenol, Niacinamide, Pantolactone, Xanthan Gum, Sodium Cocoyl Isethionate, Sodium Benzoate, Citric Acid
            </p>
          </CardContent>
        </Card>
        
        {/* Details & Care */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="font-bold text-xl mb-3">Details & Care</h2>
            <div className="space-y-2 text-sm">
              <p><strong>What it is:</strong> A superfood gel cleanser packed with phytonutrients that washes away dirt, impurities and most makeup.</p>
              <p><strong>Who it's for:</strong> All skin types.</p>
            </div>
          </CardContent>
        </Card>
        
        {/* Reviews */}
        <Card id="reviews">
          <CardContent className="pt-6">
            <h2 className="font-bold text-xl mb-6">Reviews</h2>
            
            <Card className="mb-4 bg-muted/50">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium mb-1">Refreshing, Clean...Amazing</p>
                    <p className="text-sm text-muted-foreground">Dec 11, 2020</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <Star className="h-4 w-4 fill-accent text-accent" />
                  </div>
                </div>
                <p className="text-sm mb-3">
                  The Kale and Green Tea with Spinach and vitamins is a refreshing clean. Does not make your skin feel dry. Very soothing and smells amazing. It's been 4 days using this product and I truly love it. I would definitely encourage anyone to try it for a truly refreshing clean.
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Jabberwacky</span>
                  <span>33 found this helpful</span>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
        
        {/* Similar Products */}
        <div className="mt-12">
          <h2 className="font-bold text-2xl mb-6">Similar Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <div className="aspect-square bg-muted"></div>
                <CardContent className="pt-4">
                  <p className="text-sm font-medium line-clamp-2">Youth to the People Superfood Cleanser</p>
                  <p className="text-sm text-muted-foreground mt-1">$16-$68</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
