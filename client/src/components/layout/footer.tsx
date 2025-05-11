import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-primary text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="font-heading font-bold text-xl mb-4">FruitFresh</h3>
            <p className="mb-4">Supporting local farmers and delivering the freshest organic produce to your door.</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-accent transition-all" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="hover:text-accent transition-all" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="hover:text-accent transition-all" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="hover:text-accent transition-all" aria-label="Pinterest">
                <i className="fab fa-pinterest"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-bold text-xl mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-accent transition-all">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-accent transition-all">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-accent transition-all">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/auth" className="hover:text-accent transition-all">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-heading font-bold text-xl mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/cart" className="hover:text-accent transition-all">
                  My Cart
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-all">Order Tracking</a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-all">Shipping Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-all">Returns & Refunds</a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-all">FAQs</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-heading font-bold text-xl mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-3"></i>
                <span>123 Organic Way, Farmville, CA 95123</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone-alt mr-3"></i>
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope mr-3"></i>
                <span>support@fruitfresh.com</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-clock mr-3"></i>
                <span>Mon-Fri 9am-6pm</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-primary-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} FruitFresh. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex items-center space-x-2">
              <span className="text-xs text-gray-300">Payment Methods:</span>
              <i className="fab fa-cc-visa text-xl"></i>
              <i className="fab fa-cc-mastercard text-xl"></i>
              <i className="fab fa-cc-amex text-xl"></i>
              <i className="fab fa-cc-paypal text-xl"></i>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
