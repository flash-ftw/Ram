import { Medal, Users, Globe, Package, Wrench, Settings, Award, Clock } from "lucide-react";
import logoPath from "../../assets/logo.png";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

const AboutSection = () => {
  const { t } = useTranslation('common');
  const isRTL = i18n.language === 'ar';
  
  return (
    <section className="py-20 bg-black text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`lg:flex items-center gap-16 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <div className="relative">
              <div className={`absolute -top-4 ${isRTL ? '-right-4' : '-left-4'} w-full h-full border-2 border-yellow-500 rounded-lg`}></div>
              <div 
                className="rounded-lg shadow-lg w-full h-80 bg-gray-800 relative z-10 flex items-center justify-center"
              >
                <img 
                  src={logoPath} 
                  alt="Rammeh MotoScoot Logo" 
                  className="w-auto max-h-64 object-contain" 
                />
              </div>
              <div className={`absolute -bottom-4 ${isRTL ? '-left-4' : '-right-4'} bg-yellow-500 text-black py-2 px-4 rounded-lg font-bold z-20`}>
                {t('about.since2015')}
              </div>
            </div>
          </div>
          <div className="lg:w-1/2">
            <div className="inline-block mb-6">
              <h2 className={`text-4xl font-bold mb-2 moto-heading ${isRTL ? 'text-right' : ''}`}>{t('about.storyTitle')}</h2>
            </div>
            <p className={`text-gray-300 mb-4 text-lg ${isRTL ? 'text-right' : ''}`}>
              {t('about.paragraph1')}
            </p>
            <p className={`text-gray-300 mb-4 text-lg ${isRTL ? 'text-right' : ''}`}>
              {t('about.paragraph2')}
            </p>
            <p className={`text-gray-300 mb-6 text-lg ${isRTL ? 'text-right' : ''}`}>
              {t('about.paragraph3')}
            </p>
            
            <div className="grid grid-cols-2 gap-8 mt-10">
              <div className="text-center bg-gray-900 p-5 rounded-lg border-l-4 border-yellow-500">
                <div className="text-yellow-500 text-3xl font-bold mb-2 flex justify-center">
                  <Award className={isRTL ? 'ml-2' : 'mr-2'} size={28} />
                  8+
                </div>
                <p className="text-gray-300">{t('about.stats.years')}</p>
              </div>
              <div className="text-center bg-gray-900 p-5 rounded-lg border-l-4 border-yellow-500">
                <div className="text-yellow-500 text-3xl font-bold mb-2 flex justify-center">
                  <Users className={isRTL ? 'ml-2' : 'mr-2'} size={28} />
                  5K+
                </div>
                <p className="text-gray-300">{t('about.stats.riders')}</p>
              </div>
              <div className="text-center bg-gray-900 p-5 rounded-lg border-l-4 border-yellow-500">
                <div className="text-yellow-500 text-3xl font-bold mb-2 flex justify-center">
                  <Wrench className={isRTL ? 'ml-2' : 'mr-2'} size={28} />
                  10K+
                </div>
                <p className="text-gray-300">{t('about.stats.services')}</p>
              </div>
              <div className="text-center bg-gray-900 p-5 rounded-lg border-l-4 border-yellow-500">
                <div className="text-yellow-500 text-3xl font-bold mb-2 flex justify-center">
                  <Settings className={isRTL ? 'ml-2' : 'mr-2'} size={28} />
                  200+
                </div>
                <p className="text-gray-300">{t('about.stats.models')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
