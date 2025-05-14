import React from 'react';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  variant?: 'button' | 'select' | 'minimal';
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  variant = 'select',
  className = ''
}) => {
  const { t } = useTranslation('common');
  const language = i18n.language as 'fr' | 'ar';
  const isRTL = language === 'ar';
  
  const setLanguage = (lang: 'fr' | 'ar') => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    if (lang === 'ar') {
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.classList.remove('rtl');
    }
  };
  
  // Pour l'affichage des noms des langues
  const languageNames = {
    fr: t('languages.french'),
    ar: t('languages.arabic')
  };
  
  // Pour l'affichage dans la version minimale
  const languageCodes: Record<string, string> = {
    fr: 'FR',
    ar: 'ع'
  };
  
  const handleLanguageChange = (value: string) => {
    if (value === 'fr' || value === 'ar') {
      setLanguage(value);
    }
  };
  
  // Rendu en fonction du variant
  if (variant === 'button') {
    return (
      <div className={`flex gap-2 ${className}`}>
        <Button
          variant={language === 'fr' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setLanguage('fr')}
          className={language === 'fr' ? 'bg-yellow-500 text-black' : ''}
        >
          FR
        </Button>
        <Button
          variant={language === 'ar' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setLanguage('ar')}
          className={language === 'ar' ? 'bg-yellow-500 text-black' : ''}
        >
          ع
        </Button>
      </div>
    );
  }
  
  if (variant === 'minimal') {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')}
        className={`flex items-center gap-1 ${className}`}
      >
        <Globe className="h-4 w-4" />
        <span>{languageCodes[language]}</span>
      </Button>
    );
  }
  
  // Rendu par défaut (select)
  return (
    <div className={`relative ${className}`}>
      <Select value={language} onValueChange={handleLanguageChange}>
        <SelectTrigger className={`w-[130px] ${isRTL ? 'text-right' : 'text-left'}`}>
          <Globe className="h-4 w-4 mr-2" />
          <SelectValue placeholder={t('languages.switchLanguage')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="fr">{languageNames.fr}</SelectItem>
          <SelectItem value="ar">{languageNames.ar}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSwitcher;