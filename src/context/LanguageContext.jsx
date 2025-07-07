import React, { createContext, useState, useContext, useEffect } from 'react';
import { useSettings } from '../hooks/useSettings';

// Define available languages
export const languages = {
  el: { code: 'el', name: 'Ελληνικά', flag: '🇬🇷' },
  en: { code: 'en', name: 'English', flag: '🇬🇧' }
};

// Create context
const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const { settings } = useSettings();
  const [currentLanguage, setCurrentLanguage] = useState(languages.el);
  const [translations, setTranslations] = useState({});
  
  // Initialize translations from settings on mount
  useEffect(() => {
    if (settings?.translations) {
      setTranslations(settings.translations);
    }
  }, [settings]);

  // Load language preference from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && languages[savedLanguage]) {
      setCurrentLanguage(languages[savedLanguage]);
    }
  }, []);

  // Change language function
  const changeLanguage = (langCode) => {
    if (languages[langCode]) {
      setCurrentLanguage(languages[langCode]);
      localStorage.setItem('language', langCode);
    }
  };

  // Get translated text with fallback
  const t = (key) => {
    if (!translations || !currentLanguage) return key;
    
    const langTranslations = translations[currentLanguage.code] || {};
    return langTranslations[key] || translations.el[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ 
      currentLanguage, 
      languages, 
      changeLanguage, 
      translations, 
      setTranslations, 
      t 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for using the language context
export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext;