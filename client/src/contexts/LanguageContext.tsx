import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import des fichiers de traduction
import frCommon from '../locales/fr/common.json';
import arCommon from '../locales/ar/common.json';

// Type pour les langues supportées
export type Language = 'fr' | 'ar';

// Configuration initiale de i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: {
        common: frCommon
      },
      ar: {
        common: arCommon
      }
    },
    lng: 'fr', // Langue par défaut
    fallbackLng: 'fr',
    ns: ['common'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false // Pas besoin d'échapper pour React
    },
    react: {
      useSuspense: false
    }
  });

// Interface du contexte
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
}

// Création du contexte
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Props du provider
interface LanguageProviderProps {
  children: ReactNode;
}

// Provider du contexte
export function LanguageProvider({ children }: LanguageProviderProps) {
  // État pour la langue actuelle
  const [language, setLanguageState] = useState<Language>('fr');
  
  // Déterminer si la langue est RTL (Right-to-Left)
  const isRTL = language === 'ar';
  
  // Effet pour appliquer la direction du texte au document HTML
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // Appliquer une classe pour les styles RTL
    if (isRTL) {
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.classList.remove('rtl');
    }
  }, [isRTL, language]);
  
  // Fonction pour changer la langue
  const setLanguage = (lang: Language) => {
    i18n.changeLanguage(lang);
    setLanguageState(lang);
    // Stocker la préférence de langue dans localStorage
    localStorage.setItem('language', lang);
  };
  
  // Effet pour récupérer la langue depuis localStorage au chargement
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'fr' || savedLanguage === 'ar')) {
      setLanguage(savedLanguage);
    }
  }, []);
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook pour utiliser le contexte dans les composants
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}