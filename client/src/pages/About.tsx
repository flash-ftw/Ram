import { Helmet } from 'react-helmet';
import AboutSection from "@/components/home/AboutSection";
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

const About = () => {
  const { t } = useTranslation('common');
  const language = i18n.language;
  const isRTL = language === 'ar';
  
  return (
    <>
      <Helmet>
        <title>{t('about.metaTitle')} - {t('seo.siteName')}</title>
        <meta name="description" content={t('about.metaDescription')} />
        <meta property="og:title" content={`${t('about.metaTitle')} - ${t('seo.siteName')}`} />
        <meta property="og:description" content={t('about.metaDescription')} />
        <meta property="og:type" content="website" />
        <html lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'} />
      </Helmet>
      
      <div className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <h1 className={`text-4xl font-bold text-center mb-2 moto-heading inline-block after:bottom-[-10px] after:w-24 after:left-1/2 after:-translate-x-1/2 ${isRTL ? 'rtl' : ''}`}>{t('about.title')}</h1>
        </div>
      </div>
      
      <AboutSection />
      
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className={`text-3xl font-bold mb-8 text-center moto-heading inline-block after:bottom-[-10px] after:w-24 after:left-1/2 after:-translate-x-1/2 ${isRTL ? 'rtl' : ''}`}>{t('about.adventureTitle')}</h2>
            <div className={`prose prose-lg prose-invert mx-auto text-gray-300 ${isRTL ? 'rtl text-right' : ''}`}>
              <p>{t('about.paragraph1')}</p>
              <p>{t('about.paragraph2')}</p>
              <p>{t('about.paragraph3')}</p>
              <p>{t('about.paragraph4')}</p>
              <p>{t('about.paragraph5')}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
