import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Star, ExternalLink, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import cleanserImg from "@/assets/product-cleanser.jpg";
import tonerImg from "@/assets/product-toner.jpg";
import serumImg from "@/assets/product-serum.jpg";
import sunscreenImg from "@/assets/product-sunscreen.jpg";
import moisturizerImg from "@/assets/product-moisturizer.jpg";
import concealerImg from "@/assets/product-concealer.jpg";
import mascaraImg from "@/assets/product-mascara.jpg";
import lipstickImg from "@/assets/product-lipstick.jpg";
import cetaphilImg from "@/assets/product-cetaphil.jpg";
import shiseidoImg from "@/assets/product-shiseido.jpg";
import yttpImg from "@/assets/product-yttp.jpg";
import maybellineConcealerImg from "@/assets/product-maybelline-concealer.jpg";
import maybellineMascaraImg from "@/assets/product-maybelline-mascara.jpg";
import macLipstickImg from "@/assets/product-mac-lipstick.jpg";
import nyxSprayImg from "@/assets/product-nyx-setting-spray.jpg";
import pfBronzerImg from "@/assets/product-pf-bronzer.jpg";
import cetaphilCleanserImg from "@/assets/product-cetaphil-cleanser.jpg";
import yttpCleanserImg from "@/assets/product-yttp-cleanser.jpg";
import freshCleanserImg from "@/assets/product-fresh-cleanser.jpg";
import ceraveCleanserImg from "@/assets/product-cerave-cleanser.jpg";
import vanicreamCleanserImg from "@/assets/product-vanicream-cleanser.jpg";
import paulasChoiceImg from "@/assets/product-paulas-choice.jpg";
import anuaTonerImg from "@/assets/product-anua-toner.jpg";
import goodMoleculesImg from "@/assets/product-good-molecules.jpg";
import foundationImg from "@/assets/product-foundation.jpg";
import ctLipstickImg from "@/assets/product-ct-lipstick.jpg";
import faceMaskImg from "@/assets/product-face-mask.jpg";

interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  price?: string;
  originalPrice?: string;
  discount?: string;
  rating?: number;
  reviewCount?: number;
  image?: string;
  badge?: string;
  externalUrl?: string;
  retailer?: string;
  /** Card image and title open the shop link instead of the Purity product page */
  linkToShop?: boolean;
  isFavorite?: boolean;
}

const imageMap: Record<string, string> = {
  cleanser: cleanserImg,
  toner: tonerImg,
  serum: serumImg,
  sunscreen: sunscreenImg,
  moisturizer: moisturizerImg,
  concealer: concealerImg,
  mascara: mascaraImg,
  lipstick: lipstickImg,
  cetaphil: cetaphilImg,
  shiseido: shiseidoImg,
  yttp: yttpImg,
  "maybelline-concealer": maybellineConcealerImg,
  "maybelline-mascara": maybellineMascaraImg,
  "mac-lipstick": macLipstickImg,
  "nyx-spray": nyxSprayImg,
  "pf-bronzer": pfBronzerImg,
  "cetaphil-cleanser": cetaphilCleanserImg,
  "yttp-cleanser": yttpCleanserImg,
  "fresh-cleanser": freshCleanserImg,
  "cerave-cleanser": ceraveCleanserImg,
  "vanicream-cleanser": vanicreamCleanserImg,
  "paulas-choice": paulasChoiceImg,
  "anua-toner": anuaTonerImg,
  "good-molecules": goodMoleculesImg,
  "foundation": foundationImg,
  "ct-lipstick": ctLipstickImg,
  "face-mask": faceMaskImg,
};

export const ProductCard = ({ 
  id, 
  name, 
  brand, 
  price, 
  originalPrice, 
  discount,
  rating,
  reviewCount,
  badge,
  image,
  externalUrl,
  retailer = "Target",
  linkToShop,
  isFavorite
}: ProductCardProps) => {
  // Images starting with "/" are real product photos in public/; fit them instead of cropping
  const isPhoto = image?.startsWith("/");
  const productImage = isPhoto ? image : image ? imageMap[image] : cleanserImg;
  const opensShop = linkToShop && externalUrl;

  const CardLink = ({ children }: { children: React.ReactNode }) =>
    opensShop ? (
      <a href={externalUrl} target="_blank" rel="noopener noreferrer">{children}</a>
    ) : (
      <Link to={`/product/${id}`}>{children}</Link>
    );

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardLink>
        <div className={`aspect-square flex items-center justify-center relative overflow-hidden ${isPhoto ? "bg-white" : "bg-muted"}`}>
          <img
            src={productImage}
            alt={name}
            className={isPhoto ? "w-full h-full object-contain p-6" : "w-full h-full object-cover"}
          />
          {badge && (
            <span className="absolute top-2 left-2 rounded-full bg-background/90 backdrop-blur-sm px-2 py-1 text-[11px] font-medium">
              {badge}
            </span>
          )}
          <button 
            className="absolute top-2 right-2 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
            onClick={(e) => {
              e.preventDefault();
              // Heart click handler can be added here
            }}
          >
            <Heart 
              className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-foreground'}`}
            />
          </button>
        </div>
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground mb-1">{brand}</p>
          <h3 className="font-medium text-sm line-clamp-2 mb-2">{name}</h3>
          
          {rating && (
            <div className="flex items-center gap-1 mb-2">
              <Star className="h-3 w-3 fill-accent text-accent" />
              <span className="text-xs font-medium">{rating}</span>
              {reviewCount && (
                <span className="text-xs text-muted-foreground">({reviewCount})</span>
              )}
            </div>
          )}
          
          <div className="flex items-baseline gap-2">
            {price && <span className="font-bold text-lg">{price}</span>}
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">{originalPrice}</span>
            )}
            {discount && (
              <span className="text-xs text-accent font-medium">{discount}</span>
            )}
          </div>
        </CardContent>
      </CardLink>
      <CardFooter className="p-4 pt-0">
        {externalUrl ? (
          <Button className="w-full" size="sm" asChild>
            <a href={externalUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              View on {retailer}
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        ) : (
          <Button className="w-full" size="sm">See Deal Details</Button>
        )}
      </CardFooter>
    </Card>
  );
};
