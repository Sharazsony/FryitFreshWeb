import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, User, Menu, ShoppingCart } from "lucide-react";
import CartDropdown from "@/components/cart-dropdown";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  // Handle scrolling effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close cart dropdown when changing location
  useEffect(() => {
    setCartOpen(false);
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
  };

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-white shadow-sm' : 'bg-white'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-primary font-heading font-bold text-2xl">Fruit<span className="text-accent">Fresh</span></span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/">
              <a className={`font-medium transition-colors ${location === '/' ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}>
                Home
              </a>
            </Link>
            <Link href="/shop">
              <a className={`font-medium transition-colors ${location === '/shop' ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}>
                Shop
              </a>
            </Link>
            <Link href="/contact">
              <a className={`font-medium transition-colors ${location === '/contact' ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}>
                Contact
              </a>
            </Link>
            {isAdmin && (
              <Link href="/admin">
                <a className={`font-medium transition-colors ${location.startsWith('/admin') ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}>
                  Admin
                </a>
              </Link>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <Button variant="ghost" size="icon" aria-label="Search">
              <Search className="h-5 w-5" />
            </Button>

            {/* User Account */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative" aria-label="Account">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-white">
                        {user.firstName ? user.firstName[0] : user.username[0]}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">My Orders</Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="icon" asChild aria-label="Sign In">
                <Link href="/auth">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            )}

            {/* Shopping Cart */}
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setCartOpen(!cartOpen)}
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
              {cartOpen && <CartDropdown onClose={() => setCartOpen(false)} />}
            </div>

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 space-y-1">
            <Link href="/">
              <a className={`block px-4 py-2 text-gray-700 hover:bg-neutral-dark transition-all rounded-md ${location === '/' ? 'bg-neutral-dark' : ''}`}>
                Home
              </a>
            </Link>
            <Link href="/shop">
              <a className={`block px-4 py-2 text-gray-700 hover:bg-neutral-dark transition-all rounded-md ${location === '/shop' ? 'bg-neutral-dark' : ''}`}>
                Shop
              </a>
            </Link>
            <Link href="/contact">
              <a className={`block px-4 py-2 text-gray-700 hover:bg-neutral-dark transition-all rounded-md ${location === '/contact' ? 'bg-neutral-dark' : ''}`}>
                Contact
              </a>
            </Link>
            {isAdmin && (
              <Link href="/admin">
                <a className={`block px-4 py-2 text-gray-700 hover:bg-neutral-dark transition-all rounded-md ${location.startsWith('/admin') ? 'bg-neutral-dark' : ''}`}>
                  Admin
                </a>
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
