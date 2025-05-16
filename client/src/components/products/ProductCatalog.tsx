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
import { useBrands } from "@/hooks/useBrands";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

const ProductCatalog = () => {
  const { t } = useTranslation('common');
  const language = i18n.language;
  const isRTL = language === 'ar';
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const categorySlug = searchParams.get('category');
  const searchQuery = searchParams.get('search');

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categorySlug ? [categorySlug] : []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 20000]);
  const [sortBy, setSortBy] = useState<string>("featured");
  
  // États pour les filtres de motos
  const [motorType, setMotorType] = useState<string>("");
  const [displacement, setDisplacement] = useState<string>("");
  const [cooling, setCooling] = useState<string>("");
  const [transmission, setTransmission] = useState<string>("");
  const [fuelSystem, setFuelSystem] = useState<string>("");
  const [brakes, setBrakes] = useState<string>("");
  const [maxSpeedRange, setMaxSpeedRange] = useState<number[]>([0, 150]);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch all products with filters
  const { data: products = [], isLoading } = useProducts({
    categories: selectedCategories,
    brands: selectedBrands,
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    sortBy,
    search: searchQuery || undefined,
    // Filtres de spécifications motos
    motorType: motorType === "all" ? undefined : motorType,
    displacement: displacement === "all" ? undefined : displacement,
    cooling: cooling === "all" ? undefined : cooling,
    fuelSystem: fuelSystem === "all" ? undefined : fuelSystem,
    transmission: transmission === "all" ? undefined : transmission,
    brakes: brakes === "all" ? undefined : brakes,
    maxSpeedMin: maxSpeedRange[0] > 0 ? maxSpeedRange[0] : undefined,
    maxSpeedMax: maxSpeedRange[1] < 150 ? maxSpeedRange[1] : undefined,
  });

  // Fetch all categories
  const { data: categories = [] } = useCategories();
  
  // Fetch all brands
  const { data: brands = [] } = useBrands();

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
  }, [
    selectedCategories, 
    selectedBrands,
    priceRange, 
    sortBy, 
    searchQuery, 
    motorType, 
    displacement, 
    cooling, 
    transmission, 
    fuelSystem, 
    brakes, 
    maxSpeedRange
  ]);

  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categorySlug)) {
        return prev.filter(slug => slug !== categorySlug);
      } else {
        return [...prev, categorySlug];
      }
    });
  };
  
  const handleBrandChange = (brandSlug: string) => {
    setSelectedBrands(prev => {
      if (prev.includes(brandSlug)) {
        return prev.filter(slug => slug !== brandSlug);
      } else {
        return [...prev, brandSlug];
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
          <h2 className={`text-3xl font-bold mb-4 ${isRTL ? 'rtl' : ''}`}>{t('products.title')}</h2>
          <p className={`text-gray-600 max-w-2xl mx-auto ${isRTL ? 'rtl' : ''}`}>
            {t('products.description')}
            {searchQuery && (
              <span className="block mt-2 text-primary">
                {t('products.searchResults', { query: searchQuery })}
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-gray-50 rounded-lg p-5 shadow-sm sticky top-24">
              <h3 className="font-semibold text-lg mb-4">{t('products.filterTitle')}</h3>
              
              {/* Categories Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">{t('products.categoriesTitle')}</h4>
                <div className="space-y-2 category-filter max-h-48 overflow-y-auto pr-2">
                  <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                    <Checkbox 
                      id="all-categories"
                      checked={selectedCategories.length === 0}
                      onCheckedChange={() => setSelectedCategories([])}
                    />
                    <Label htmlFor="all-categories" className="text-gray-700">{t('products.filter.allCategories')}</Label>
                  </div>
                  
                  {categories.map((category) => (
                    <div key={category.id} className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                      <Checkbox 
                        id={`category-${category.slug}`}
                        checked={selectedCategories.includes(category.slug)}
                        onCheckedChange={() => handleCategoryChange(category.slug)}
                      />
                      <Label htmlFor={`category-${category.slug}`} className="text-gray-700">
                        {t(`products.categoryItems.${category.slug}`) || category.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Brands Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">{t('products.filter.brands')}</h4>
                <div className="space-y-2 brand-filter max-h-48 overflow-y-auto pr-2">
                  <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                    <Checkbox 
                      id="all-brands"
                      checked={selectedBrands.length === 0}
                      onCheckedChange={() => setSelectedBrands([])}
                    />
                    <Label htmlFor="all-brands" className="text-gray-700">{t('products.filter.allBrands')}</Label>
                  </div>
                  
                  {brands.map((brand) => (
                    <div key={brand.id} className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                      <Checkbox 
                        id={`brand-${brand.slug}`}
                        checked={selectedBrands.includes(brand.slug)}
                        onCheckedChange={() => handleBrandChange(brand.slug)}
                      />
                      <Label htmlFor={`brand-${brand.slug}`} className="text-gray-700">{brand.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Price Range Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">{t('products.filter.priceRange')}</h4>
                <div className="px-2">
                  <Slider
                    defaultValue={[0, 20000]}
                    max={20000}
                    step={100}
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
              
              {/* Spécifications Techniques Moto */}
              <div className="mb-6 border-t pt-4 mt-4">
                <h4 className="font-medium text-gray-700 mb-3">{t('products.specs.motoSpecifications')}</h4>
                
                {/* Type de moteur */}
                <div className="mb-4">
                  <Label htmlFor="motor-type" className="text-sm text-gray-600 mb-1 block">{t('products.specs.engineType')}</Label>
                  <Select value={motorType} onValueChange={setMotorType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t('products.filter.all')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('products.filter.all')}</SelectItem>
                      <SelectItem value="2 temps">{t('products.specs.twoStroke')}</SelectItem>
                      <SelectItem value="4 temps">{t('products.specs.fourStroke')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Cylindrée */}
                <div className="mb-4">
                  <Label htmlFor="displacement" className="text-sm text-gray-600 mb-1 block">{t('products.specs.displacement')}</Label>
                  <Select value={displacement} onValueChange={setDisplacement}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t('products.filter.all')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('products.filter.all')}</SelectItem>
                      <SelectItem value="49cc">49cc</SelectItem>
                      <SelectItem value="70cc">70cc</SelectItem>
                      <SelectItem value="102cc">102cc</SelectItem>
                      <SelectItem value="110cc">110cc</SelectItem>
                      <SelectItem value="125cc">125cc</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Transmission */}
                <div className="mb-4">
                  <Label htmlFor="transmission" className="text-sm text-gray-600 mb-1 block">{t('products.specs.transmission')}</Label>
                  <Select value={transmission} onValueChange={setTransmission}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t('products.filter.all')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('products.filter.all')}</SelectItem>
                      <SelectItem value="Manuelle">{t('products.specs.manual')}</SelectItem>
                      <SelectItem value="Semi-automatique">{t('products.specs.semiAuto')}</SelectItem>
                      <SelectItem value="Automatique (CVT)">{t('products.specs.automatic')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Refroidissement */}
                <div className="mb-4">
                  <Label htmlFor="cooling" className="text-sm text-gray-600 mb-1 block">{t('products.specs.cooling')}</Label>
                  <Select value={cooling} onValueChange={setCooling}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t('products.filter.all')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('products.filter.all')}</SelectItem>
                      <SelectItem value="Refroidi par air">{t('products.specs.airCooled')}</SelectItem>
                      <SelectItem value="Refroidi par eau">{t('products.specs.waterCooled')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Freins */}
                <div className="mb-4">
                  <Label htmlFor="brakes" className="text-sm text-gray-600 mb-1 block">{t('products.specs.brakes')}</Label>
                  <Select value={brakes} onValueChange={setBrakes}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t('products.filter.all')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('products.filter.all')}</SelectItem>
                      <SelectItem value="Tambour">{t('products.specs.drum')}</SelectItem>
                      <SelectItem value="Disque (avant)">{t('products.specs.discFront')}</SelectItem>
                      <SelectItem value="Disque (arrière)">{t('products.specs.discRear')}</SelectItem>
                      <SelectItem value="Disque (avant et arrière)">{t('products.specs.discBoth')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Vitesse Max */}
                <div className="mb-4">
                  <Label className="text-sm text-gray-600 mb-1 block">{t('products.specs.maxSpeed')} (km/h)</Label>
                  <div className="px-2">
                    <Slider
                      defaultValue={[0, 150]}
                      max={150}
                      step={5}
                      value={maxSpeedRange}
                      onValueChange={setMaxSpeedRange}
                      className="my-4"
                    />
                    <div className="flex justify-between mt-2 text-sm text-gray-500">
                      <span>{maxSpeedRange[0]} km/h</span>
                      <span>{maxSpeedRange[1]} km/h</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Sort By */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">{t('products.filter.sortBy')}</h4>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t('products.filter.selectSortOrder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">{t('products.filter.featured')}</SelectItem>
                    <SelectItem value="price-asc">{t('products.filter.priceLowToHigh')}</SelectItem>
                    <SelectItem value="price-desc">{t('products.filter.priceHighToLow')}</SelectItem>
                    <SelectItem value="newest">{t('products.filter.newest')}</SelectItem>
                    <SelectItem value="bestselling">{t('products.filter.bestSelling')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Apply Filters Button */}
              <Button
                className="w-full bg-primary hover:bg-blue-600 text-white font-medium"
                onClick={applyFilters}
              >
                {t('products.filter.applyFilters')}
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
                <h3 className="text-xl font-semibold text-gray-700 mb-2">{t('products.noProductsFound')}</h3>
                <p className="text-gray-500">
                  {t('products.tryAdjustingFilters')}
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
                        <span className="sr-only">{t('pagination.previous')}</span>
                        <ChevronLeft className={`h-4 w-4 ${isRTL ? 'transform rotate-180' : ''}`} />
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
                        <span className="sr-only">{t('pagination.next')}</span>
                        <ChevronRight className={`h-4 w-4 ${isRTL ? 'transform rotate-180' : ''}`} />
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
