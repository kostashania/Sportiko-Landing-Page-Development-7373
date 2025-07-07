import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSwitcher from '../common/LanguageSwitcher';

const { FiArrowRight, FiPlay, FiSettings } = FiIcons;

const HeroSection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
      <div className="absolute top-4 right-4 flex gap-2">
        <LanguageSwitcher compact={true} />
        <a href="#/admin" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
          <SafeIcon icon={FiSettings} className="w-4 h-4" />
          Admin
        </a>
      </div>
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
            {t('hero.subtitle')}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a
            href="https://spiffy-nougat-80a628.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            {t('hero.cta.primary')}
            <SafeIcon icon={FiArrowRight} className="w-5 h-5" />
          </a>
          <button className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
            {t('hero.cta.secondary')}
            <SafeIcon icon={FiPlay} className="w-5 h-5" />
          </button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto">
            <img
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Sportiko Platform Preview"
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;