import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../hooks/useSettings';

const { FiMonitor, FiSmartphone, FiTablet, FiPlay } = FiIcons;

const DemoSection = () => {
  const { currentLanguage } = useLanguage();
  const { demoItems, settings, loading } = useSettings();
  const [isLoaded, setIsLoaded] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    if (!loading && demoItems.length > 0) {
      setIsLoaded(true);
    }

    // Get video URL from settings
    if (!loading && settings?.content?.demo_video_url) {
      setVideoUrl(settings.content.demo_video_url);
    }
  }, [demoItems, settings, loading]);

  // Default items if not loaded from database
  const defaultItems = [
    {
      id: '1',
      title: 'Καρτέλα Ταμείου',
      image_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f',
      icon: 'FiMonitor',
      order_index: 1,
      is_active: true
    },
    {
      id: '2',
      title: 'Φόρμα Καταγραφής Εξόδων',
      image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
      icon: 'FiTablet',
      order_index: 2,
      is_active: true
    },
    {
      id: '3',
      title: 'Σελίδα Εγκρίσεων',
      image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
      icon: 'FiSmartphone',
      order_index: 3,
      is_active: true
    }
  ];

  // English translations for default items
  const defaultItemsEn = [
    {
      id: '1',
      title: 'Treasury Dashboard',
      image_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f',
      icon: 'FiMonitor',
      order_index: 1,
      is_active: true
    },
    {
      id: '2',
      title: 'Expense Recording Form',
      image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
      icon: 'FiTablet',
      order_index: 2,
      is_active: true
    },
    {
      id: '3',
      title: 'Approvals Page',
      image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
      icon: 'FiSmartphone',
      order_index: 3,
      is_active: true
    }
  ];

  // Use items from database if available, otherwise use defaults
  const displayItems = isLoaded ? demoItems : defaultItems;

  // Get section title from settings
  const getSectionTitle = () => {
    if (!loading && settings?.content?.demo_section_title) {
      return settings.content.demo_section_title;
    }
    return currentLanguage.code === 'el' 
      ? '📹 Δείτε Πώς Λειτουργεί'
      : '📹 Watch How It Works';
  };

  if (loading) {
    return (
      <section id="demo" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded mb-8 max-w-md mx-auto"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-50 rounded-xl overflow-hidden shadow-lg">
                    <div className="w-full h-48 bg-gray-300"></div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-6 h-6 bg-gray-300 rounded"></div>
                        <div className="h-5 bg-gray-300 rounded flex-1"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="demo" className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            {getSectionTitle()}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(currentLanguage.code === 'el' ? displayItems : defaultItemsEn)
              .filter(item => item.is_active)
              .map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="bg-gray-50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <a
                    href={item.link_url || '#'}
                    target={item.link_url ? "_blank" : undefined}
                    rel={item.link_url ? "noopener noreferrer" : undefined}
                    className="block"
                  >
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                      }}
                    />
                  </a>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <SafeIcon icon={FiIcons[item.icon] || FiMonitor} className="w-6 h-6 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                    </div>
                    {item.description && (
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    )}
                  </div>
                </motion.div>
              ))}
          </div>
        </motion.div>

        {/* Video Section */}
        {videoUrl && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="aspect-video w-full rounded-xl overflow-hidden shadow-2xl mb-16"
          >
            <iframe
              src={videoUrl}
              title="Demo Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-center text-white"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            {currentLanguage.code === 'el' 
              ? '✅ Γιατί να ξεκινήσετε σήμερα'
              : '✅ Why Start Today'
            }
          </h3>
          <p className="text-xl mb-8">
            {currentLanguage.code === 'el' 
              ? 'Ξεκινήστε σήμερα με το Sportiko. Οργανώστε τον σύλλογό σας με τις εφαρμογές Fin & Academy.'
              : 'Start today with Sportiko. Organize your club with the Fin & Academy apps.'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contact"
              className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              {currentLanguage.code === 'el' ? 'Ζητήστε Demo' : 'Request a Demo'}
            </a>
            <a
              href="https://fin.sportiko.eu"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-all"
            >
              {currentLanguage.code === 'el' ? 'Δοκιμάστε το Sportiko Fin' : 'Try Sportiko Fin'}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DemoSection;