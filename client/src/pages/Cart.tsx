import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { ShoppingCart, X, Trash2, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/utils";
import { getImageUrl } from "@/lib/utils";

const Cart = () => {
  const [, setLocation] = useLocation();
  const { state: cartState, updateQuantity, removeItem, clearCart } = useCart();
  
  // SEO - Update page title
  useEffect(() => {
    document.title = "Your Cart | Rammeh MotoScoot";
  }, []);

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId: number) => {
    removeItem(productId);
  };

  if (cartState.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <Helmet>
          <title>Your Cart | Rammeh MotoScoot</title>
          <meta name="description" content="View your cart and checkout your motorcycle products." />
        </Helmet>
        
        <h1 className="text-3xl font-bold text-center mb-6">Your Cart</h1>
        
        <Card className="bg-white shadow-md rounded-lg p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-4 py-12">
            <ShoppingCart size={64} className="text-gray-300" />
            <h2 className="text-2xl font-semibold text-gray-700">Your cart is empty</h2>
            <p className="text-gray-500 max-w-md">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Button 
              onClick={() => setLocation('/products')}
              className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black"
            >
              Browse Products
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <Helmet>
        <title>Your Cart | Rammeh MotoScoot</title>
        <meta name="description" content="View your cart and checkout your motorcycle products." />
      </Helmet>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Cart</h1>
        <Button 
          variant="ghost" 
          className="text-gray-600 hover:text-gray-900"
          onClick={() => clearCart()}
        >
          Clear Cart
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="bg-white shadow-md rounded-lg">
            <CardContent className="p-0">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-500 tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 tracking-wider">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {cartState.items.map((item) => (
                    <tr key={item.product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                            <img
                              src={getImageUrl(item.product.mainImage)}
                              alt={item.product.name}
                              className="h-full w-full object-cover object-center"
                            />
                          </div>
                          <div className="ml-4">
                            <Link href={`/product/${item.product.slug}`} className="text-sm font-medium text-gray-900 hover:text-yellow-500">
                              {item.product.name}
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                            className="px-2 py-1 border border-gray-300 rounded-l-md text-gray-600 hover:bg-gray-100"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="w-12 px-2 py-1 text-center border-t border-b border-gray-300">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                            className="px-2 py-1 border border-gray-300 rounded-r-md text-gray-600 hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                        {formatPrice(item.product.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {formatPrice(item.product.price * item.quantity)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleRemoveItem(item.product.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="bg-white shadow-md rounded-lg">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(cartState.total)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">To be calculated</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-yellow-500">{formatPrice(cartState.total)}</span>
                </div>
                
                <Button 
                  onClick={() => setLocation('/checkout')}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black mt-4 flex items-center justify-center gap-2 transition-all duration-300 hover:gap-3"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={16} />
                </Button>
                
                <p className="text-xs text-gray-500 text-center mt-2">
                  By proceeding to checkout, you agree to our terms and conditions.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setLocation('/products')}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;