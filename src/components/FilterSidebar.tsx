import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";

export const FilterSidebar = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button variant="ghost" size="sm">
          Clear all
        </Button>
      </div>
      
      <Separator />
      
      {/* Category Filter */}
      <div>
        <h3 className="font-medium mb-3">Category</h3>
        <div className="space-y-3">
          <div className="font-medium text-sm mb-2">Skincare</div>
          <div className="space-y-2 pl-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="cleanser" />
              <Label htmlFor="cleanser" className="text-sm cursor-pointer">Cleanser</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="moisturizer" />
              <Label htmlFor="moisturizer" className="text-sm cursor-pointer">Moisturizer</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="toner" />
              <Label htmlFor="toner" className="text-sm cursor-pointer">Toner</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="sunscreen" />
              <Label htmlFor="sunscreen" className="text-sm cursor-pointer">Sunscreen</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="serum" />
              <Label htmlFor="serum" className="text-sm cursor-pointer">Serum</Label>
            </div>
          </div>
          
          <div className="font-medium text-sm mb-2 mt-4">Cosmetics</div>
          <div className="space-y-2 pl-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="concealer" />
              <Label htmlFor="concealer" className="text-sm cursor-pointer">Concealer</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="bronzer" />
              <Label htmlFor="bronzer" className="text-sm cursor-pointer">Bronzer</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="setting-spray" />
              <Label htmlFor="setting-spray" className="text-sm cursor-pointer">Setting Spray</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="lipstick" />
              <Label htmlFor="lipstick" className="text-sm cursor-pointer">Lipstick</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="mascara" />
              <Label htmlFor="mascara" className="text-sm cursor-pointer">Mascara</Label>
            </div>
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Price Filter */}
      <div>
        <h3 className="font-medium mb-3">Price Range</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="0-25" />
            <Label htmlFor="0-25" className="text-sm cursor-pointer">$0 - $25</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="25-50" />
            <Label htmlFor="25-50" className="text-sm cursor-pointer">$25 - $50</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="50-100" />
            <Label htmlFor="50-100" className="text-sm cursor-pointer">$50 - $100</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="above-100" />
            <Label htmlFor="above-100" className="text-sm cursor-pointer">Above $100</Label>
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Brand Filter */}
      <div>
        <h3 className="font-medium mb-3">Brand</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="cetaphil" />
            <Label htmlFor="cetaphil" className="text-sm cursor-pointer">Cetaphil</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="lancome" />
            <Label htmlFor="lancome" className="text-sm cursor-pointer">Lancôme</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="elf" />
            <Label htmlFor="elf" className="text-sm cursor-pointer">e.l.f.</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="cerave" />
            <Label htmlFor="cerave" className="text-sm cursor-pointer">CeraVe</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="neutrogena" />
            <Label htmlFor="neutrogena" className="text-sm cursor-pointer">Neutrogena</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="ordinary" />
            <Label htmlFor="ordinary" className="text-sm cursor-pointer">The Ordinary</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="la-roche" />
            <Label htmlFor="la-roche" className="text-sm cursor-pointer">La Roche-Posay</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="clinique" />
            <Label htmlFor="clinique" className="text-sm cursor-pointer">Clinique</Label>
          </div>
        </div>
      </div>
    </div>
  );
};
