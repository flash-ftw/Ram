import { Link } from "wouter";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Card className="product-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl">
      <Link href={`/product/${product.slug}`}>
        <div className="relative w-full h-64">
          <img 
            src={product.mainImage} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        </div>
      </Link>
      <CardContent className="p-5">
        <Badge variant="default" className="text-xs font-semibold uppercase tracking-wide">
          {/* We'll replace this with actual category name later */}
          {product.categoryId === 1 ? 'Furniture' : 
           product.categoryId === 2 ? 'Electronics' : 
           product.categoryId === 3 ? 'Lighting' : 'Decor'}
        </Badge>
        <h3 className="mt-2 text-lg font-semibold">
          <Link href={`/product/${product.slug}`} className="hover:text-primary transition-colors">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-gray-500 line-clamp-2">
          {product.description}
        </p>
        <div className="mt-3 flex justify-between items-center">
          <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
          <Button 
            asChild
            variant="secondary" 
            size="sm"
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-lg transition"
          >
            <Link href={`/product/${product.slug}`}>
              <ShoppingCart className="w-4 h-4 mr-1" /> View
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
