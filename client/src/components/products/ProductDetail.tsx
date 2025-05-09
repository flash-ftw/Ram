import { useState } from "react";
import { useParams, Link } from "wouter";
import { 
  Star, 
  StarHalf, 
  CheckCircle, 
  Facebook, 
  Twitter, 
  Instagram, 
  Heart, 
  ShoppingCart 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProduct } from "@/hooks/useProduct";
import { useCategories } from "@/hooks/useCategories";
import { getImageUrl } from "@/lib/utils";

const ProductDetail = () => {
  const { slug } = useParams();
  const { data: product, isLoading } = useProduct(slug as string);
  const { data: categories = [] } = useCategories();
  const [selectedImage, setSelectedImage] = useState(0);

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
                Home
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
                  {category ? category.name : 'Products'}
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
                {category?.name || 'Product'}
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
                <span className="ml-2 text-gray-600">4.5 (128 reviews)</span>
              </div>
              
              <div className="mt-6">
                <h2 className="text-lg font-medium text-gray-900">Description</h2>
                <p className="mt-2 text-gray-600">
                  {product.description}
                </p>
              </div>
              
              <div className="mt-6">
                <h2 className="text-lg font-medium text-gray-900">Features</h2>
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
                <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <>
                    <span className="ml-3 text-lg text-gray-500 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                    <span className="ml-3 px-2 py-1 text-xs font-semibold text-white bg-green-500 rounded">
                      Save {Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </span>
                  </>
                )}
              </div>
              
              <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button className="flex-1 bg-primary hover:bg-blue-600 text-white font-medium py-3 px-6 flex items-center justify-center">
                  <ShoppingCart className="mr-2" size={18} />
                  Add to Cart
                </Button>
                <Button variant="outline" className="flex-1 bg-white hover:bg-gray-100 text-gray-800 font-medium py-3 px-6 border border-gray-300 flex items-center justify-center">
                  <Heart className="mr-2" size={18} />
                  Add to Wishlist
                </Button>
              </div>
              
              {/* Social Sharing */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h2 className="text-sm font-medium text-gray-900">Share this product</h2>
                <div className="mt-2 flex space-x-4">
                  <button className="text-gray-500 hover:text-primary" aria-label="Share on Facebook">
                    <Facebook size={18} />
                  </button>
                  <button className="text-gray-500 hover:text-primary" aria-label="Share on Twitter">
                    <Twitter size={18} />
                  </button>
                  <button className="text-gray-500 hover:text-primary" aria-label="Share on Instagram">
                    <Instagram size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
