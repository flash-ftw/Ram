import { Helmet } from 'react-helmet';
import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Categories from "@/components/home/Categories";
import AboutSection from "@/components/home/AboutSection";
import ContactForm from "@/components/contact/ContactForm";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Rammeh MotoScoot - Premium Motorcycles & Accessories</title>
        <meta name="description" content="Discover our premium collection of motorcycles, parts, gear, and accessories. Your one-stop shop for all motorcycle enthusiasts in Tunisia." />
        <meta property="og:title" content="Rammeh MotoScoot - Premium Motorcycles & Accessories" />
        <meta property="og:description" content="Tunisia's leading motorcycle showroom offering high-quality bikes, parts, gear, and accessories with excellent service and maintenance." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <Hero />
      <FeaturedProducts />
      <Categories />
      <AboutSection />
      <ContactForm />
    </>
  );
};

export default Home;
