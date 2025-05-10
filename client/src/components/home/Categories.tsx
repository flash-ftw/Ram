import { Link } from "wouter";
import { ArrowRight, Layers } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";

const Categories = () => {
  const { data: categories = [], isLoading } = useCategories();

  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center mb-4">
            <Layers className="text-yellow-500 mr-2" size={28} />
            <span className="text-yellow-500 text-lg uppercase font-semibold tracking-wider">Parcourir les Options</span>
          </div>
          <h2 className="text-4xl font-bold mb-4 moto-heading inline-block after:bottom-[-10px] after:w-24 after:left-1/2 after:-translate-x-1/2">
            Catégories de Motos
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mt-6">
            Explorez notre large gamme de motos et d'accessoires pour trouver la moto parfaite pour vos aventures.
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="relative rounded-md overflow-hidden h-80 shadow-md animate-pulse bg-black border-2 border-yellow-500">
                <div className="absolute bottom-0 left-0 right-0 bg-gray-800 h-24 p-4">
                  <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <div key={category.id} className="relative rounded-md overflow-hidden group h-80 shadow-xl border-2 border-yellow-500 transform transition-all duration-300 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
                {category.image ? (
                  <img 
                    src={category.image} 
                    alt={`${category.name} Category`} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <span className="text-3xl text-yellow-500">
                      <Layers size={48} />
                    </span>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black to-transparent">
                  <h3 className="text-white text-2xl font-bold mb-2">{category.name}</h3>
                  <span className="inline-flex items-center text-yellow-500 font-medium group-hover:text-yellow-400 transition-colors">
                    Explore Collection
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:ml-3 transition-all" />
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
