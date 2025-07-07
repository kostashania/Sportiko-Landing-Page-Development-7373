import React from 'react';
import { useLanguage, languages } from '../../context/LanguageContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiGlobe } = FiIcons;

const LanguageSwitcher = ({ className = '', compact = false }) => {
  const { currentLanguage, changeLanguage } = useLanguage();

  return (
    <div className={`relative ${className}`}>
      {compact ? (
        <button 
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => changeLanguage(currentLanguage.code === 'el' ? 'en' : 'el')}
        >
          <span>{currentLanguage.flag}</span>
          <SafeIcon icon={FiGlobe} className="w-4 h-4" />
        </button>
      ) : (
        <div className="flex gap-2">
          {Object.values(languages).map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                currentLanguage.code === lang.code 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-gray-100'
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;