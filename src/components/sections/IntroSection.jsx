import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../hooks/useSettings';

const IntroSection = () => {
  const { t, currentLanguage } = useLanguage();
  const { settings, loadSettings } = useSettings();

  useEffect(() => {
    console.log('IntroSection: Loading settings...');
    loadSettings();
  }, [loadSettings]);

  // Get intro text from settings or fallback to translation
  const getIntroText = () => {
    if (settings?.content?.intro_text) {
      console.log('IntroSection: Using intro text from settings:', settings.content.intro_text);
      return settings.content.intro_text;
    }
    
    const fallbackText = t('intro.text');
    console.log('IntroSection: Using fallback text:', fallbackText);
    return fallbackText;
  };

  const getIntroTitle = () => {
    if (settings?.content?.intro_title) {
      return settings.content.intro_title;
    }
    return t('intro.title');
  };

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            {getIntroTitle()}
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            {getIntroText()}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default IntroSection;