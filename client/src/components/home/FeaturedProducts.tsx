import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/products/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import MotorcycleIcon from "@/components/ui/motorcycle-icon";

const FeaturedProducts = () => {
  const { data: products = [], isLoading } = useProducts({ featured: true });

  return (
    <section id="featured" className="py-16 bg-gradient-to-b from-black to-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <MotorcycleIcon className="text-yellow-500 mr-2" size={28} />
            <span className="text-yellow-500 text-lg uppercase font-semibold tracking-wider">Motos Tendance</span>
          </div>
          <h2 className="text-4xl font-bold mb-4 moto-heading inline-block after:bottom-[-10px] after:w-24 after:left-1/2 after:-translate-x-1/2">
            Motos Vedettes
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mt-6">
            Nos motos les plus populaires et performantes sélectionnées pour leur puissance exceptionnelle, leur design et leur excellence technique.
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-black border-2 border-yellow-500 rounded-lg overflow-hidden shadow-md animate-pulse">
                <div className="w-full h-64 bg-gray-800"></div>
                <div className="p-5">
                  <div className="h-4 bg-gray-800 rounded w-1/4 mb-2"></div>
                  <div className="h-6 bg-gray-800 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-800 rounded w-full mb-3"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-gray-800 rounded w-1/4"></div>
                    <div className="h-8 bg-yellow-500/30 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        
        <div className="mt-12 text-center">
          <Button asChild variant="outline" className="inline-flex items-center px-8 py-4 border-2 border-yellow-500 rounded-lg text-yellow-500 bg-transparent hover:bg-yellow-500 hover:text-black font-bold transition-all duration-300">
            <Link href="/products">
              Voir Toutes les Motos
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
