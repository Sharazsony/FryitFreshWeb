import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { CartProvider } from "@/hooks/use-cart";
import { queryClient } from "./lib/queryClient";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import ShopPage from "@/pages/shop-page";
import ProductDetails from "@/pages/product-details";
import CartPage from "@/pages/cart-page";
import CheckoutPage from "@/pages/checkout-page";
import ContactPage from "@/pages/contact-page";
import AdminDashboard from "@/pages/admin/index";
import AdminProducts from "@/pages/admin/products";
import AdminUsers from "@/pages/admin/users";
import AdminOrders from "@/pages/admin/orders";
import AdminMessages from "@/pages/admin/messages";
// Wrap components to ensure they always return an Element (not null)
const AdminDashboardWrapper = () => <AdminDashboard />;
const AdminProductsWrapper = () => <AdminProducts />;
const AdminUsersWrapper = () => <AdminUsers />;
const AdminOrdersWrapper = () => <AdminOrders />;
const AdminMessagesWrapper = () => <AdminMessages />;
import NotFound from "@/pages/not-found";
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/shop" component={ShopPage} />
          <Route path="/product/:id" component={ProductDetails} />
          <ProtectedRoute path="/cart" component={CartPage} />
          <ProtectedRoute path="/checkout" component={CheckoutPage} />
          <Route path="/contact" component={ContactPage} />
          <ProtectedRoute 
            path="/admin" 
            component={AdminDashboardWrapper}
            requiredRole="admin"
          />
          <ProtectedRoute 
            path="/admin/products" 
            component={AdminProductsWrapper}
            requiredRole="admin"
          />
          <ProtectedRoute 
            path="/admin/users" 
            component={AdminUsersWrapper}
            requiredRole="admin"
          />
          <ProtectedRoute 
            path="/admin/orders" 
            component={AdminOrdersWrapper}
            requiredRole="admin"
          />
          <ProtectedRoute 
            path="/admin/messages" 
            component={AdminMessagesWrapper}
            requiredRole="admin"
          />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <Toaster />
            <Router />
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
