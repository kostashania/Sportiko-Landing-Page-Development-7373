import React, { useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../hooks/useSettings';

const Footer = () => {
  const { t, currentLanguage } = useLanguage();
  const { settings, loadSettings } = useSettings();

  useEffect(() => {
    console.log('Footer: Loading settings...');
    loadSettings();
  }, [loadSettings]);

  // Get footer text from settings or fallback to translation
  const getFooterText = () => {
    if (settings?.content?.footer_text) {
      console.log('Footer: Using footer text from settings:', settings.content.footer_text);
      return settings.content.footer_text;
    }
    
    const fallbackText = t('footer.text');
    console.log('Footer: Using fallback text:', fallbackText);
    return fallbackText;
  };

  return (
    <footer className="bg-gray-800 text-white py-8 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-lg font-semibold mb-2">Sportiko.eu</p>
        <p className="text-gray-400">
          {getFooterText()}
        </p>
      </div>
    </footer>
  );
};

export default Footer;