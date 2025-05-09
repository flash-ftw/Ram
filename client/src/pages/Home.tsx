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
        <title>ModernShowroom - Premium Products for Your Space</title>
        <meta name="description" content="Discover our curated collection of high-quality furniture, electronics, lighting, and decor that combine style, functionality, and craftsmanship." />
        <meta property="og:title" content="ModernShowroom - Premium Products for Your Space" />
        <meta property="og:description" content="Discover our curated collection of high-quality products that combine style, functionality, and craftsmanship." />
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
