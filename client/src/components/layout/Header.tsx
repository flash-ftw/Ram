import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, Search, X, ChevronDown, Settings, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCategories } from "@/hooks/useCategories";
import MotorcycleIcon from "@/components/ui/motorcycle-icon";

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
                <MotorcycleIcon 
                  size={32} 
                  className="animate-pulse group-hover:animate-none group-hover:scale-110 transition-transform duration-300" 
                />
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
                  <MotorcycleIcon size={18} className="inline-block" />
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
              <MotorcycleIcon size={18} className="mr-3" />
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
