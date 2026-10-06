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

// Acne-safe sunscreens for prolonged sun exposure (beach/hike/park/body), not everyday use.
// Source: docs/reference/acne-safe-reference.md. Links and prices checked 2026-10-05.
const sunscreenBadge = "For prolonged sun";

const products = [
  {
    id: "13",
    name: "Cetaphil Sun Ultra Light Lotion SPF50+",
    brand: "Cetaphil",
    category: "sunscreen",
    price: "A$27.99",
    image: "/products/sunscreen-cetaphil-ultralight.jpg",
    badge: sunscreenBadge,
    linkToShop: true,
    externalUrl: "https://terrywhitechemmart.com.au/shop/product/cetaphil-sun-ultra-light-lotion-spf50-100ml",
    retailer: "TerryWhite (AU)"
  },
  {
    id: "14",
    name: "Neutrogena Sheer Zinc Face Dry-Touch Sunscreen SPF 50",
    brand: "Neutrogena",
    category: "sunscreen",
    price: "$46.99",
    image: "/products/sunscreen-neutrogena-sheer-zinc-face.jpg",
    badge: sunscreenBadge,
    linkToShop: true,
    externalUrl: "https://www.amazon.com/dp/B01MDOA0V4",
    retailer: "Amazon"
  },
  {
    id: "15",
    name: "Bariésun Ultra-Light Fluid SPF50+",
    brand: "Uriage",
    category: "sunscreen",
    price: "€8.29",
    image: "/products/sunscreen-uriage-bariesun-ultralight.png",
    badge: sunscreenBadge,
    linkToShop: true,
    externalUrl: "https://www.redcare-pharmacie.fr/beaute/BE04581237/uriage-bariesun-fluide-ultra-leger-spf50.htm",
    retailer: "Redcare (FR)"
  },
  {
    id: "16",
    name: "Bariésun Matifying Fluid SPF50+",
    brand: "Uriage",
    category: "sunscreen",
    price: "£23.50",
    image: "/products/sunscreen-uriage-bariesun-mat.png",
    badge: sunscreenBadge,
    linkToShop: true,
    externalUrl: "https://www.superdrug.com/skin/sun-care/expert-sensitive-suncare/uriage-bariesun-matifying-fluid-spf50-50ml/p/mp-00123030",
    retailer: "Superdrug (UK)"
  },
  {
    id: "17",
    name: "Fotoprotector Fusion Gel Sport SPF 50",
    brand: "ISDIN",
    category: "sunscreen",
    price: "€24.21",
    image: "/products/sunscreen-isdin-fusion-gel-sport.jpg",
    badge: sunscreenBadge,
    linkToShop: true,
    externalUrl: "https://www.medikamente-per-klick.de/isdin-fotoprotector-fusion-gel-sport-spf-50-100ml-16951364",
    retailer: "Medikamente per Klick (DE)"
  },
  {
    id: "18",
    name: "Nivea Sun Protect & Refresh Cooling Sun Mist SPF50",
    brand: "Nivea",
    category: "sunscreen",
    price: "£9.20",
    image: "/products/sunscreen-nivea-protect-refresh.png",
    badge: sunscreenBadge,
    linkToShop: true,
    externalUrl: "https://groceries.morrisons.com/products/nivea-sun-protect-dry-touch-sun-cream-mist-spf-50-200ml/112324149",
    retailer: "Morrisons (UK)"
  },
  // Acne-safe body washes. Links and prices checked 2026-10-06.
  {
    id: "19",
    name: "Thankyou Botanical Body Wash Mint & Spring Flowers 1L",
    brand: "Thankyou",
    category: "body wash",
    price: "A$8.95",
    image: "/products/bodywash-thankyou-mint.jpg",
    linkToShop: true,
    externalUrl: "https://www.woolworths.com.au/shop/productdetails/307002",
    retailer: "Woolworths (AU)"
  },
  {
    id: "20",
    name: "Thankyou Botanical Body Wash Geranium, Rose & Wood 1L",
    brand: "Thankyou",
    category: "body wash",
    price: "A$8.95",
    image: "/products/bodywash-thankyou-geranium.jpg",
    linkToShop: true,
    externalUrl: "https://www.woolworths.com.au/shop/productdetails/306679",
    retailer: "Woolworths (AU)"
  },
  {
    id: "21",
    name: "Trader Joe's Tea Tree Tingle Body Wash (2-pack)",
    brand: "Trader Joe's",
    category: "body wash",
    price: "$28.40",
    image: "/products/bodywash-tj-tea-tree-tingle.jpg",
    linkToShop: true,
    externalUrl: "https://www.amazon.com/dp/B0HFSNQZW8",
    retailer: "Amazon"
  },
  {
    id: "22",
    name: "Palmolive Men Active Body Wash with Sea Minerals 1L",
    brand: "Palmolive",
    category: "body wash",
    price: "A$10.99",
    image: "/products/bodywash-palmolive-men-active.jpg",
    linkToShop: true,
    externalUrl: "https://www.chemistwarehouse.com.au/buy/75852/palmolive-men-body-wash-active-with-sea-minerals-shower-gel-1l",
    retailer: "Chemist Warehouse (AU)"
  },
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
