import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";

interface FiltersProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  priceRange: number;
  setPriceRange: (range: number) => void;
}

export default function Filters({
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
}: FiltersProps) {
  const [tempPriceRange, setTempPriceRange] = useState(priceRange);
  const [categories, setCategories] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(1000); // Default max price (in cents)

  // Fetch all products to extract categories and max price
  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  useEffect(() => {
    if (products) {
      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(products.map((product) => product.category))
      );
      setCategories(uniqueCategories);

      // Find maximum price
      const highestPrice = Math.max(...products.map((product) => product.price));
      setMaxPrice(highestPrice);
    }
  }, [products]);

  // Update temporary price range when prop changes
  useEffect(() => {
    setTempPriceRange(priceRange);
  }, [priceRange]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category === selectedCategory ? "" : category);
  };

  const handleApplyFilters = () => {
    setPriceRange(tempPriceRange);
  };

  const handleResetFilters = () => {
    setSelectedCategory("");
    setTempPriceRange(maxPrice);
    setPriceRange(maxPrice);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading font-bold text-xl mb-4">Categories</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <Checkbox
              id="all-products"
              checked={selectedCategory === ""}
              onCheckedChange={() => setSelectedCategory("")}
            />
            <Label htmlFor="all-products" className="ml-2 cursor-pointer">
              All Products
            </Label>
          </div>
          
          {categories.map((category) => (
            <div key={category} className="flex items-center">
              <Checkbox
                id={`category-${category}`}
                checked={selectedCategory === category}
                onCheckedChange={() => handleCategoryChange(category)}
              />
              <Label htmlFor={`category-${category}`} className="ml-2 cursor-pointer capitalize">
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-heading font-bold text-xl mb-4">Price Range</h3>
        <div className="space-y-4">
          <Slider
            value={[tempPriceRange]}
            max={maxPrice}
            step={50}
            onValueChange={(values) => setTempPriceRange(values[0])}
          />
          <div className="flex justify-between">
            <span>$0</span>
            <span>${(tempPriceRange / 100).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Button 
          onClick={handleApplyFilters} 
          className="w-full bg-primary hover:bg-opacity-90"
        >
          Apply Filters
        </Button>
        
        <Button 
          onClick={handleResetFilters} 
          variant="outline" 
          className="w-full"
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
