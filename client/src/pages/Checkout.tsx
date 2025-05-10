import { Helmet } from 'react-helmet';
import { useState } from 'react';
import { useLocation } from 'wouter';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreditCard, ChevronsRight, ShoppingBag, Check, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';
import MotorcycleIcon from '@/components/ui/motorcycle-icon';

// Form schema for checkout
const checkoutSchema = z.object({
  fullName: z.string().min(3, { message: 'Please enter your full name' }),
  email: z.string().email({ message: 'Please enter a valid email' }),
  phone: z.string().min(8, { message: 'Please enter a valid phone number' }),
  address: z.string().min(5, { message: 'Please enter your delivery address' }),
  notes: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const Checkout = () => {
  const { state, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<'form' | 'confirmation'>('form');
  const [formData, setFormData] = useState<CheckoutFormValues | null>(null);

  // Initialize form
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      notes: '',
    },
  });

  const onSubmit = (data: CheckoutFormValues) => {
    setFormData(data);
    setStep('confirmation');
  };

  const handleFinishOrder = () => {
    clearCart();
    setLocation('/thank-you');
  };

  // Helper function to open WhatsApp
  const openWhatsApp = () => {
    // Format items list for WhatsApp message
    const itemsList = state.items
      .map(item => `${item.product.name} x${item.quantity}`)
      .join('\\n');
    
    const customerInfo = `
Name: ${formData?.fullName}
Email: ${formData?.email}
Phone: ${formData?.phone}
Address: ${formData?.address}
`;

    const message = `*New Order from Rammeh MotoScoot Website*\\n\\n*Customer Details:*\\n${customerInfo}\\n*Order Items:*\\n${itemsList}\\n\\n*Total:* ${formatPrice(state.total)}\\n\\nI have made a payment and attached the receipt.`;
    
    // Open WhatsApp with pre-filled message
    window.open(`https://wa.me/+21600000000?text=${encodeURIComponent(message)}`, '_blank');
  };

  // If cart is empty, redirect to cart page
  if (state.items.length === 0 && step === 'form') {
    setLocation('/cart');
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Checkout - Rammeh MotoScoot</title>
        <meta name="description" content="Complete your purchase and arrange delivery of your motorcycle products." />
      </Helmet>

      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            {step === 'form' ? (
              <>
                <ShoppingBag size={28} className="text-yellow-500 mr-2" />
                <h1 className="text-3xl font-bold">Checkout</h1>
              </>
            ) : (
              <>
                <CreditCard size={28} className="text-yellow-500 mr-2" />
                <h1 className="text-3xl font-bold">Payment Information</h1>
              </>
            )}
          </div>

          {step === 'form' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your full name" {...field} />
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
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="your@email.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your phone number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Delivery Address</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Enter your full address" 
                                className="min-h-[100px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Additional Notes (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Any special instructions or information we should know" 
                                className="min-h-[100px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3"
                      >
                        Continue to Payment <ChevronsRight className="ml-1" size={16} />
                      </Button>
                    </form>
                  </Form>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                  
                  <div className="divide-y divide-gray-200">
                    {state.items.map((item) => (
                      <div key={item.product.id} className="py-3 flex justify-between">
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium text-yellow-600">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-gray-200 mt-4 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-xl font-bold text-yellow-500">{formatPrice(state.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 max-w-3xl mx-auto">
              <div className="flex justify-center mb-6">
                <MotorcycleIcon size={64} className="text-yellow-500" />
              </div>
              
              <h2 className="text-2xl font-bold text-center mb-6">Make Your Payment</h2>
              
              <div className="border rounded-lg p-4 mb-6 bg-gray-50">
                <h3 className="text-lg font-semibold mb-2">Order Details</h3>
                <ul className="divide-y divide-gray-200">
                  {state.items.map((item) => (
                    <li key={item.product.id} className="py-2 flex justify-between">
                      <span>{item.product.name} x {item.quantity}</span>
                      <span className="font-medium">{formatPrice(item.product.price * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold text-yellow-500">{formatPrice(state.total)}</span>
                </div>
              </div>
              
              <div className="border rounded-lg p-6 mb-6 bg-yellow-50">
                <h3 className="text-lg font-semibold mb-4 text-center">Bank Transfer Information</h3>
                <div className="space-y-2">
                  <p><strong>Bank Name:</strong> Tunisian National Bank</p>
                  <p><strong>Account Name:</strong> Rammeh MotoScoot</p>
                  <p><strong>Account Number:</strong> 0100 2233 4455 6677</p>
                  <p><strong>IBAN:</strong> TN59 0100 2233 4455 6677 8899</p>
                  <p><strong>Reference:</strong> Order-{new Date().getTime().toString().substring(5)}</p>
                </div>
                <div className="mt-4 p-3 bg-yellow-100 rounded-md text-sm">
                  <p>
                    <strong>Note:</strong> Please make the transfer using the information above and send us the receipt 
                    via WhatsApp for faster processing.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <Button
                  onClick={openWhatsApp}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 font-bold flex items-center justify-center"
                >
                  <Phone className="mr-2" size={20} />
                  Contact via WhatsApp
                </Button>
                
                <Button
                  onClick={handleFinishOrder}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-3 font-bold flex items-center justify-center"
                >
                  <Check className="mr-2" size={20} />
                  Complete Order
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Checkout;