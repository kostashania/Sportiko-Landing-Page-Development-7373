import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const IntroSection = () => {
  const { t } = useLanguage();
  
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
            {t('intro.title')}
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            {t('intro.text')}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default IntroSection;