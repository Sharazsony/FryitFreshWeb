import { Link } from "wouter";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function CartPage() {
  const { cartItems, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart, isLoading } = useCart();
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Your Cart is Empty</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8">
            <div className="mb-6">
              <ShoppingBag className="h-16 w-16 mx-auto text-gray-400" />
            </div>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Button asChild>
              <Link href="/shop">
                Start Shopping
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-heading text-3xl font-bold text-gray-800 mb-8">Your Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="w-full lg:w-2/3">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Items ({totalItems})</CardTitle>
                <Button variant="ghost" onClick={clearCart} size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Cart
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row gap-4 border-b pb-4">
                    <div className="sm:w-1/4">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-full h-24 object-cover rounded-md"
                      />
                    </div>
                    <div className="sm:w-3/4 flex flex-col sm:flex-row justify-between">
                      <div className="flex-1">
                        <h3 className="font-heading font-bold">{item.product.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">{item.product.category}</p>
                        <p className="text-primary font-medium">
                          ${(item.product.price / 100).toFixed(2)} / {item.product.unit}
                        </p>
                      </div>
                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between mt-4 sm:mt-0">
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)}
                          >
                            <i className="fas fa-minus text-xs"></i>
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (value > 0) updateQuantity(item.id, value);
                            }}
                            className="w-12 mx-2 text-center h-8 p-1"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <i className="fas fa-plus text-xs"></i>
                          </Button>
                        </div>
                        <div className="flex items-center">
                          <span className="font-bold mr-4">
                            ${((item.product.price * item.quantity) / 100).toFixed(2)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-500 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline">
                <Link href="/shop">
                  Continue Shopping
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Order Summary */}
        <div className="w-full lg:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${(totalPrice / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {totalPrice >= 5000 ? "Free" : "$4.99"}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>
                    ${(totalPrice >= 5000 ? totalPrice / 100 : totalPrice / 100 + 4.99).toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full bg-primary hover:bg-opacity-90">
                <Link href="/checkout">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <div className="mt-4 bg-primary bg-opacity-10 p-4 rounded-lg">
            <div className="flex items-center text-primary mb-2">
              <i className="fas fa-truck mr-2"></i>
              <span className="font-medium">Free Shipping</span>
            </div>
            <p className="text-sm text-gray-600">
              Free shipping on all orders over $50. Orders ship within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
