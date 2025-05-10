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
                  width="32" 
                  height="32" 
                  viewBox="0 0 64 64" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="group-hover:scale-110 transition-transform"
                  fill="currentColor"
                >
                  <path d="M13.895 39.35h-2.52c-1.754.23 1.685 1.96 1.685 1.96s1.685-1.239 1.685-1.614c-.001-.375-.85-.346-.85-.346" />
                  <path d="M26.766 51.159c-.466.269-.93.875-1.03 1.346l-.19.894c-.1.472.009 1.028.241 1.236c.232.209.545 0 .694-.461l.86-2.661c.151-.464-.109-.624-.575-.354" />
                  <path d="M38.883 50.143c-.465.271-.93.875-1.029 1.348l-.191.892c-.1.472.01 1.028.242 1.238c.232.208.545.001.695-.463l.859-2.659c.148-.466-.111-.625-.576-.356" />
                  <path d="M52.625 43.558a9.41 9.41 0 0 0-7.074 3.182l-.646-.286c.207-.189.43-.385.689-.59c.41-.322.566-.688.574-1.051l12.426-5.883a3.774 3.774 0 0 0-.602-2.211c1.729-2.172 1.758-4.762 1.758-4.904V30.34h-1.5c-2.23 0-3.977.048-6.145.673c-1.482.428-2.537.888-3.318 1.386c.221-1.014.082-2.19-.785-3.442c0 0-5.709-5.956-12.273-7.799c1.965-1.562 2.613-3.287 2.613-6.885C38.342 7.505 32.745 2 25.865 2c-6.879 0-12.476 5.505-12.476 12.272c0 .49.032.925.087 1.322l-.017.006c-1.198.428 1.03 6.574 2.308 6.636c1.832 4.296 4.56 5.27 6.648 5.27c1.069 0 2.205-.282 3.319-.792l.342 4.041l-2.033 1.078l-.094-.084l-1.413-1.268l-.43-.387h-.581c-4.539 0-8.794 2.188-11.383 5.851l-.205.288c-1.218 1.707-2 2.915-1.781 4.1c.097.521.391.97.83 1.263c.401.27.97.646 1.618 1.074a10.353 10.353 0 0 0-5.775 2.272l1.386.142C3.676 46.732 2 49.563 2 52.779C2 57.873 6.197 62 11.375 62c4.079 0 7.539-2.565 8.829-6.143l.002.089a2.721 2.721 0 0 0 2.74 2.747c.087 0 .176-.003.267-.012l.038-.002l.038-.006l18.366-2.505l1.428-.194l-.141-1.41c-.014-.135-.016-.27-.02-.406a8.956 8.956 0 0 0-.037-.672a15.023 15.023 0 0 1-.061-1.934l.486.201a9.372 9.372 0 0 0-.061 1.025c0 5.094 4.197 9.221 9.375 9.221S62 57.873 62 52.779s-4.197-9.221-9.375-9.221" />
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
                    width="16" 
                    height="16" 
                    viewBox="0 0 64 64" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2 text-yellow-500 group-hover:scale-110 transition-transform"
                    fill="currentColor"
                  >
                    <path d="M13.895 39.35h-2.52c-1.754.23 1.685 1.96 1.685 1.96s1.685-1.239 1.685-1.614c-.001-.375-.85-.346-.85-.346" />
                    <path d="M26.766 51.159c-.466.269-.93.875-1.03 1.346l-.19.894c-.1.472.009 1.028.241 1.236c.232.209.545 0 .694-.461l.86-2.661c.151-.464-.109-.624-.575-.354" />
                    <path d="M38.883 50.143c-.465.271-.93.875-1.029 1.348l-.191.892c-.1.472.01 1.028.242 1.238c.232.208.545.001.695-.463l.859-2.659c.148-.466-.111-.625-.576-.356" />
                    <path d="M52.625 43.558a9.41 9.41 0 0 0-7.074 3.182l-.646-.286c.207-.189.43-.385.689-.59c.41-.322.566-.688.574-1.051l12.426-5.883a3.774 3.774 0 0 0-.602-2.211c1.729-2.172 1.758-4.762 1.758-4.904V30.34h-1.5c-2.23 0-3.977.048-6.145.673c-1.482.428-2.537.888-3.318 1.386c.221-1.014.082-2.19-.785-3.442c0 0-5.709-5.956-12.273-7.799c1.965-1.562 2.613-3.287 2.613-6.885C38.342 7.505 32.745 2 25.865 2c-6.879 0-12.476 5.505-12.476 12.272c0 .49.032.925.087 1.322l-.017.006c-1.198.428 1.03 6.574 2.308 6.636c1.832 4.296 4.56 5.27 6.648 5.27c1.069 0 2.205-.282 3.319-.792l.342 4.041l-2.033 1.078l-.094-.084l-1.413-1.268l-.43-.387h-.581c-4.539 0-8.794 2.188-11.383 5.851l-.205.288c-1.218 1.707-2 2.915-1.781 4.1c.097.521.391.97.83 1.263c.401.27.97.646 1.618 1.074a10.353 10.353 0 0 0-5.775 2.272l1.386.142C3.676 46.732 2 49.563 2 52.779C2 57.873 6.197 62 11.375 62c4.079 0 7.539-2.565 8.829-6.143l.002.089a2.721 2.721 0 0 0 2.74 2.747c.087 0 .176-.003.267-.012l.038-.002l.038-.006l18.366-2.505l1.428-.194l-.141-1.41c-.014-.135-.016-.27-.02-.406a8.956 8.956 0 0 0-.037-.672a15.023 15.023 0 0 1-.061-1.934l.486.201a9.372 9.372 0 0 0-.061 1.025c0 5.094 4.197 9.221 9.375 9.221S62 57.873 62 52.779s-4.197-9.221-9.375-9.221" />
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
