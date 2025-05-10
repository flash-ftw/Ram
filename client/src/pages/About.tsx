import { Helmet } from 'react-helmet';
import AboutSection from "@/components/home/AboutSection";

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us - Rammeh MotoScoot</title>
        <meta name="description" content="Learn about Rammeh MotoScoot, Tunisia's premier motorcycle showroom, our passion for motorcycles, and our commitment to exceptional service since 2015." />
        <meta property="og:title" content="About Us - Rammeh MotoScoot" />
        <meta property="og:description" content="Learn about Rammeh MotoScoot, Tunisia's premier motorcycle showroom, our passion for motorcycles, and our commitment to exceptional service since 2015." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <div className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-2 moto-heading inline-block after:bottom-[-10px] after:w-24 after:left-1/2 after:-translate-x-1/2">About Rammeh MotoScoot</h1>
        </div>
      </div>
      
      <AboutSection />
      
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center moto-heading inline-block after:bottom-[-10px] after:w-24 after:left-1/2 after:-translate-x-1/2">Our Motorcycle Journey</h2>
            <div className="prose prose-lg prose-invert mx-auto text-gray-300">
              <p>
                Rammeh MotoScoot was born in 2015 out of pure passion for motorcycles and the open road. What started as a small workshop run by motorcycle enthusiasts has grown into one of Tunisia's premier destinations for motorcycles, parts, accessories, and expert service.
              </p>
              <p>
                Our team consists of certified technicians, experienced riders, and motorcycle aficionados who live and breathe the culture. We carefully select each motorcycle and accessory in our inventory based on performance, reliability, and value - because we would never sell something we wouldn't ride ourselves.
              </p>
              <p>
                At Rammeh MotoScoot, we've built our reputation on exceptional service. Whether you're a seasoned rider looking for your next high-performance machine, a novice purchasing your first bike, or someone seeking expert maintenance, our team provides personalized attention and expert advice.
              </p>
              <p>
                We're proud to represent some of the world's finest motorcycle brands while supporting Tunisia's growing community of riders. Our state-of-the-art showroom in Tunis showcases the latest models, while our service department ensures your bike performs at its absolute best.
              </p>
              <p>
                Visit us today and discover why thousands of riders throughout Tunisia trust Rammeh MotoScoot for all their motorcycling needs.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
