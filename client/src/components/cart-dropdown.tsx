import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Trash2 } from "lucide-react";

interface CartDropdownProps {
  onClose: () => void;
}

export default function CartDropdown({ onClose }: CartDropdownProps) {
  const { cartItems, totalItems, totalPrice, removeFromCart } = useCart();

  return (
    <div 
      className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-4 z-50"
      onMouseLeave={onClose}
    >
      <div className="px-4 py-2 border-b border-gray-200">
        <h3 className="font-medium">Your Cart ({totalItems} items)</h3>
      </div>
      
      <div className="max-h-64 overflow-y-auto p-2">
        {cartItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Your cart is empty
          </div>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="flex items-center p-2 border-b hover:bg-gray-50">
              <img 
                src={item.product.imageUrl} 
                alt={item.product.name} 
                className="w-12 h-12 object-cover rounded mr-3"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-600">
                    ${(item.product.price / 100).toFixed(2)} × {item.quantity}
                  </div>
                  <div className="font-medium text-sm">
                    ${((item.product.price * item.quantity) / 100).toFixed(2)}
                  </div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 ml-2 text-gray-400 hover:text-red-500"
                onClick={() => removeFromCart(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex justify-between mb-4">
          <span className="font-medium">Total:</span>
          <span className="font-bold">${(totalPrice / 100).toFixed(2)}</span>
        </div>
        <div className="flex space-x-2">
          <Button 
            asChild 
            className="flex-1 bg-primary hover:bg-opacity-90"
            disabled={cartItems.length === 0}
          >
            <Link href="/cart">View Cart</Link>
          </Button>
          <Button 
            asChild 
            className="flex-1 bg-accent hover:bg-opacity-90"
            disabled={cartItems.length === 0}
          >
            <Link href="/checkout">Checkout</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
