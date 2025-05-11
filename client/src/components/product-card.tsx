import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@shared/schema";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent event bubbling
    
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to add items to your cart",
        variant: "destructive",
      });
      return;
    }
    
    await addToCart(product.id, 1);
  };

  return (
    <Link href={`/product/${product.id}`}>
      <a className="block bg-white rounded-lg shadow-sm overflow-hidden transition-all hover:shadow-md h-full">
        <div className="relative">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-56 object-cover"
          />
          {product.stock <= 5 && product.stock > 0 && (
            <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
              Low Stock
            </span>
          )}
          {product.stock === 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              Out of Stock
            </span>
          )}
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-heading font-bold text-lg">{product.name}</h3>
            <span className="bg-primary bg-opacity-10 text-primary text-xs font-medium px-2 py-1 rounded capitalize">
              {product.category}
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between">
            <span className="font-bold text-lg">
              ${(product.price / 100).toFixed(2)} <span className="text-sm text-gray-500">/ {product.unit}</span>
            </span>
            <Button 
              onClick={handleAddToCart} 
              className="bg-accent hover:bg-opacity-90 text-white font-medium flex items-center"
              disabled={product.stock === 0}
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </a>
    </Link>
  );
}
