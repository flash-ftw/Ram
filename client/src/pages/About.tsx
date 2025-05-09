import { Helmet } from 'react-helmet';
import AboutSection from "@/components/home/AboutSection";

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us - ModernShowroom</title>
        <meta name="description" content="Learn about ModernShowroom, our mission, and our commitment to providing exceptional products for modern living since 2010." />
        <meta property="og:title" content="About Us - ModernShowroom" />
        <meta property="og:description" content="Learn about ModernShowroom, our mission, and our commitment to providing exceptional products for modern living since 2010." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <div className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8">About Us</h1>
        </div>
      </div>
      
      <AboutSection />
      
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
            <div className="prose prose-lg mx-auto">
              <p>
                ModernShowroom was founded in 2010 with a simple mission: to provide exceptional products
                that combine style, functionality, and craftsmanship at accessible prices. What began as
                a small collection of handpicked furniture has since expanded into a comprehensive offering
                of home furnishings, electronics, lighting solutions, and decorative pieces.
              </p>
              <p>
                Our team of experienced designers and product specialists travels the world to discover
                and collaborate with talented artisans, innovative manufacturers, and emerging designers.
                We're committed to ethical sourcing practices and work only with partners who share our
                values of quality, sustainability, and fair labor practices.
              </p>
              <p>
                As we've grown, we've remained true to our original vision: creating spaces that inspire.
                Whether you're furnishing your first apartment, redesigning your family home, or outfitting
                a professional space, we offer thoughtfully designed products that elevate everyday living.
              </p>
              <p>
                We invite you to explore our collections, visit our showrooms, and experience the
                ModernShowroom difference for yourself.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
