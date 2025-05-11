import { useState } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, ShoppingCart, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function ProductDetails() {
  const [, params] = useRoute("/product/:id");
  const productId = params?.id ? parseInt(params.id) : 0;
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: [`/api/products/${productId}`],
    enabled: !!productId,
  });
  
  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to add items to your cart",
        variant: "destructive",
      });
      return;
    }
    
    if (product) {
      await addToCart(product.id, quantity);
    }
  };
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-lg mx-auto">
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold text-red-500 mb-2">Product Not Found</h2>
            <p className="text-gray-600 mb-4">Sorry, we couldn't find the product you're looking for.</p>
            <Button asChild>
              <Link href="/shop">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Shop
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-4">
        <Button variant="ghost" asChild>
          <Link href="/shop">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Image */}
        <div className="w-full md:w-1/2">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-auto rounded-lg object-cover"
          />
        </div>
        
        {/* Product Details */}
        <div className="w-full md:w-1/2">
          <div className="mb-2">
            <span className="inline-block bg-primary bg-opacity-10 text-primary text-sm font-medium px-2 py-1 rounded capitalize">
              {product.category}
            </span>
          </div>
          
          <h1 className="font-heading text-3xl font-bold mb-4">{product.name}</h1>
          
          <div className="text-2xl font-bold mb-6">
            ${(product.price / 100).toFixed(2)} <span className="text-sm text-gray-500">/ {product.unit}</span>
          </div>
          
          <div className="mb-8">
            <h3 className="font-bold text-lg mb-2">Description</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>
          
          <div className="mb-8">
            <h3 className="font-bold text-lg mb-2">Quantity</h3>
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
              >
                <i className="fas fa-minus"></i>
              </Button>
              
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-16 mx-2 text-center"
              />
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                <i className="fas fa-plus"></i>
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleAddToCart} className="bg-accent hover:bg-opacity-90 text-white" size="lg">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            
            <Button asChild variant="outline" size="lg">
              <Link href="/shop">
                Continue Shopping
              </Link>
            </Button>
          </div>
          
          <div className="mt-8 border-t pt-6">
            <div className="flex items-center mb-4">
              <i className="fas fa-truck text-primary mr-3"></i>
              <span>Free shipping on orders over $50</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-leaf text-primary mr-3"></i>
              <span>100% Organic Certified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
