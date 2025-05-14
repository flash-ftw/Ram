import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import des fichiers de traduction
import frCommon from './locales/fr/common.json';
import arCommon from './locales/ar/common.json';

// Type pour les langues supportées
export type Language = 'fr' | 'ar';

// Configuration de i18next
if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        fr: { common: frCommon },
        ar: { common: arCommon }
      },
      lng: 'fr',
      fallbackLng: 'fr',
      ns: ['common'],
      defaultNS: 'common',
      interpolation: { escapeValue: false },
      react: { useSuspense: false }
    });

  // Appliquer la direction RTL/LTR
  const language = i18n.language as Language;
  const isRTL = language === 'ar';
  
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  document.documentElement.lang = language;
  
  if (isRTL) {
    document.documentElement.classList.add('rtl');
  } else {
    document.documentElement.classList.remove('rtl');
  }
  
  // Écouter les changements de langue
  i18n.on('languageChanged', (lang) => {
    const isRTL = lang === 'ar';
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    if (isRTL) {
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.classList.remove('rtl');
    }
    
    localStorage.setItem('language', lang);
  });
  
  // Récupérer la langue du localStorage
  const savedLanguage = localStorage.getItem('language') as Language;
  if (savedLanguage && (savedLanguage === 'fr' || savedLanguage === 'ar')) {
    i18n.changeLanguage(savedLanguage);
  }
}

export default i18n;