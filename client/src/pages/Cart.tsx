import { Helmet } from 'react-helmet';
import { Link, useLocation } from 'wouter';
import { Trash2, ShoppingCart, ChevronLeft, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';
import { getImageUrl } from '@/lib/utils';
import MotorcycleIcon from '@/components/ui/motorcycle-icon';

const Cart = () => {
  const { state, removeItem, updateQuantity } = useCart();
  const [, setLocation] = useLocation();

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    setLocation('/checkout');
  };

  return (
    <>
      <Helmet>
        <title>Shopping Cart - Rammeh MotoScoot</title>
        <meta name="description" content="View the items in your shopping cart and proceed to checkout." />
      </Helmet>

      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <ShoppingCart size={28} className="text-yellow-500 mr-2" />
            <h1 className="text-3xl font-bold">Your Shopping Cart</h1>
          </div>

          {state.items.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="flex justify-center mb-4">
                <MotorcycleIcon size={64} className="text-gray-300" />
              </div>
              <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">
                Looks like you haven't added any products to your cart yet.
              </p>
              <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-black">
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-4 border-b">
                    <h2 className="text-xl font-semibold">Cart Items ({state.items.length})</h2>
                  </div>
                  
                  <ul className="divide-y divide-gray-200">
                    {state.items.map((item) => (
                      <li key={item.product.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center">
                        <div className="w-full sm:w-24 h-24 flex-shrink-0 mb-4 sm:mb-0">
                          <img
                            src={getImageUrl(item.product.mainImage)}
                            alt={item.product.name}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        
                        <div className="flex-1 ml-0 sm:ml-4">
                          <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                          <p className="text-sm text-gray-500 mb-2">
                            {item.product.categoryId === 1 ? 'Motorcycles' : 
                             item.product.categoryId === 2 ? 'Accessories' : 
                             item.product.categoryId === 3 ? 'Gear' : 'Parts'}
                          </p>
                          <span className="text-yellow-500 font-medium">
                            {formatPrice(item.product.price)}
                          </span>
                        </div>
                        
                        <div className="flex items-center mt-4 sm:mt-0">
                          <div className="flex items-center border border-gray-300 rounded">
                            <button
                              onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                              className="p-2 bg-gray-100 hover:bg-gray-200 border-r border-gray-300"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-12 text-center py-2">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                              className="p-2 bg-gray-100 hover:bg-gray-200 border-l border-gray-300"
                              aria-label="Increase quantity"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="ml-4 text-red-500 hover:text-red-700"
                            aria-label="Remove item"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="p-4 border-t">
                    <Link href="/products" className="flex items-center text-blue-600 hover:text-blue-800">
                      <ChevronLeft size={16} className="mr-1" />
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">{formatPrice(state.total)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">Calculated at checkout</span>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Total</span>
                        <span className="text-xl font-bold text-yellow-500">{formatPrice(state.total)}</span>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleCheckout} 
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3"
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Cart;