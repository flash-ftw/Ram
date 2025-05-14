import { Helmet } from 'react-helmet';
import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Categories from "@/components/home/Categories";
import AboutSection from "@/components/home/AboutSection";
import ContactForm from "@/components/contact/ContactForm";
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';

const Home = () => {
  const { t } = useTranslation('common');
  const language = i18n.language;
  
  return (
    <>
      <Helmet>
        <title>{t('seo.home.title')}</title>
        <meta name="description" content={t('seo.home.description')} />
        <meta property="og:title" content={t('seo.home.title')} />
        <meta property="og:description" content={t('seo.home.description')} />
        <meta property="og:type" content="website" />
        <html lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'} />
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
