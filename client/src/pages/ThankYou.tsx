import { Helmet } from 'react-helmet';
import { Link } from 'wouter';
import { CheckCircle, ArrowRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MotorcycleIcon from '@/components/ui/motorcycle-icon';

const ThankYou = () => {
  // Helper function to open WhatsApp
  const openWhatsApp = () => {
    const message = "Hello, I've just completed an order on your website and would like to follow up.";
    window.open(`https://wa.me/+21600000000?text=${encodeURIComponent(message)}`, '_blank');
  };
  
  return (
    <>
      <Helmet>
        <title>Thank You - Rammeh MotoScoot</title>
        <meta name="description" content="Thank you for your order. We appreciate your business." />
      </Helmet>

      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex justify-center mb-6 text-green-500">
              <CheckCircle size={80} className="animate-bounce" />
            </div>
            
            <h1 className="text-3xl font-bold mb-2">Thank You for Your Order!</h1>
            <p className="text-xl text-gray-600 mb-8">Your order has been received</p>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <div className="flex justify-center mb-4">
                <MotorcycleIcon size={48} className="text-yellow-500" />
              </div>
              <p className="text-lg mb-4">
                We're processing your order and will follow up with you shortly.
              </p>
              <p className="text-gray-700 mb-2">
                Remember to send your payment receipt via WhatsApp for faster processing.
              </p>
              <p className="text-gray-700">
                If you have any questions about your order, please don't hesitate to contact us.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
              <Button
                onClick={openWhatsApp}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-md flex items-center justify-center"
              >
                <Phone className="mr-2" size={20} />
                Contact via WhatsApp
              </Button>
              
              <Button asChild variant="outline" className="bg-white hover:bg-gray-100 text-gray-800 font-bold py-3 px-6 border border-gray-300 rounded-md">
                <Link href="/" className="flex items-center">
                  Back to Home
                  <ArrowRight className="ml-2" size={16} />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ThankYou;