import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../hooks/useSettings';
import LanguageSwitcher from '../common/LanguageSwitcher';

const { FiArrowRight, FiPlay, FiSettings } = FiIcons;

const HeroSection = () => {
  const { t, currentLanguage } = useLanguage();
  const { settings, loading } = useSettings();
  const [heroData, setHeroData] = useState({
    title: 'Η Πλατφόρμα που Εξελίσσει τον Αθλητικό σας Σύλλογο',
    subtitle: 'Οργανώστε τα οικονομικά και τις ακαδημίες σας με εύχρηστες εφαρμογές που λειτουργούν κάτω από την ενιαία πλατφόρμα του Sportiko.',
    ctaPrimary: 'Ανακαλύψτε τις Εφαρμογές',
    ctaSecondary: 'Επικοινωνία',
    ctaPrimaryUrl: '#features',
    ctaSecondaryUrl: '#contact',
    backgroundImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
    logoUrl: '/logo.svg',
    logoAlt: 'Sportiko Logo'
  });

  // Create fallback logo
  const fallbackLogo = "data:image/svg+xml;base64," + btoa(`
    <svg width="200" height="80" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="80" rx="8" fill="#2563eb"/>
      <text x="100" y="35" font-family="Arial,sans-serif" font-size="18" font-weight="bold" fill="white" text-anchor="middle">Sportiko</text>
      <text x="100" y="55" font-family="Arial,sans-serif" font-size="12" fill="#93c5fd" text-anchor="middle">Sports Management</text>
      <circle cx="25" cy="25" r="8" fill="white" opacity="0.8"/>
      <circle cx="175" cy="55" r="6" fill="white" opacity="0.6"/>
    </svg>
  `);

  // Update hero data from settings when available
  useEffect(() => {
    if (!loading && settings) {
      console.log('Hero: Updating from settings:', settings);
      
      // Update from content settings
      if (settings.content) {
        const content = settings.content;
        setHeroData(prev => ({
          ...prev,
          title: content.hero_title || prev.title,
          subtitle: content.hero_subtitle || prev.subtitle,
          ctaPrimary: content.hero_cta_primary || prev.ctaPrimary,
          ctaSecondary: content.hero_cta_secondary || prev.ctaSecondary,
          ctaPrimaryUrl: content.hero_cta_primary_url || prev.ctaPrimaryUrl,
          ctaSecondaryUrl: content.hero_cta_secondary_url || prev.ctaSecondaryUrl,
          backgroundImage: content.hero_background_image || prev.backgroundImage
        }));
      }

      // Update from general settings (logo)
      if (settings.general) {
        setHeroData(prev => ({
          ...prev,
          logoUrl: settings.general.logo_url || prev.logoUrl,
          logoAlt: settings.general.logo_alt || prev.logoAlt
        }));
      }
    }
  }, [settings, loading]);

  const handleLogoError = (e) => {
    console.log('Logo failed to load, using fallback');
    e.target.src = fallbackLogo;
  };

  // Show loading state while settings are being fetched
  if (loading) {
    return (
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-gray-300">
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="animate-pulse">
            <div className="h-24 md:h-32 w-48 bg-white bg-opacity-20 rounded mx-auto mb-8"></div>
            <div className="h-8 bg-white bg-opacity-20 rounded mb-4"></div>
            <div className="h-6 bg-white bg-opacity-20 rounded mb-8"></div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="h-12 w-32 bg-white bg-opacity-20 rounded"></div>
              <div className="h-12 w-32 bg-white bg-opacity-20 rounded"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroData.backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
      </div>

      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <LanguageSwitcher compact={true} />
        <a
          href="#/admin"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <SafeIcon icon={FiSettings} className="w-4 h-4" />
          Admin
        </a>
      </div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <img
            src={heroData.logoUrl}
            alt={heroData.logoAlt}
            className="h-24 md:h-32 mx-auto"
            onError={handleLogoError}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            {currentLanguage.code === 'el' 
              ? heroData.title 
              : 'The Platform That Empowers Your Sports Club'
            }
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-4xl mx-auto">
            {currentLanguage.code === 'el' 
              ? heroData.subtitle 
              : 'Manage your club\'s finances and academies with user-friendly apps, all under one digital roof.'
            }
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a
            href={heroData.ctaPrimaryUrl}
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            {currentLanguage.code === 'el' 
              ? heroData.ctaPrimary 
              : 'Explore the Apps'
            }
            <SafeIcon icon={FiArrowRight} className="w-5 h-5" />
          </a>
          <a
            href={heroData.ctaSecondaryUrl}
            className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            {currentLanguage.code === 'el' 
              ? heroData.ctaSecondary 
              : 'Contact'
            }
            <SafeIcon icon={FiPlay} className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;