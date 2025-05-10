import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { CheckCircle, Home, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/utils";
import MotorcycleIcon from "@/components/ui/motorcycle-icon";

const ThankYou = () => {
  const [, setLocation] = useLocation();
  const { clearCart } = useCart();
  
  // Get checkout data from localStorage
  const checkoutData = JSON.parse(localStorage.getItem("checkout_data") || "{}");
  
  // Clear cart on component mount
  useEffect(() => {
    // Small delay to ensure any pending operations complete
    const timer = setTimeout(() => {
      clearCart();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [clearCart]);
  
  // Check if we have order data
  const hasOrderData = Object.keys(checkoutData).length > 0;
  
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <Helmet>
        <title>Order Confirmed | Rammeh MotoScoot</title>
        <meta name="description" content="Thank you for your order with Rammeh MotoScoot!" />
      </Helmet>
      
      <div className="text-center mb-8">
        <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Thank You for Your Order!</h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          We've received your order and will process it as soon as we confirm your payment.
        </p>
      </div>
      
      <Card className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <CardContent className="p-8">
          <div className="flex items-center justify-center mb-6">
            <MotorcycleIcon size={64} className="text-yellow-500 animate-bounce" />
          </div>
          
          {hasOrderData ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="border-t border-b border-gray-200 py-4 space-y-3">
                  {checkoutData.cartItems?.map((item: any) => (
                    <div key={item.product.id} className="flex justify-between">
                      <span className="text-gray-600">
                        {item.product.name} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between py-4">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-yellow-500">
                    {formatPrice(checkoutData.totalAmount)}
                  </span>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Name</h3>
                    <p>{checkoutData.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p>{checkoutData.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                    <p>{checkoutData.phone}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Delivery Location</h3>
                    <p>{checkoutData.location}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4">What Happens Next?</h2>
                <ol className="list-decimal list-inside space-y-2 text-gray-600">
                  <li>We'll verify your payment and confirm your order.</li>
                  <li>Our team will prepare your items for delivery or pickup.</li>
                  <li>We'll contact you via WhatsApp or phone to arrange delivery.</li>
                  <li>Your order will be delivered to your specified location.</li>
                </ol>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Order details not found.</p>
              <Button 
                onClick={() => setLocation('/products')}
                className="bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                Browse Products
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          onClick={() => setLocation('/')}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Home className="h-4 w-4" />
          <span>Back to Home</span>
        </Button>
        
        <Button 
          onClick={() => setLocation('/products')}
          className="bg-yellow-500 hover:bg-yellow-600 text-black flex items-center gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          <span>Continue Shopping</span>
        </Button>
      </div>
    </div>
  );
};

export default ThankYou;