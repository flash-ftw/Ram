import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import des fichiers de traduction
import frCommon from '../locales/fr/common.json';
import arCommon from '../locales/ar/common.json';

// Type pour les langues supportées
export type Language = 'fr' | 'ar';

// Configuration initiale de i18next
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
}

// Interface du contexte
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
}

// Définir le contexte
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provider Component
const LanguageProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('fr');
  const isRTL = language === 'ar';
  
  // Appliquer la direction du texte
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    if (isRTL) {
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.classList.remove('rtl');
    }
  }, [isRTL, language]);
  
  // Changer la langue
  const setLanguage = (lang: Language) => {
    i18n.changeLanguage(lang);
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };
  
  // Récupérer la langue du localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'fr' || savedLanguage === 'ar')) {
      setLanguage(savedLanguage);
    }
  }, []);
  
  const value = {
    language,
    setLanguage,
    isRTL
  };
  
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage doit être utilisé à l\'intérieur d\'un LanguageProvider');
  }
  return context;
};

// Exporter les composants et hooks
export { LanguageProvider, useLanguage };
