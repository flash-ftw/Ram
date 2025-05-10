import { useState } from "react";
import { useParams, Link, useLocation } from "wouter";
import { 
  Star, 
  StarHalf, 
  CheckCircle, 
  Facebook, 
  Twitter, 
  Instagram, 
  Heart, 
  ShoppingCart, 
  Check,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useProduct } from "@/hooks/useProduct";
import { useCategories } from "@/hooks/useCategories";
import { useCart } from "@/contexts/CartContext";
import { getImageUrl, formatPrice } from "@/lib/utils";

const ProductDetail = () => {
  const { slug } = useParams();
  const [, setLocation] = useLocation();
  const { data: product, isLoading } = useProduct(slug as string);
  const { data: categories = [] } = useCategories();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <div className="h-96 bg-gray-300"></div>
              </div>
              <div className="md:w-1/2 p-8">
                <div className="h-8 bg-gray-300 rounded w-1/4 mb-2"></div>
                <div className="h-10 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/4 mb-8"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-8"></div>
                <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-8"></div>
                <div className="h-10 bg-gray-300 rounded w-1/4 mb-4"></div>
                <div className="h-12 bg-gray-300 rounded w-full mb-8"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  const category = categories.find(c => c.id === product.categoryId);
  const featuresArray = product.features.split('\n').filter(f => f.trim() !== '');

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="text-gray-600 hover:text-gray-900 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
                Accueil
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <Link 
                  href={category ? `/products?category=${category.slug}` : "/products"} 
                  className="text-gray-600 hover:text-gray-900"
                >
                  {category ? category.name : 'Produits'}
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <span className="text-gray-500">
                  {product.name}
                </span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Product Images */}
            <div className="md:w-1/2">
              <div className="relative h-96 md:h-full">
                <img 
                  id="main-image" 
                  src={product.galleryImages && product.galleryImages.length > 0 
                    ? getImageUrl(product.galleryImages[selectedImage])
                    : getImageUrl(product.mainImage)
                  } 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
                
                {/* Image Gallery */}
                {product.galleryImages && product.galleryImages.length > 0 && (
                  <div className="absolute bottom-4 left-4 right-4 flex space-x-2">
                    {product.galleryImages.map((image, index) => (
                      <button 
                        key={index}
                        className={`w-16 h-16 rounded-md overflow-hidden border-2 ${
                          selectedImage === index ? 'border-primary' : 'border-transparent hover:border-gray-300'
                        } focus:outline-none`}
                        onClick={() => setSelectedImage(index)}
                      >
                        <img 
                          src={getImageUrl(image)} 
                          alt={`${product.name} view ${index + 1}`} 
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Product Details */}
            <div className="md:w-1/2 p-8">
              <Badge variant="default" className="text-sm font-semibold uppercase tracking-wide">
                {category?.name || 'Produit'}
              </Badge>
              <h1 className="mt-2 text-3xl font-bold text-gray-900">{product.name}</h1>
              
              <div className="mt-4 flex items-center">
                <div className="flex text-amber-400">
                  <Star className="fill-current" />
                  <Star className="fill-current" />
                  <Star className="fill-current" />
                  <Star className="fill-current" />
                  <StarHalf className="fill-current" />
                </div>
                <span className="ml-2 text-gray-600">4.5 (128 avis)</span>
              </div>
              
              <div className="mt-6">
                <h2 className="text-lg font-medium text-gray-900">Description</h2>
                <p className="mt-2 text-gray-600">
                  {product.description}
                </p>
              </div>
              
              <div className="mt-6">
                <h2 className="text-lg font-medium text-gray-900">Caractéristiques</h2>
                <ul className="mt-2 space-y-2">
                  {featuresArray.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <CheckCircle className="text-green-500 mr-2 flex-shrink-0" size={18} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-8 flex items-center">
                <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <>
                    <span className="ml-3 text-lg text-gray-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="ml-3 px-2 py-1 text-xs font-semibold text-white bg-green-500 rounded">
                      Économisez {Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </span>
                  </>
                )}
              </div>
              
              {/* Quantity Selector */}
              <div className="mt-6 flex items-center">
                <span className="text-gray-700 mr-4">Quantité :</span>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button 
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="px-4 py-2 border-r border-gray-300 text-gray-600 hover:bg-gray-100 focus:outline-none"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-gray-700">{quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="px-4 py-2 border-l border-gray-300 text-gray-600 hover:bg-gray-100 focus:outline-none"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button 
                  onClick={() => {
                    setIsAddingToCart(true);
                    
                    try {
                      // Add to cart
                      addItem(product, quantity);
                      
                      // Show success toast
                      toast({
                        title: "Ajouté au Panier",
                        description: `${quantity} ${quantity > 1 ? 'articles' : 'article'} ajouté à votre panier.`,
                        variant: "default",
                        duration: 3000,
                      });
                      
                      // Reset quantity
                      setQuantity(1);
                    } catch (error) {
                      // Show error toast
                      toast({
                        title: "Erreur",
                        description: "Impossible d'ajouter l'article au panier. Veuillez réessayer.",
                        variant: "destructive",
                      });
                    } finally {
                      setIsAddingToCart(false);
                    }
                  }}
                  disabled={isAddingToCart}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-3 px-6 flex items-center justify-center"
                >
                  <ShoppingCart className="mr-2" size={18} />
                  {isAddingToCart ? 'Ajout en cours...' : 'Ajouter au Panier'}
                </Button>
                <Button 
                  onClick={() => {
                    addItem(product, quantity);
                    setLocation('/cart');
                  }}
                  variant="outline" 
                  className="flex-1 bg-white hover:bg-gray-100 text-gray-800 font-medium py-3 px-6 border border-gray-300 flex items-center justify-center"
                >
                  Acheter Maintenant
                </Button>
              </div>
              
              {/* Social Sharing */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h2 className="text-sm font-medium text-gray-900">Partager ce produit</h2>
                <div className="mt-2 flex space-x-4">
                  <button className="text-gray-500 hover:text-primary" aria-label="Partager sur Facebook">
                    <Facebook size={18} />
                  </button>
                  <button className="text-gray-500 hover:text-primary" aria-label="Partager sur Twitter">
                    <Twitter size={18} />
                  </button>
                  <button className="text-gray-500 hover:text-primary" aria-label="Partager sur Instagram">
                    <Instagram size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Section de spécifications techniques pour les motos */}
          {(product.motorType || product.displacement || product.cooling || product.transmission) && (
            <div className="mt-8 p-8 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Spécifications Techniques</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Colonne 1: Moteur et performances */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Moteur et Performance</h3>
                  
                  {product.motorType && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type de moteur:</span>
                      <span className="font-medium">{product.motorType}</span>
                    </div>
                  )}
                  
                  {product.displacement && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cylindrée:</span>
                      <span className="font-medium">{product.displacement}</span>
                    </div>
                  )}
                  
                  {product.cooling && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Refroidissement:</span>
                      <span className="font-medium">{product.cooling}</span>
                    </div>
                  )}
                  
                  {product.fuelSystem && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Alimentation:</span>
                      <span className="font-medium">{product.fuelSystem}</span>
                    </div>
                  )}
                  
                  {product.ignition && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Allumage:</span>
                      <span className="font-medium">{product.ignition}</span>
                    </div>
                  )}
                  
                  {product.maxSpeed && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vitesse max:</span>
                      <span className="font-medium">{product.maxSpeed} km/h</span>
                    </div>
                  )}
                </div>
                
                {/* Colonne 2: Transmission et châssis */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Transmission et Châssis</h3>
                  
                  {product.transmission && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transmission:</span>
                      <span className="font-medium">{product.transmission}</span>
                    </div>
                  )}
                  
                  {product.starter && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Démarrage:</span>
                      <span className="font-medium">{product.starter}</span>
                    </div>
                  )}
                  
                  {product.brakes && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Freins:</span>
                      <span className="font-medium">{product.brakes}</span>
                    </div>
                  )}
                  
                  {product.wheelSize && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Taille des roues:</span>
                      <span className="font-medium">{product.wheelSize}</span>
                    </div>
                  )}
                  
                  {product.tires && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pneus:</span>
                      <span className="font-medium">{product.tires}</span>
                    </div>
                  )}
                </div>
                
                {/* Colonne 3: Dimensions et autres */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Dimensions et Autres</h3>
                  
                  {product.weight && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Poids:</span>
                      <span className="font-medium">{product.weight} kg</span>
                    </div>
                  )}
                  
                  {product.fuelCapacity && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Réservoir:</span>
                      <span className="font-medium">{product.fuelCapacity} litres</span>
                    </div>
                  )}
                  
                  {product.fuelConsumption && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Consommation:</span>
                      <span className="font-medium">{product.fuelConsumption} L/100km</span>
                    </div>
                  )}
                  
                  {product.headlight && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phare:</span>
                      <span className="font-medium">{product.headlight}</span>
                    </div>
                  )}
                  
                  {product.dashboard && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tableau de bord:</span>
                      <span className="font-medium">{product.dashboard}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
