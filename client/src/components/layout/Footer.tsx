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
    <footer className="bg-black text-white border-t border-yellow-500">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <span className="text-yellow-500 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.38 9.78l-1.3-2.26c-.17-.3-.51-.48-.87-.48h-2.83l-1.32-1.41a1.15 1.15 0 0 0-.85-.36h-2.42a1.15 1.15 0 0 0-.85.36L8.62 7.04H5.79c-.36 0-.7.18-.87.48L3.62 9.78C3.23 10.5 3 11.11 3 12v3a1 1 0 0 0 1 1h1.5a2.5 2.5 0 0 0 5 0h3a2.5 2.5 0 0 0 5 0H20a1 1 0 0 0 1-1v-3c0-.89-.23-1.5-.62-2.22Z" />
                  <circle cx="7.5" cy="16" r="1.5" />
                  <circle cx="16.5" cy="16" r="1.5" />
                </svg>
              </span>
              <h3 className="text-xl font-bold">
                <span className="text-yellow-500">Rammeh</span> <span className="text-white">MotoScoot</span>
              </h3>
            </div>
            <p className="text-gray-400 mb-4">Your premier destination for motorcycles and accessories since 2015.</p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-yellow-500 hover:text-yellow-400 transition" 
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="#" 
                className="text-yellow-500 hover:text-yellow-400 transition" 
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a 
                href="#" 
                className="text-yellow-500 hover:text-yellow-400 transition" 
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-yellow-500">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/" 
                  className="text-gray-400 hover:text-yellow-500 transition"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/products" 
                  className="text-gray-400 hover:text-yellow-500 transition"
                >
                  Shop All
                </Link>
              </li>
              <li>
                <Link 
                  href="/#featured" 
                  className="text-gray-400 hover:text-yellow-500 transition"
                >
                  Featured Bikes
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-gray-400 hover:text-yellow-500 transition"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-gray-400 hover:text-yellow-500 transition"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-yellow-500">Categories</h3>
            <ul className="space-y-2">
              {categories?.map((category) => (
                <li key={category.id}>
                  <Link 
                    href={`/products?category=${category.slug}`}
                    className="text-gray-400 hover:text-yellow-500 transition"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-yellow-500">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="mt-1 mr-3 text-yellow-500 flex-shrink-0" size={18} />
                <span className="text-gray-400">123 Motorcycle Ave, Speed District, Tunis, 1001</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-3 text-yellow-500 flex-shrink-0" size={18} />
                <span className="text-gray-400">(+216) 71-123-456</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-3 text-yellow-500 flex-shrink-0" size={18} />
                <span className="text-gray-400">info@rammehmotoscoot.com</span>
              </li>
              <li className="flex items-start">
                <Clock className="mt-1 mr-3 text-yellow-500 flex-shrink-0" size={18} />
                <span className="text-gray-400">
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
        className="fixed bottom-6 right-6 bg-yellow-500 hover:bg-yellow-600 text-black p-3 rounded-full shadow-lg transition-all hover:scale-110"
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
