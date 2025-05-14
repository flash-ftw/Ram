import { Link } from "wouter";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@shared/schema";
import { getImageUrl, formatPrice } from "@/lib/utils";
import MotorcycleIcon from "@/components/ui/motorcycle-icon";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { t } = useTranslation('common');
  const isRTL = i18n.language === 'ar';
  
  // Fonction pour obtenir la traduction de la catégorie
  const getCategoryLabel = (categoryId: number) => {
    switch(categoryId) {
      case 17:
        return t('products.categoryItems.thermal');
      case 18:
        return t('products.categoryItems.electric');
      case 7:
        return t('products.categoryItems.helmets');
      case 14:
        return t('products.categoryItems.motorcycles');
      default:
        return t('products.categoryItems.category');
    }
  };
  
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
            <div className={`absolute top-0 ${isRTL ? 'left-0 m-3' : 'right-0 m-3'}`}>
              <Badge className="moto-badge">
                {t('products.featured')}
              </Badge>
            </div>
          )}
        </div>
      </Link>
      <CardContent className={`p-5 bg-black text-white ${isRTL ? 'text-right' : ''}`}>
        <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wide border-yellow-500 text-yellow-500">
          {getCategoryLabel(product.categoryId)}
        </Badge>
        <h3 className="mt-2 text-lg font-semibold">
          <Link href={`/product/${product.slug}`} className="hover:text-yellow-500 transition-colors">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-gray-400 line-clamp-2">
          {product.description}
        </p>
        <div className={`mt-3 flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="font-bold text-lg text-yellow-500">{formatPrice(product.price)}</span>
          <Button 
            asChild
            variant="outline" 
            size="sm"
            className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black px-3 py-1 rounded-lg transition-all duration-300"
          >
            <Link href={`/product/${product.slug}`} className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              <MotorcycleIcon size={16} className={isRTL ? 'ml-1' : 'mr-1'} /> 
              {t('buttons.viewDetails')} 
              <ArrowRight className={`w-3 h-3 ${isRTL ? 'mr-1' : 'ml-1'}`} />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
