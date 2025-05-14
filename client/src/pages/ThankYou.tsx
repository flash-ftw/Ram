import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { CheckCircle, Home, ShoppingCart, MessageCircle, Phone as LucidePhone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/utils";
import MotorcycleIcon from "@/components/ui/motorcycle-icon";
import { useTranslation } from "react-i18next";

const ThankYou = () => {
  const [, setLocation] = useLocation();
  const { clearCart } = useCart();
  const { t } = useTranslation();
  
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
        <title>{t('thankYou.title')} | Rammeh MotoScoot</title>
        <meta name="description" content={t('thankYou.subtitle')} />
      </Helmet>
      
      <div className="text-center mb-8">
        <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">{t('thankYou.title')}</h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          {t('thankYou.subtitle')}
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
                <h2 className="text-xl font-semibold mb-4">{t('thankYou.orderSummary')}</h2>
                {checkoutData.orderId && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <span className="font-medium text-yellow-800">{t('thankYou.orderId')} : </span>
                    <span className="font-mono">{checkoutData.orderId}</span>
                  </div>
                )}
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
                  <span className="font-bold">{t('thankYou.total')}</span>
                  <span className="font-bold text-yellow-500">
                    {formatPrice(checkoutData.totalAmount)}
                  </span>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4">{t('thankYou.customerInfo')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{t('checkout.form.name')}</h3>
                    <p>{checkoutData.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{t('checkout.form.email')}</h3>
                    <p>{checkoutData.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{t('checkout.form.phone')}</h3>
                    <p>{checkoutData.phone}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{t('checkout.form.location')}</h3>
                    <p>{checkoutData.location}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4">{t('thankYou.whatsNext')}</h2>
                <ol className="list-decimal list-inside space-y-2 text-gray-600">
                  <li>{t('thankYou.step1')}</li>
                  <li>{t('thankYou.step2')}</li>
                  <li>{t('thankYou.step3')}</li>
                  <li>{t('thankYou.step4')}</li>
                </ol>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">{t('checkout.emptyCart')}</p>
              <Button 
                onClick={() => setLocation('/products')}
                className="bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                {t('checkout.browseProducts')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <div className="text-center mb-2">
          <Button 
            onClick={() => window.open('https://wa.me/21658274563', '_blank')}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 mx-auto"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{t('thankYou.contactWhatsApp')}</span>
          </Button>
          <p className="text-sm text-gray-500 mt-2">{t('thankYou.contactPhone')} +216 58 274 563</p>
        </div>
      
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => setLocation('/')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            <span>{t('thankYou.backToHome')}</span>
          </Button>
          
          <Button 
            onClick={() => setLocation('/products')}
            className="bg-yellow-500 hover:bg-yellow-600 text-black flex items-center gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>{t('thankYou.continueShopping')}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;