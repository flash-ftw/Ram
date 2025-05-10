import { Helmet } from 'react-helmet';
import ContactForm from "@/components/contact/ContactForm";

const Contact = () => {
  return (
    <>
      <Helmet>
        <title>Contact Us - Rammeh MotoScoot</title>
        <meta name="description" content="Get in touch with Rammeh MotoScoot for motorcycle inquiries, test rides, maintenance appointments, or any questions about our motorcycles and accessories." />
        <meta property="og:title" content="Contact Us - Rammeh MotoScoot" />
        <meta property="og:description" content="Contact Tunisia's premier motorcycle showroom for sales, service, parts, and accessories. Schedule a test ride or maintenance appointment today." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <div className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-2 moto-heading inline-block after:bottom-[-10px] after:w-24 after:left-1/2 after:-translate-x-1/2">Contact Rammeh MotoScoot</h1>
        </div>
      </div>
      
      <ContactForm />
      
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-gray-900 p-8 rounded-lg border-l-4 border-yellow-500">
                <h2 className="text-2xl font-bold mb-4 text-yellow-500">Visit Our Showroom</h2>
                <p className="text-gray-300 mb-6">
                  Experience our motorcycles in person at our flagship showroom in Tunis. Our expert team of riders and technicians is ready to assist you with finding your perfect bike or servicing your current ride.
                </p>
                <div className="mt-4">
                  <h3 className="font-semibold mb-2 text-white">Opening Hours:</h3>
                  <p className="text-gray-300">
                    Monday - Friday: 9AM - 7PM<br />
                    Saturday: 10AM - 5PM<br />
                    Sunday: By appointment only
                  </p>
                </div>
              </div>
              <div className="bg-gray-900 p-8 rounded-lg border-l-4 border-yellow-500">
                <h2 className="text-2xl font-bold mb-4 text-yellow-500">Rider Support</h2>
                <p className="text-gray-300 mb-6">
                  Need assistance with your motorcycle, parts, or have questions about maintenance? Our dedicated support team is here to help every rider.
                </p>
                <div className="mt-4">
                  <h3 className="font-semibold mb-2 text-white">Contact Information:</h3>
                  <p className="text-gray-300">
                    Phone: +216 71 234 567<br />
                    Email: info@rammehmotoscoot.tn<br />
                    WhatsApp: +216 50 123 456
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
