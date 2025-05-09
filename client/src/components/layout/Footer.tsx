import { Link } from "wouter";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Mail, 
  MapPin, 
  Phone, 
  Clock
} from "lucide-react";
import { useCategories } from "@/hooks/useCategories";

const Footer = () => {
  const { data: categories } = useCategories();
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">ModernShowroom</h3>
            <p className="text-gray-400 mb-4">Curating exceptional products for modern living since 2010.</p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition" 
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition" 
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition" 
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/" 
                  className="text-gray-400 hover:text-white transition"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/products" 
                  className="text-gray-400 hover:text-white transition"
                >
                  Shop All
                </Link>
              </li>
              <li>
                <Link 
                  href="/#featured" 
                  className="text-gray-400 hover:text-white transition"
                >
                  Featured Products
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-gray-400 hover:text-white transition"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-gray-400 hover:text-white transition"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories?.map((category) => (
                <li key={category.id}>
                  <Link 
                    href={`/products?category=${category.slug}`}
                    className="text-gray-400 hover:text-white transition"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="mt-1 mr-3 text-gray-400 flex-shrink-0" size={18} />
                <span className="text-gray-400">123 Showroom St, Design District, New York, NY 10001</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-3 text-gray-400 flex-shrink-0" size={18} />
                <span className="text-gray-400">(123) 456-7890</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-3 text-gray-400 flex-shrink-0" size={18} />
                <span className="text-gray-400">info@modernshowroom.com</span>
              </li>
              <li className="flex items-start">
                <Clock className="mt-1 mr-3 text-gray-400 flex-shrink-0" size={18} />
                <span className="text-gray-400">
                  Mon-Fri: 9AM - 6PM<br />
                  Sat-Sun: 10AM - 4PM
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row md:justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">&copy; 2023 ModernShowroom. All rights reserved.</p>
          <div className="flex flex-wrap justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition">Shipping Policy</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition">Return Policy</a>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button 
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 bg-primary hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-opacity"
        aria-label="Back to top"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
        </svg>
      </button>
    </footer>
  );
};

export default Footer;
