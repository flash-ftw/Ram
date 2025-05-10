import { Link } from "wouter";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@shared/schema";
import { getImageUrl, formatPrice } from "@/lib/utils";
import MotorcycleIcon from "@/components/ui/motorcycle-icon";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Card className="moto-card bg-black rounded-lg overflow-hidden shadow-md">
      <Link href={`/product/${product.slug}`}>
        <div className="relative w-full h-64 overflow-hidden">
          <img 
            src={getImageUrl(product.mainImage)} 
            alt={product.name} 
            className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110"
          />
          {product.featured && (
            <div className="absolute top-0 right-0 m-3">
              <Badge className="moto-badge">
                Featured
              </Badge>
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-5 bg-black text-white">
        <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wide border-yellow-500 text-yellow-500">
          {product.categoryId === 1 ? 'Motorcycles' : 
           product.categoryId === 2 ? 'Accessories' : 
           product.categoryId === 3 ? 'Gear' : 'Parts'}
        </Badge>
        <h3 className="mt-2 text-lg font-semibold">
          <Link href={`/product/${product.slug}`} className="hover:text-yellow-500 transition-colors">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-gray-400 line-clamp-2">
          {product.description}
        </p>
        <div className="mt-3 flex justify-between items-center">
          <span className="font-bold text-lg text-yellow-500">{formatPrice(product.price)}</span>
          <Button 
            asChild
            variant="outline" 
            size="sm"
            className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black px-3 py-1 rounded-lg transition-all duration-300"
          >
            <Link href={`/product/${product.slug}`} className="flex items-center">
              <MotorcycleIcon size={16} className="mr-1" /> Details <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
