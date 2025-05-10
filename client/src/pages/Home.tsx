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
        <title>Rammeh MotoScoot - Motos & Accessoires Premium</title>
        <meta name="description" content="Découvrez notre collection premium de motos, pièces, équipements et accessoires. Votre magasin unique pour tous les passionnés de moto en Tunisie." />
        <meta property="og:title" content="Rammeh MotoScoot - Motos & Accessoires Premium" />
        <meta property="og:description" content="Le principal showroom de motos en Tunisie offrant des motos, pièces, équipements et accessoires de haute qualité avec un excellent service et maintenance." />
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
