import React, { createContext, useContext, useState } from 'react';
import i18n from '../i18n';

const LanguageContext = createContext();

const languages = [
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' }
];

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'fr');

  const switchLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setCurrentLanguage(lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, languages, switchLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext); 