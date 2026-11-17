import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PRICE_RANGES } from "@/lib/priceRanges";

const titleCase = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase());

interface FilterSidebarProps {
  categories: string[];
  brands: string[];
  selectedCategories: string[];
  selectedBrands: string[];
  selectedPriceRanges: string[];
  onToggleCategory: (category: string) => void;
  onToggleBrand: (brand: string) => void;
  onTogglePriceRange: (rangeId: string) => void;
  onClearAll: () => void;
  hasActiveFilters?: boolean;
}

export const FilterSidebar = ({
  categories,
  brands,
  selectedCategories,
  selectedBrands,
  selectedPriceRanges,
  onToggleCategory,
  onToggleBrand,
  onTogglePriceRange,
  onClearAll,
  hasActiveFilters: hasActiveFiltersProp,
}: FilterSidebarProps) => {
  const hasActiveFilters =
    hasActiveFiltersProp ??
    (selectedCategories.length > 0 || selectedBrands.length > 0 || selectedPriceRanges.length > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button variant="ghost" size="sm" onClick={onClearAll} disabled={!hasActiveFilters}>
          Clear all
        </Button>
      </div>

      <Separator />

      {/* Category Filter */}
      <div>
        <h3 className="font-medium mb-3">Category</h3>
        {categories.length > 0 ? (
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => onToggleCategory(category)}
                />
                <Label htmlFor={`category-${category}`} className="text-sm cursor-pointer">
                  {titleCase(category)}
                </Label>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No categories yet</p>
        )}
      </div>

      <Separator />

      {/* Price Filter */}
      <div>
        <h3 className="font-medium mb-3">Price Range</h3>
        <div className="space-y-2">
          {PRICE_RANGES.map((range) => (
            <div key={range.id} className="flex items-center space-x-2">
              <Checkbox
                id={`price-${range.id}`}
                checked={selectedPriceRanges.includes(range.id)}
                onCheckedChange={() => onTogglePriceRange(range.id)}
              />
              <Label htmlFor={`price-${range.id}`} className="text-sm cursor-pointer">
                {range.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Brand Filter */}
      <div>
        <h3 className="font-medium mb-3">Brand</h3>
        {brands.length > 0 ? (
          <div className="space-y-2">
            {brands.map((brand) => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-${brand}`}
                  checked={selectedBrands.includes(brand)}
                  onCheckedChange={() => onToggleBrand(brand)}
                />
                <Label htmlFor={`brand-${brand}`} className="text-sm cursor-pointer">
                  {brand}
                </Label>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No brands yet</p>
        )}
      </div>
    </div>
  );
};
