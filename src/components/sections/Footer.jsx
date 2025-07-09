import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../hooks/useSettings';

const Footer = () => {
  const { currentLanguage } = useLanguage();
  const { settings, loading } = useSettings();

  // Get footer text from settings
  const getFooterText = () => {
    if (!loading && settings?.content?.footer_text) {
      return settings.content.footer_text;
    }
    
    // Fallback text based on language
    return currentLanguage.code === 'el' 
      ? '© 2024 Sportiko. Όλα τα δικαιώματα κατοχυρωμένα.'
      : '© 2024 Sportiko. All rights reserved.';
  };

  // Get site name from settings
  const getSiteName = () => {
    if (!loading && settings?.general?.site_name) {
      return settings.general.site_name;
    }
    return 'Sportiko.eu';
  };

  if (loading) {
    return (
      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-600 rounded mb-2 max-w-32 mx-auto"></div>
            <div className="h-4 bg-gray-600 rounded max-w-64 mx-auto"></div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gray-800 text-white py-8 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-lg font-semibold mb-2">{getSiteName()}</p>
        <p className="text-gray-400">
          {getFooterText()}
        </p>
      </div>
    </footer>
  );
};

export default Footer;