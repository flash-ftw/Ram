import { useState } from "react";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowLeft, CreditCard, LucidePhone, MapPin, Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Form validation schema
const checkoutSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(8, { message: "Please enter a valid phone number." }),
  location: z.string().min(5, { message: "Please provide your full address." }),
  notes: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const Checkout = () => {
  const [, setLocation] = useLocation();
  const { state: cartState } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();
  
  // Initialize form
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      location: "",
      notes: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: CheckoutFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Prepare order data
      const orderData = {
        customerName: data.name,
        customerEmail: data.email,
        customerPhone: data.phone,
        deliveryLocation: data.location,
        notes: data.notes || null,
        totalAmount: cartState.total,
        items: JSON.stringify(cartState.items),
        status: "PENDING",
        paymentMethod: "bank_transfer",
        paymentConfirmed: false
      };
      
      // Submit the order to the API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create order');
      }
      
      const orderResponse = await response.json();
      
      // Store order data in localStorage for ThankYou page
      localStorage.setItem("checkout_data", JSON.stringify({
        ...data,
        cartItems: cartState.items,
        totalAmount: cartState.total,
        date: new Date().toISOString(),
        orderId: orderResponse.id
      }));
      
      setIsSubmitting(false);
      setShowBankDetails(true);
    } catch (error) {
      console.error('Error creating order:', error);
      setIsSubmitting(false);
      // Could add error state and display a message to the user
      alert('Un problème est survenu lors de la création de votre commande. Veuillez réessayer.');
    }
  };

  // Create a WhatsApp message with order details
  const generateWhatsAppMessage = () => {
    const data = JSON.parse(localStorage.getItem("checkout_data") || "{}");
    const itemsList = cartState.items.map(item => 
      `${item.product.name} x${item.quantity} - ${formatPrice(item.product.price * item.quantity)}`
    ).join("\\n");
    
    const message = `*Nouvelle Commande de Rammeh MotoScoot*\\n\\n` +
      `*ID Commande:* ${data.orderId || 'N/A'}\\n` +
      `*Client:* ${data.name}\\n` +
      `*Téléphone:* ${data.phone}\\n` +
      `*Email:* ${data.email}\\n` +
      `*Adresse:* ${data.location}\\n\\n` +
      `*Articles Commandés:*\\n${itemsList}\\n\\n` +
      `*Montant Total:* ${formatPrice(cartState.total)}\\n\\n` +
      `J'ai effectué le virement bancaire et je vous joins le reçu.`;
    
    return encodeURIComponent(message);
  };

  // Redirect if cart is empty
  if (cartState.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center">
          <p className="mb-6">{t('checkout.emptyCart')}</p>
          <Button onClick={() => setLocation('/products')} className="bg-yellow-500 hover:bg-yellow-600 text-black">
            {t('checkout.browseProducts')}
          </Button>
        </div>
      </div>
    );
  }

  // Display bank details after form submission
  if (showBankDetails) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Helmet>
          <title>{t('checkout.bankTransferDetails')} | Rammeh MotoScoot</title>
          <meta name="description" content={t('checkout.subtitle')} />
        </Helmet>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('checkout.bankTransferDetails')}</h1>
          <p className="text-gray-600">{t('checkout.bankTransferInfo')}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-white shadow-md rounded-lg overflow-hidden">
            <CardHeader className="bg-yellow-500 text-black">
              <CardTitle className="text-xl">{t('checkout.bankTransferDetails')}</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-4">
                <li className="flex justify-between">
                  <span className="font-medium">{t('checkout.bankInfo.bankName')} :</span>
                  <span>Banque Nationale</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium">{t('checkout.bankInfo.accountName')} :</span>
                  <span>Rammeh MotoScoot</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium">{t('checkout.bankInfo.accountNumber')} :</span>
                  <span className="font-mono">0182739465010</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium">{t('checkout.bankInfo.iban')} :</span>
                  <span className="font-mono">TN59 1273 9465 0100 8271 0429</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium">{t('checkout.bankInfo.amount')} :</span>
                  <span className="font-bold text-yellow-500">{formatPrice(cartState.total)}</span>
                </li>
              </ul>
              
              <Alert className="mt-6 border-yellow-500">
                <CreditCard className="h-4 w-4 text-yellow-500" />
                <AlertTitle>{t('checkout.paymentInstructions.title')}</AlertTitle>
                <AlertDescription>
                  {t('checkout.paymentInstructions.description')}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
          
          <div className="flex flex-col space-y-6">
            <Card className="bg-white shadow-md rounded-lg overflow-hidden">
              <CardHeader className="bg-yellow-500 text-black">
                <CardTitle className="text-xl">{t('checkout.nextSteps.title')}</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ol className="list-decimal list-inside space-y-4 mb-6">
                  <li>{t('checkout.nextSteps.step1')}</li>
                  <li>{t('checkout.nextSteps.step2')}</li>
                  <li>{t('checkout.nextSteps.step3')}</li>
                  <li>{t('checkout.nextSteps.step4')}</li>
                </ol>
                
                <Button
                  onClick={() => {
                    // Tunisian phone number format: +216 XX XXX XXX
                    window.open(`https://wa.me/21658274563?text=${generateWhatsAppMessage()}`, '_blank');
                    // Navigate to thank you page after a short delay
                    setTimeout(() => {
                      setLocation('/thank-you');
                    }, 500);
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
                >
                  <LucidePhone className="h-4 w-4" />
                  <span>{t('checkout.contactWhatsapp')}</span>
                </Button>
              </CardContent>
            </Card>
            
            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={() => setShowBankDetails(false)}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>{t('checkout.backToForm')}</span>
              </Button>
              
              <Button
                onClick={() => setLocation('/thank-you')}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" />
                <span>{t('checkout.finalizeOrder')}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Display checkout form
  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <Helmet>
        <title>{t('checkout.title')} | Rammeh MotoScoot</title>
        <meta name="description" content={t('checkout.subtitle')} />
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('checkout.title')}</h1>
        <p className="text-gray-600">{t('checkout.subtitle')}</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="bg-white shadow-md rounded-lg overflow-hidden">
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('checkout.formLabels.fullName')}</FormLabel>
                          <FormControl>
                            <Input placeholder={t('checkout.formLabels.fullNamePlaceholder')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('checkout.formLabels.email')}</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder={t('checkout.formLabels.emailPlaceholder')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('checkout.formLabels.phone')}</FormLabel>
                          <FormControl>
                            <Input placeholder={t('checkout.formLabels.phonePlaceholder')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('checkout.formLabels.address')}</FormLabel>
                          <FormControl>
                            <Input placeholder={t('checkout.formLabels.addressPlaceholder')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('checkout.formLabels.notes')}</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder={t('checkout.formLabels.notesPlaceholder')}
                            className="h-24 resize-none"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setLocation('/cart')}
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>{t('checkout.backToCart')}</span>
                    </Button>
                    
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black flex items-center gap-2"
                    >
                      <span>{t('checkout.continueToPayment')}</span>
                      {isSubmitting ? (
                        <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <MapPin className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="bg-white shadow-md rounded-lg overflow-hidden">
            <CardHeader className="bg-yellow-500/10">
              <CardTitle className="text-xl">{t('checkout.orderSummary.title')}</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {cartState.items.map((item) => (
                  <div key={item.product.id} className="flex justify-between">
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.quantity} × {formatPrice(item.product.price)}
                      </p>
                    </div>
                    <p className="font-medium">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
                
                <Separator />
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('checkout.orderSummary.subtotal')}</span>
                  <span className="font-medium">{formatPrice(cartState.total)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('checkout.orderSummary.shipping')}</span>
                  <span className="font-medium">{t('checkout.orderSummary.shippingCalculation')}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>{t('checkout.orderSummary.total')}</span>
                  <span className="text-yellow-500">{formatPrice(cartState.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-md rounded-lg overflow-hidden mt-6">
            <CardContent className="p-6">
              <h3 className="font-medium mb-2">{t('checkout.paymentMethod.title')}</h3>
              <p className="text-sm text-gray-600">
                {t('checkout.paymentMethod.description')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;