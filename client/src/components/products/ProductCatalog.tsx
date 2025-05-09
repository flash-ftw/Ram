import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";

const ProductCatalog = () => {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const categorySlug = searchParams.get('category');
  const searchQuery = searchParams.get('search');

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categorySlug ? [categorySlug] : []
  );
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch all products with filters
  const { data: products = [], isLoading } = useProducts({
    categories: selectedCategories,
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    sortBy,
    search: searchQuery || undefined,
  });

  // Fetch all categories
  const { data: categories = [] } = useCategories();

  // Pagination
  const productsPerPage = 6;
  const totalPages = Math.ceil(products.length / productsPerPage);
  const paginatedProducts = products.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, priceRange, sortBy, searchQuery]);

  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categorySlug)) {
        return prev.filter(slug => slug !== categorySlug);
      } else {
        return [...prev, categorySlug];
      }
    });
  };

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values);
  };

  const applyFilters = () => {
    // Filters are already applied through the useProducts hook
    // This is just a placeholder for the button
  };

  return (
    <section id="catalog" className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Product Catalog</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse our extensive collection of quality products for every need and style.
            {searchQuery && <span className="block mt-2 text-primary">Search results for: "{searchQuery}"</span>}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-gray-50 rounded-lg p-5 shadow-sm sticky top-24">
              <h3 className="font-semibold text-lg mb-4">Filters</h3>
              
              {/* Categories Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Categories</h4>
                <div className="space-y-2 category-filter max-h-48 overflow-y-auto pr-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="all"
                      checked={selectedCategories.length === 0}
                      onCheckedChange={() => setSelectedCategories([])}
                    />
                    <Label htmlFor="all" className="text-gray-700">All Products</Label>
                  </div>
                  
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={category.slug}
                        checked={selectedCategories.includes(category.slug)}
                        onCheckedChange={() => handleCategoryChange(category.slug)}
                      />
                      <Label htmlFor={category.slug} className="text-gray-700">{category.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Price Range Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Price Range</h4>
                <div className="px-2">
                  <Slider
                    defaultValue={[0, 1000]}
                    max={1000}
                    step={10}
                    value={priceRange}
                    onValueChange={handlePriceChange}
                    className="my-4"
                  />
                  <div className="flex justify-between mt-2 text-sm text-gray-500">
                    <span>{priceRange[0]} TND</span>
                    <span>{priceRange[1]}+ TND</span>
                  </div>
                </div>
              </div>
              
              {/* Sort By */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Sort By</h4>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select sort order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="bestselling">Best Selling</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Apply Filters Button */}
              <Button
                className="w-full bg-primary hover:bg-blue-600 text-white font-medium"
                onClick={applyFilters}
              >
                Apply Filters
              </Button>
            </div>
          </div>
          
          {/* Products Grid */}
          <div className="lg:w-3/4">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md animate-pulse">
                    <div className="w-full h-64 bg-gray-300"></div>
                    <div className="p-5">
                      <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                      <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-full mb-3"></div>
                      <div className="flex justify-between items-center">
                        <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                        <div className="h-8 bg-gray-300 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
                <p className="text-gray-500">
                  Try adjusting your filters or search criteria to find what you're looking for.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <nav className="inline-flex shadow-sm rounded-md">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="rounded-l-md border border-gray-300"
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      
                      {[...Array(totalPages)].map((_, i) => (
                        <Button
                          key={i}
                          variant={currentPage === i + 1 ? "default" : "outline"}
                          className={`border-t border-b border-gray-300 ${
                            currentPage === i + 1 ? "bg-primary text-white" : "bg-white text-gray-700"
                          }`}
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </Button>
                      ))}
                      
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="rounded-r-md border border-gray-300"
                      >
                        <span className="sr-only">Next</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductCatalog;
