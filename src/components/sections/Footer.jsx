import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-gray-800 text-white py-8 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-lg font-semibold mb-2">Sportiko.eu</p>
        <p className="text-gray-400">
          {t('footer.text')}
        </p>
      </div>
    </footer>
  );
};

export default Footer;