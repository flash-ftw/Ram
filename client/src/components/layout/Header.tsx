import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, Search, ShoppingCart, X } from "lucide-react";
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
            <Link href="/" className="flex items-center">
              <span className="text-yellow-500 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.38 9.78l-1.3-2.26c-.17-.3-.51-.48-.87-.48h-2.83l-1.32-1.41a1.15 1.15 0 0 0-.85-.36h-2.42a1.15 1.15 0 0 0-.85.36L8.62 7.04H5.79c-.36 0-.7.18-.87.48L3.62 9.78C3.23 10.5 3 11.11 3 12v3a1 1 0 0 0 1 1h1.5a2.5 2.5 0 0 0 5 0h3a2.5 2.5 0 0 0 5 0H20a1 1 0 0 0 1-1v-3c0-.89-.23-1.5-.62-2.22Z" />
                  <circle cx="7.5" cy="16" r="1.5" />
                  <circle cx="16.5" cy="16" r="1.5" />
                </svg>
              </span>
              <span className="font-bold text-xl md:text-2xl">
                <span className="text-yellow-500">Rammeh</span> <span className="text-white">MotoScoot</span>
              </span>
            </Link>
          </div>
          
          {/* Navigation - Desktop */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/" 
              className={`px-3 py-2 font-medium ${location === "/" ? "text-yellow-500" : "text-white hover:text-yellow-500"} transition-colors`}
            >
              Home
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center px-3 py-2 font-medium text-white hover:text-yellow-500 focus:outline-none transition-colors">
                Products
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black border border-yellow-500 text-white">
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
              className={`px-3 py-2 font-medium ${location === "/about" ? "text-yellow-500" : "text-white hover:text-yellow-500"} transition-colors`}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className={`px-3 py-2 font-medium ${location === "/contact" ? "text-yellow-500" : "text-white hover:text-yellow-500"} transition-colors`}
            >
              Contact
            </Link>
          </nav>
          
          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xs mx-4">
            <form className="relative w-full" onSubmit={handleSearch}>
              <Input
                type="text"
                placeholder="Search products..."
                className="w-full py-2 px-4 pr-10 rounded-lg border border-gray-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit" 
                size="icon" 
                variant="ghost" 
                className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                <Search size={18} />
              </Button>
            </form>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              href="/" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/products" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Products
            </Link>
            <Link 
              href="/about" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
          <div className="px-5 py-4">
            <form className="relative" onSubmit={handleSearch}>
              <Input
                type="text"
                placeholder="Search products..."
                className="w-full py-2 px-4 pr-10 rounded-lg border border-gray-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit" 
                size="icon" 
                variant="ghost" 
                className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                <Search size={18} />
              </Button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
