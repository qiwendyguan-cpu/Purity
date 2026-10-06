import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { FilterSidebar } from "@/components/FilterSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

const products = [
  {
    id: "1",
    name: "Cetaphil Gentle Skin Cleanser",
    brand: "Cetaphil",
    category: "cleanser",
    price: "$12",
    rating: 4.8,
    reviewCount: 4744,
    image: "cetaphil-cleanser",
    externalUrl: "https://www.target.com/p/cetaphil-gentle-skin-face-cleanser-20-fl-oz/-/A-85886088#lnk=sametab"
  },
  {
    id: "2",
    name: "Youth to the People Superfood Cleanser",
    brand: "Youth to the People",
    category: "cleanser",
    price: "$36",
    rating: 4.7,
    reviewCount: 3200,
    image: "yttp-cleanser"
  },
  {
    id: "3",
    name: "Fresh Soy Face Cleanser",
    brand: "Fresh",
    category: "cleanser",
    price: "$38",
    rating: 4.6,
    reviewCount: 1900,
    image: "fresh-cleanser"
  },
  {
    id: "4",
    name: "CeraVe Acne Control Cleanser",
    brand: "CeraVe",
    category: "cleanser",
    price: "$15",
    rating: 4.8,
    reviewCount: 5100,
    image: "cerave-cleanser"
  },
  {
    id: "5",
    name: "Vanicream Gentle Facial Cleanser",
    brand: "Vanicream",
    category: "cleanser",
    price: "$11",
    rating: 4.7,
    reviewCount: 2800,
    image: "vanicream-cleanser"
  },
  {
    id: "6",
    name: "Paula's Choice 2% BHA Liquid Exfoliant",
    brand: "Paula's Choice",
    category: "exfoliant",
    price: "$32",
    rating: 4.8,
    reviewCount: 4200,
    image: "paulas-choice"
  },
  {
    id: "7",
    name: "Anua Heartleaf 77% Soothing Toner",
    brand: "Anua",
    category: "toner",
    price: "$18",
    rating: 4.6,
    reviewCount: 3500,
    image: "anua-toner"
  },
  {
    id: "8",
    name: "Good Molecules Niacinamide Brightening Toner",
    brand: "Good Molecules",
    category: "toner",
    price: "$14",
    rating: 4.7,
    reviewCount: 2100,
    image: "good-molecules"
  },
  {
    id: "9",
    name: "Kiehl's Ultra Facial Cleanser",
    brand: "Kiehl's",
    category: "cleanser",
    price: "$24",
    rating: 4.6,
    reviewCount: 2600,
    image: "cleanser"
  },
  {
    id: "10",
    name: "Aveeno Calm + Restore Cleanser",
    brand: "Aveeno",
    category: "cleanser",
    price: "$11",
    rating: 4.5,
    reviewCount: 1800,
    image: "cleanser"
  },
  {
    id: "11",
    name: "Cetaphil Daily Facial Cleanser",
    brand: "Cetaphil",
    category: "cleanser",
    price: "$14",
    rating: 4.8,
    reviewCount: 2900,
    image: "cetaphil"
  },
  {
    id: "12",
    name: "Youth to the People Cleanser Trio",
    brand: "Youth to the People",
    category: "cleanser",
    price: "$36",
    rating: 4.9,
    reviewCount: 6700,
    image: "yttp"
  },
];

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((product) => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      product.brand.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSearch={setSearchQuery} />
      
      {/* Hero Banner */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={heroBanner} 
          alt="Calm and peaceful beauty products" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent flex items-center">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Your peace of mind, purified.</h1>
            <p className="text-lg text-muted-foreground">Discover safe, verified beauty products for acne-prone skin</p>
          </div>
        </div>
      </div>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <FilterSidebar />
          </aside>
          
          {/* Main Content */}
          <div>
            {/* Active Filters */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <Badge variant="secondary" className="gap-2">
                Cleanser
                <button className="ml-1 hover:text-destructive">×</button>
              </Badge>
              <Badge variant="secondary" className="gap-2">
                Toner
                <button className="ml-1 hover:text-destructive">×</button>
              </Badge>
              <Badge variant="secondary" className="gap-2">
                Serum
                <button className="ml-1 hover:text-destructive">×</button>
              </Badge>
            </div>
            
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                Showing {filteredProducts.length} of {products.length} results
              </p>
              
              <div className="flex items-center gap-4">
                <Select defaultValue="newest">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="sm" className="lg:hidden">
                  All Filters
                </Button>
              </div>
            </div>
            
            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground text-lg">No results found</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Try adjusting your search terms
                  </p>
                </div>
              )}
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-center gap-2">
              <Button variant="outline" size="icon" disabled>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="default" size="sm">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">...</Button>
              <Button variant="outline" size="sm">13</Button>
              <Button variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
