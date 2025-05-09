import { Helmet } from 'react-helmet';
import ContactForm from "@/components/contact/ContactForm";

const Contact = () => {
  return (
    <>
      <Helmet>
        <title>Contact Us - ModernShowroom</title>
        <meta name="description" content="Get in touch with our team for product inquiries, customer support, or any questions about our premium furniture, lighting, electronics, and decor." />
        <meta property="og:title" content="Contact Us - ModernShowroom" />
        <meta property="og:description" content="Get in touch with our team for product inquiries, customer support, or any questions about our premium products." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <div className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
        </div>
      </div>
      
      <ContactForm />
      
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Visit Our Showroom</h2>
                <p className="text-gray-600 mb-4">
                  Experience our products in person at our flagship showroom. Our knowledgeable staff is ready to assist you with product information and design advice.
                </p>
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Opening Hours:</h3>
                  <p className="text-gray-600">
                    Monday - Friday: 9AM - 6PM<br />
                    Saturday - Sunday: 10AM - 4PM
                  </p>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Customer Support</h2>
                <p className="text-gray-600 mb-4">
                  Have questions about an order or need product support? Our customer service team is here to help.
                </p>
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Contact Information:</h3>
                  <p className="text-gray-600">
                    Phone: (123) 456-7890<br />
                    Email: info@modernshowroom.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
