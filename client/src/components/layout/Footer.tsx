import { Link } from "wouter";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Mail, 
  MapPin, 
  Phone, 
  Clock,
  Bike,
  Gift,
  Settings,
  Wrench,
  ChevronUp,
  Home,
  ShoppingBag,
  Info,
  MessageSquare
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
    <footer className="bg-black text-white border-t border-yellow-500">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4 group">
              <div className="text-yellow-500 mr-3 relative">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="32" 
                  height="32" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="group-hover:scale-110 transition-transform"
                >
                  <path d="M4 16.5h11" />
                  <path d="M4 16.5a2 2 0 1 0 4 0 2 2 0 1 0-4 0z" />
                  <path d="M15 16.5a2 2 0 1 0 4 0 2 2 0 1 0-4 0z" />
                  <path d="M17 16.5h0.5a2 2 0 0 0 2-2v-2.5c0-.8-.7-1.5-1.5-1.5h-7a2 2 0 0 1-2-2v0" />
                  <path d="M7 10.5l-2.5-2s-1-1.5-.5-2.5c.5-1 2-.5 3 0l3.5 2.5" />
                  <path d="M11 5.5h4" />
                  <path d="M12 8.5v-3" />
                  <path d="M9 12.5V9.5l3-1 .5 2" />
                </svg>
                <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full"></span>
              </div>
              <h3 className="text-xl font-bold">
                <span className="text-yellow-500 group-hover:text-yellow-400 transition-colors">Rammeh</span>{" "}
                <span className="text-white group-hover:tracking-wider transition-all duration-300">MotoScoot</span>
              </h3>
            </div>
            <p className="text-gray-400 mb-4 hover:text-gray-300 transition-colors">Your premier destination for motorcycles and accessories since 2015.</p>
            <div className="flex space-x-5">
              <a 
                href="#" 
                className="text-yellow-500 hover:text-yellow-400 hover:scale-125 transition-all duration-300" 
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="#" 
                className="text-yellow-500 hover:text-yellow-400 hover:scale-125 transition-all duration-300" 
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="#" 
                className="text-yellow-500 hover:text-yellow-400 hover:scale-125 transition-all duration-300" 
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-yellow-500 relative inline-block after:content-[''] after:absolute after:w-8 after:h-[2px] after:bg-yellow-500 after:bottom-[-4px] after:left-0">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/" 
                  className="group flex items-center text-gray-400 hover:text-yellow-500 transition-colors"
                >
                  <Home size={16} className="mr-2 text-yellow-500 group-hover:scale-110 transition-transform" />
                  <span className="group-hover:translate-x-1 transition-transform">Home</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/products" 
                  className="group flex items-center text-gray-400 hover:text-yellow-500 transition-colors"
                >
                  <ShoppingBag size={16} className="mr-2 text-yellow-500 group-hover:scale-110 transition-transform" />
                  <span className="group-hover:translate-x-1 transition-transform">Shop All</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/#featured" 
                  className="group flex items-center text-gray-400 hover:text-yellow-500 transition-colors"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="mr-2 text-yellow-500 group-hover:scale-110 transition-transform"
                  >
                    <path d="M4 16.5h11" />
                    <path d="M4 16.5a2 2 0 1 0 4 0 2 2 0 1 0-4 0z" />
                    <path d="M15 16.5a2 2 0 1 0 4 0 2 2 0 1 0-4 0z" />
                    <path d="M17 16.5h0.5a2 2 0 0 0 2-2v-2.5c0-.8-.7-1.5-1.5-1.5h-7a2 2 0 0 1-2-2v0" />
                    <path d="M7 10.5l-2.5-2s-1-1.5-.5-2.5c.5-1 2-.5 3 0l3.5 2.5" />
                    <path d="M11 5.5h4" />
                    <path d="M12 8.5v-3" />
                    <path d="M9 12.5V9.5l3-1 .5 2" />
                  </svg>
                  <span className="group-hover:translate-x-1 transition-transform">Featured Bikes</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="group flex items-center text-gray-400 hover:text-yellow-500 transition-colors"
                >
                  <Info size={16} className="mr-2 text-yellow-500 group-hover:scale-110 transition-transform" />
                  <span className="group-hover:translate-x-1 transition-transform">About Us</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="group flex items-center text-gray-400 hover:text-yellow-500 transition-colors"
                >
                  <MessageSquare size={16} className="mr-2 text-yellow-500 group-hover:scale-110 transition-transform" />
                  <span className="group-hover:translate-x-1 transition-transform">Contact</span>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-yellow-500 relative inline-block after:content-[''] after:absolute after:w-8 after:h-[2px] after:bg-yellow-500 after:bottom-[-4px] after:left-0">
              Categories
            </h3>
            <ul className="space-y-3">
              {categories?.map((category) => (
                <li key={category.id}>
                  <Link 
                    href={`/products?category=${category.slug}`}
                    className="group flex items-center text-gray-400 hover:text-yellow-500 transition-colors"
                  >
                    <Settings size={16} className="mr-2 text-yellow-500 group-hover:rotate-45 transition-transform duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform">{category.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-yellow-500 relative inline-block after:content-[''] after:absolute after:w-8 after:h-[2px] after:bg-yellow-500 after:bottom-[-4px] after:left-0">
              Contact Info
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start group">
                <MapPin className="mt-1 mr-3 text-yellow-500 flex-shrink-0 group-hover:scale-110 transition-transform" size={18} />
                <span className="text-gray-400 group-hover:text-gray-300 transition-colors">123 Motorcycle Ave, Speed District, Tunis, 1001</span>
              </li>
              <li className="flex items-center group">
                <Phone className="mr-3 text-yellow-500 flex-shrink-0 group-hover:scale-110 transition-transform" size={18} />
                <span className="text-gray-400 group-hover:text-gray-300 transition-colors">(+216) 71-123-456</span>
              </li>
              <li className="flex items-center group">
                <Mail className="mr-3 text-yellow-500 flex-shrink-0 group-hover:scale-110 transition-transform" size={18} />
                <span className="text-gray-400 group-hover:text-gray-300 transition-colors">info@rammehmotoscoot.com</span>
              </li>
              <li className="flex items-start group">
                <Clock className="mt-1 mr-3 text-yellow-500 flex-shrink-0 group-hover:scale-110 transition-transform" size={18} />
                <span className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  Mon-Fri: 9AM - 7PM<br />
                  Sat: 10AM - 5PM | Sun: Closed
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row md:justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">&copy; 2023 Rammeh MotoScoot. All rights reserved.</p>
          <div className="flex flex-wrap justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-yellow-500 text-sm transition">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-yellow-500 text-sm transition">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-yellow-500 text-sm transition">Shipping Policy</a>
            <a href="#" className="text-gray-400 hover:text-yellow-500 text-sm transition">Return Policy</a>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button 
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 bg-yellow-500 hover:bg-yellow-600 text-black p-3 rounded-full shadow-lg transition-all hover:scale-110 group animate-bounce"
        aria-label="Back to top"
      >
        <ChevronUp size={20} className="group-hover:rotate-180 transition-transform duration-500" />
        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-white animate-ping"></span>
      </button>
    </footer>
  );
};

export default Footer;
