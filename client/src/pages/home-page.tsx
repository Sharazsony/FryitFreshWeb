import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/product-card";
import { Product } from "@shared/schema";

export default function HomePage() {
  // Fetch featured products (first 3)
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    select: (data) => data.slice(0, 3),
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="relative">
        <div className="h-96 md:h-[30rem] bg-cover bg-center" style={{backgroundImage: "url('https://pixabay.com/get/g573a20c558642ea3c5ec417c27b98a0636d4a5d1a1c9570c5ea5558f820f09cc70529dd5e3fb7bae29e0c196466b5454aeb7cac63c72c7b858cb42469890fa6f_1280.jpg')"}}>
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="container mx-auto px-4 h-full flex items-center relative z-10">
            <div className="max-w-xl text-white">
              <h1 className="font-accent text-4xl md:text-5xl font-bold mb-4">Fresh Organic Produce Delivered To Your Door</h1>
              <p className="text-lg mb-8">Support local farmers and enjoy the freshest organic fruits and vegetables with our convenient delivery service.</p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button asChild size="lg" className="bg-accent hover:bg-opacity-90 text-white">
                  <Link href="/shop">Shop Now</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary">
                  <Link href="/contact">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-gray-800 mb-4">Why Choose FruitFresh?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We're committed to providing the highest quality organic produce while supporting sustainable farming practices.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6 rounded-lg">
              <div className="w-16 h-16 mx-auto bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-leaf text-primary text-2xl"></i>
              </div>
              <h3 className="font-heading font-bold text-xl mb-2">100% Organic</h3>
              <p className="text-gray-600">All our products are certified organic and grown without harmful pesticides or chemicals.</p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6 rounded-lg">
              <div className="w-16 h-16 mx-auto bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-truck text-primary text-2xl"></i>
              </div>
              <h3 className="font-heading font-bold text-xl mb-2">Fast Delivery</h3>
              <p className="text-gray-600">We deliver your fresh produce within 24 hours of harvest to ensure maximum freshness.</p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6 rounded-lg">
              <div className="w-16 h-16 mx-auto bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-users text-primary text-2xl"></i>
              </div>
              <h3 className="font-heading font-bold text-xl mb-2">Support Local Farmers</h3>
              <p className="text-gray-600">We partner with local organic farmers to support sustainable agriculture in our community.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-neutral">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-gray-800 mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Explore our selection of fresh, organic produce from local farms.</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-primary hover:bg-opacity-90">
              <Link href="/shop">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-gray-800 mb-4">What Our Customers Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Hear from our satisfied customers about their experience with FruitFresh.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-neutral p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" alt="Customer" className="w-12 h-12 rounded-full object-cover" />
                </div>
                <div>
                  <h4 className="font-heading font-bold">Sarah Johnson</h4>
                  <div className="flex text-yellow-400">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </div>
                </div>
              </div>
              <p className="text-gray-600">"I've been ordering from FruitFresh for over a year now, and I'm consistently impressed by the quality of their organic produce. Everything is always fresh and delicious!"</p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-neutral p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" alt="Customer" className="w-12 h-12 rounded-full object-cover" />
                </div>
                <div>
                  <h4 className="font-heading font-bold">Michael Chen</h4>
                  <div className="flex text-yellow-400">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star-half-alt"></i>
                  </div>
                </div>
              </div>
              <p className="text-gray-600">"The convenience of having fresh organic produce delivered right to my door has been a game-changer. The quality is outstanding and the service is reliable."</p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-neutral p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" alt="Customer" className="w-12 h-12 rounded-full object-cover" />
                </div>
                <div>
                  <h4 className="font-heading font-bold">Emily Rodriguez</h4>
                  <div className="flex text-yellow-400">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </div>
                </div>
              </div>
              <p className="text-gray-600">"As a busy mom, I appreciate the time saved by ordering from FruitFresh. My family loves the fresh fruits and vegetables, and I love supporting local organic farmers."</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-primary bg-opacity-10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading text-3xl font-bold text-gray-800 mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-gray-600 mb-8">Get updates on new products, seasonal harvests, and exclusive offers.</p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <Button type="submit" size="lg" className="bg-primary hover:bg-opacity-90">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
