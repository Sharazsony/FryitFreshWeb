import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductGrid from "@/components/product-grid";
import Filters from "@/components/filters";
import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [priceRange, setPriceRange] = useState<number>(1000); // Max price in cents
  const [sortBy, setSortBy] = useState<string>("featured");
  const [mobileFiltersVisible, setMobileFiltersVisible] = useState(false);
  
  // Fetch products
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", selectedCategory],
    queryFn: async ({ queryKey }) => {
      const [url, category] = queryKey;
      const endpoint = category ? `${url}?category=${category}` : url as string;
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error("Failed to fetch products");
      return await res.json();
    },
  });
  
  // Filter products by price
  const filteredProducts = products.filter(product => product.price <= priceRange);
  
  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low-high":
        return a.price - b.price;
      case "price-high-low":
        return b.price - a.price;
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0; // Default to order from API
    }
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl font-bold text-gray-800 mb-8">Our Products</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Mobile Filters Toggle */}
        <div className="md:hidden mb-4">
          <Button
            onClick={() => setMobileFiltersVisible(!mobileFiltersVisible)}
            variant="outline"
            className="w-full flex justify-between items-center"
          >
            <span>Filters</span>
            <i className={`fas fa-chevron-${mobileFiltersVisible ? 'up' : 'down'}`}></i>
          </Button>
          
          {mobileFiltersVisible && (
            <div className="mt-4 p-4 bg-white rounded-md shadow-sm">
              <Filters
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
              />
            </div>
          )}
        </div>
        
        {/* Desktop Sidebar Filters */}
        <div className="hidden md:block w-64">
          <div className="sticky top-24">
            <Filters
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
            />
          </div>
        </div>
        
        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <div>
              <span className="text-gray-600">{sortedProducts.length} products</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-600">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                  <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <ProductGrid products={sortedProducts} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
