import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, Search, X, Bike, ChevronDown, Settings, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCategories } from "@/hooks/useCategories";

const Header = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: categories } = useCategories();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to search results page
    window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-black text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center group">
              <div className="relative mr-3 text-yellow-500">
                <svg 
                  width="32" 
                  height="32" 
                  viewBox="0 0 64 64" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="animate-pulse group-hover:animate-none group-hover:scale-110 transition-transform duration-300"
                  fill="currentColor"
                >
                  <path d="M13.895 39.35h-2.52c-1.754.23 1.685 1.96 1.685 1.96s1.685-1.239 1.685-1.614c-.001-.375-.85-.346-.85-.346" />
                  <path d="M26.766 51.159c-.466.269-.93.875-1.03 1.346l-.19.894c-.1.472.009 1.028.241 1.236c.232.209.545 0 .694-.461l.86-2.661c.151-.464-.109-.624-.575-.354" />
                  <path d="M38.883 50.143c-.465.271-.93.875-1.029 1.348l-.191.892c-.1.472.01 1.028.242 1.238c.232.208.545.001.695-.463l.859-2.659c.148-.466-.111-.625-.576-.356" />
                  <path d="M52.625 43.558a9.41 9.41 0 0 0-7.074 3.182l-.646-.286c.207-.189.43-.385.689-.59c.41-.322.566-.688.574-1.051l12.426-5.883a3.774 3.774 0 0 0-.602-2.211c1.729-2.172 1.758-4.762 1.758-4.904V30.34h-1.5c-2.23 0-3.977.048-6.145.673c-1.482.428-2.537.888-3.318 1.386c.221-1.014.082-2.19-.785-3.442c0 0-5.709-5.956-12.273-7.799c1.965-1.562 2.613-3.287 2.613-6.885C38.342 7.505 32.745 2 25.865 2c-6.879 0-12.476 5.505-12.476 12.272c0 .49.032.925.087 1.322l-.017.006c-1.198.428 1.03 6.574 2.308 6.636c1.832 4.296 4.56 5.27 6.648 5.27c1.069 0 2.205-.282 3.319-.792l.342 4.041l-2.033 1.078l-.094-.084l-1.413-1.268l-.43-.387h-.581c-4.539 0-8.794 2.188-11.383 5.851l-.205.288c-1.218 1.707-2 2.915-1.781 4.1c.097.521.391.97.83 1.263c.401.27.97.646 1.618 1.074a10.353 10.353 0 0 0-5.775 2.272l1.386.142C3.676 46.732 2 49.563 2 52.779C2 57.873 6.197 62 11.375 62c4.079 0 7.539-2.565 8.829-6.143l.002.089a2.721 2.721 0 0 0 2.74 2.747c.087 0 .176-.003.267-.012l.038-.002l.038-.006l18.366-2.505l1.428-.194l-.141-1.41c-.014-.135-.016-.27-.02-.406a8.956 8.956 0 0 0-.037-.672a15.023 15.023 0 0 1-.061-1.934l.486.201a9.372 9.372 0 0 0-.061 1.025c0 5.094 4.197 9.221 9.375 9.221S62 57.873 62 52.779s-4.197-9.221-9.375-9.221" />
                </svg>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full animate-ping opacity-75 group-hover:opacity-100"></span>
              </div>
              <span className="font-bold text-xl md:text-2xl">
                <span className="text-yellow-500 group-hover:text-yellow-400 transition-colors">Rammeh</span>{" "}
                <span className="text-white group-hover:tracking-wider transition-all duration-300">MotoScoot</span>
              </span>
            </Link>
          </div>
          
          {/* Navigation - Desktop */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/" 
              className={`flex items-center px-3 py-2 font-medium ${location === "/" ? "text-yellow-500" : "text-white hover:text-yellow-500"} transition-colors group`}
            >
              <span className="inline-block mr-1 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </span>
              Home
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center px-3 py-2 font-medium text-white hover:text-yellow-500 focus:outline-none transition-colors group">
                <span className="inline-block mr-1 group-hover:scale-110 transition-transform">
                  <svg 
                    width="18" 
                    height="18" 
                    viewBox="0 0 64 64" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="inline-block"
                    fill="currentColor"
                  >
                    <path d="M13.895 39.35h-2.52c-1.754.23 1.685 1.96 1.685 1.96s1.685-1.239 1.685-1.614c-.001-.375-.85-.346-.85-.346" />
                    <path d="M26.766 51.159c-.466.269-.93.875-1.03 1.346l-.19.894c-.1.472.009 1.028.241 1.236c.232.209.545 0 .694-.461l.86-2.661c.151-.464-.109-.624-.575-.354" />
                    <path d="M38.883 50.143c-.465.271-.93.875-1.029 1.348l-.191.892c-.1.472.01 1.028.242 1.238c.232.208.545.001.695-.463l.859-2.659c.148-.466-.111-.625-.576-.356" />
                    <path d="M52.625 43.558a9.41 9.41 0 0 0-7.074 3.182l-.646-.286c.207-.189.43-.385.689-.59c.41-.322.566-.688.574-1.051l12.426-5.883a3.774 3.774 0 0 0-.602-2.211c1.729-2.172 1.758-4.762 1.758-4.904V30.34h-1.5c-2.23 0-3.977.048-6.145.673c-1.482.428-2.537.888-3.318 1.386c.221-1.014.082-2.19-.785-3.442c0 0-5.709-5.956-12.273-7.799c1.965-1.562 2.613-3.287 2.613-6.885C38.342 7.505 32.745 2 25.865 2c-6.879 0-12.476 5.505-12.476 12.272c0 .49.032.925.087 1.322l-.017.006c-1.198.428 1.03 6.574 2.308 6.636c1.832 4.296 4.56 5.27 6.648 5.27c1.069 0 2.205-.282 3.319-.792l.342 4.041l-2.033 1.078l-.094-.084l-1.413-1.268l-.43-.387h-.581c-4.539 0-8.794 2.188-11.383 5.851l-.205.288c-1.218 1.707-2 2.915-1.781 4.1c.097.521.391.97.83 1.263c.401.27.97.646 1.618 1.074a10.353 10.353 0 0 0-5.775 2.272l1.386.142C3.676 46.732 2 49.563 2 52.779C2 57.873 6.197 62 11.375 62c4.079 0 7.539-2.565 8.829-6.143l.002.089a2.721 2.721 0 0 0 2.74 2.747c.087 0 .176-.003.267-.012l.038-.002l.038-.006l18.366-2.505l1.428-.194l-.141-1.41c-.014-.135-.016-.27-.02-.406a8.956 8.956 0 0 0-.037-.672a15.023 15.023 0 0 1-.061-1.934l.486.201a9.372 9.372 0 0 0-.061 1.025c0 5.094 4.197 9.221 9.375 9.221S62 57.873 62 52.779s-4.197-9.221-9.375-9.221" />
                  </svg>
                </span>
                Products
                <ChevronDown size={14} className="ml-1 opacity-70 group-hover:translate-y-[2px] transition-transform" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black border border-yellow-500 text-white animate-in fade-in-50 zoom-in-95 duration-200">
                <DropdownMenuItem asChild className="hover:bg-yellow-500 hover:text-black">
                  <Link href="/products" className="w-full">All Products</Link>
                </DropdownMenuItem>
                {categories?.map((category) => (
                  <DropdownMenuItem key={category.id} asChild className="hover:bg-yellow-500 hover:text-black">
                    <Link href={`/products?category=${category.slug}`} className="w-full">
                      {category.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link 
              href="/about" 
              className={`flex items-center px-3 py-2 font-medium ${location === "/about" ? "text-yellow-500" : "text-white hover:text-yellow-500"} transition-colors group`}
            >
              <span className="inline-block mr-1 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 16v-4"/>
                  <path d="M12 8h.01"/>
                </svg>
              </span>
              About
            </Link>
            <Link 
              href="/contact" 
              className={`flex items-center px-3 py-2 font-medium ${location === "/contact" ? "text-yellow-500" : "text-white hover:text-yellow-500"} transition-colors group`}
            >
              <span className="inline-block mr-1 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </span>
              Contact
            </Link>
          </nav>
          
          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xs mx-4">
            <form className="relative w-full" onSubmit={handleSearch}>
              <Input
                type="text"
                placeholder="Search products..."
                className="w-full py-2 px-4 pr-10 rounded-lg border border-yellow-500 bg-gray-900 text-white focus-visible:ring-yellow-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit" 
                size="icon" 
                variant="ghost" 
                className="absolute right-1 top-1/2 transform -translate-y-1/2 text-yellow-500 hover:bg-transparent hover:text-yellow-400"
              >
                <Search size={18} />
              </Button>
            </form>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMobileMenu}
              className="text-yellow-500 hover:text-yellow-400 hover:bg-transparent"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black border-t border-yellow-500 animate-in slide-in-from-top duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              href="/" 
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-white hover:bg-yellow-500 hover:text-black transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              Home
            </Link>
            <Link 
              href="/products" 
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-white hover:bg-yellow-500 hover:text-black transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg 
                width="18" 
                height="18" 
                viewBox="0 0 64 64" 
                xmlns="http://www.w3.org/2000/svg"
                className="mr-3"
                fill="currentColor"
              >
                <path d="M13.895 39.35h-2.52c-1.754.23 1.685 1.96 1.685 1.96s1.685-1.239 1.685-1.614c-.001-.375-.85-.346-.85-.346" />
                <path d="M26.766 51.159c-.466.269-.93.875-1.03 1.346l-.19.894c-.1.472.009 1.028.241 1.236c.232.209.545 0 .694-.461l.86-2.661c.151-.464-.109-.624-.575-.354" />
                <path d="M38.883 50.143c-.465.271-.93.875-1.029 1.348l-.191.892c-.1.472.01 1.028.242 1.238c.232.208.545.001.695-.463l.859-2.659c.148-.466-.111-.625-.576-.356" />
                <path d="M52.625 43.558a9.41 9.41 0 0 0-7.074 3.182l-.646-.286c.207-.189.43-.385.689-.59c.41-.322.566-.688.574-1.051l12.426-5.883a3.774 3.774 0 0 0-.602-2.211c1.729-2.172 1.758-4.762 1.758-4.904V30.34h-1.5c-2.23 0-3.977.048-6.145.673c-1.482.428-2.537.888-3.318 1.386c.221-1.014.082-2.19-.785-3.442c0 0-5.709-5.956-12.273-7.799c1.965-1.562 2.613-3.287 2.613-6.885C38.342 7.505 32.745 2 25.865 2c-6.879 0-12.476 5.505-12.476 12.272c0 .49.032.925.087 1.322l-.017.006c-1.198.428 1.03 6.574 2.308 6.636c1.832 4.296 4.56 5.27 6.648 5.27c1.069 0 2.205-.282 3.319-.792l.342 4.041l-2.033 1.078l-.094-.084l-1.413-1.268l-.43-.387h-.581c-4.539 0-8.794 2.188-11.383 5.851l-.205.288c-1.218 1.707-2 2.915-1.781 4.1c.097.521.391.97.83 1.263c.401.27.97.646 1.618 1.074a10.353 10.353 0 0 0-5.775 2.272l1.386.142C3.676 46.732 2 49.563 2 52.779C2 57.873 6.197 62 11.375 62c4.079 0 7.539-2.565 8.829-6.143l.002.089a2.721 2.721 0 0 0 2.74 2.747c.087 0 .176-.003.267-.012l.038-.002l.038-.006l18.366-2.505l1.428-.194l-.141-1.41c-.014-.135-.016-.27-.02-.406a8.956 8.956 0 0 0-.037-.672a15.023 15.023 0 0 1-.061-1.934l.486.201a9.372 9.372 0 0 0-.061 1.025c0 5.094 4.197 9.221 9.375 9.221S62 57.873 62 52.779s-4.197-9.221-9.375-9.221" />
              </svg>
              Products
            </Link>
            <Link 
              href="/about" 
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-white hover:bg-yellow-500 hover:text-black transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4"/>
                <path d="M12 8h.01"/>
              </svg>
              About
            </Link>
            <Link 
              href="/contact" 
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-white hover:bg-yellow-500 hover:text-black transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              Contact
            </Link>
          </div>
          <div className="px-5 py-4">
            <form className="relative" onSubmit={handleSearch}>
              <Input
                type="text"
                placeholder="Search products..."
                className="w-full py-2 px-4 pr-10 rounded-lg border border-yellow-500 bg-gray-900 text-white focus-visible:ring-yellow-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit" 
                size="icon" 
                variant="ghost" 
                className="absolute right-1 top-1/2 transform -translate-y-1/2 text-yellow-500 hover:text-yellow-400"
              >
                <Search size={18} className="animate-pulse" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
