import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";

const Categories = () => {
  const { data: categories = [], isLoading } = useCategories();

  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Shop By Category</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our wide range of product categories to find exactly what you're looking for.
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="relative rounded-lg overflow-hidden h-64 shadow-md animate-pulse bg-gray-300"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div key={category.id} className="relative rounded-lg overflow-hidden group h-64 shadow-md">
                <div className="absolute inset-0 bg-black opacity-40 group-hover:opacity-30 transition-opacity"></div>
                <img 
                  src={category.image} 
                  alt={`${category.name} Category`} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h3 className="text-white text-xl font-bold mb-2">{category.name}</h3>
                  <span className="inline-flex items-center text-white text-sm">
                    Explore Collection
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </span>
                </div>
                <Link 
                  href={`/products?category=${category.slug}`} 
                  className="absolute inset-0" 
                  aria-label={`View ${category.name}`}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Categories;
