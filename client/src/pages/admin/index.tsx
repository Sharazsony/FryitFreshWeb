import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { User, Product, Order, ContactMessage } from "@shared/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  ShoppingBag,
  Users,
  MessageSquare,
  CreditCard,
  BarChart3,
  Settings,
  PlusCircle,
} from "lucide-react";

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const { user, isAdmin } = useAuth();

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
    }
  }, [isAdmin, navigate]);

  // Fetch data for dashboard
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["/api/orders/admin"],
    enabled: isAdmin,
  });

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/users"],
    enabled: isAdmin,
  });

  const { data: messages = [] } = useQuery<ContactMessage[]>({
    queryKey: ["/api/contact"],
    enabled: isAdmin,
  });

  // Stats
  const totalProducts = products.length;
  const outOfStockProducts = products.filter(p => p.stock === 0).length;
  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 5).length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalUsers = users.length;
  const unreadMessages = messages.filter(m => !m.readAt).length;

  // Quick action links
  const quickLinks = [
    {
      title: "Manage Products",
      icon: <Package className="h-5 w-5" />,
      description: "Add, edit or remove products",
      href: "/admin/products",
      color: "text-purple-500 bg-purple-100",
    },
    {
      title: "View Orders",
      icon: <ShoppingBag className="h-5 w-5" />,
      description: "Process and update order status",
      href: "/admin/orders",
      color: "text-blue-500 bg-blue-100",
    },
    {
      title: "Manage Users",
      icon: <Users className="h-5 w-5" />,
      description: "Review user accounts",
      href: "/admin/users",
      color: "text-green-500 bg-green-100",
    },
    {
      title: "Contact Messages",
      icon: <MessageSquare className="h-5 w-5" />,
      description: "Read and respond to messages",
      href: "/admin/messages",
      color: "text-yellow-500 bg-yellow-100",
    },
  ];

  if (!isAdmin) {
    return null; // Don't render anything if not admin
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-heading text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{totalProducts}</div>
              <div className="p-2 rounded-full bg-purple-100">
                <Package className="h-5 w-5 text-purple-500" />
              </div>
            </div>
            <div className="mt-2 text-xs">
              <span className="text-red-500 font-medium">{outOfStockProducts} out of stock</span>
              {" • "}
              <span className="text-yellow-500 font-medium">{lowStockProducts} low stock</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{totalOrders}</div>
              <div className="p-2 rounded-full bg-blue-100">
                <ShoppingBag className="h-5 w-5 text-blue-500" />
              </div>
            </div>
            <div className="mt-2 text-xs">
              <span className="text-gray-500">{orders.filter(o => o.status === 'processing').length} processing</span>
              {" • "}
              <span className="text-green-500 font-medium">{orders.filter(o => o.status === 'completed').length} completed</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">${(totalRevenue / 100).toFixed(2)}</div>
              <div className="p-2 rounded-full bg-green-100">
                <CreditCard className="h-5 w-5 text-green-500" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              From {totalOrders} orders
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{totalUsers}</div>
              <div className="p-2 rounded-full bg-yellow-100">
                <Users className="h-5 w-5 text-yellow-500" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {unreadMessages} unread messages
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <h2 className="font-heading text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickLinks.map((link, index) => (
          <Link key={index} href={link.href}>
            <a className="block h-full">
              <Card className="h-full transition-all hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className={`p-2 inline-flex rounded-full ${link.color} mb-2`}>
                    {link.icon}
                  </div>
                  <CardTitle>{link.title}</CardTitle>
                  <CardDescription>{link.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full justify-start pl-0" asChild>
                    <div>
                      <span>View</span>
                      <i className="fas fa-arrow-right ml-2"></i>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            </a>
          </Link>
        ))}
      </div>

      {/* Add New Product Button */}
      <div className="flex justify-center mt-8">
        <Button size="lg" asChild>
          <Link href="/admin/products">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Product
          </Link>
        </Button>
      </div>
    </div>
  );
}