import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../hooks/useSettings';

const FeaturesSection = () => {
  const { currentLanguage } = useLanguage();
  const { features, loadFeatures } = useSettings();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    console.log('FeaturesSection: Loading features...');
    loadFeatures();
  }, [loadFeatures]);

  useEffect(() => {
    console.log('FeaturesSection: Features changed:', features);
    if (features.length > 0) {
      setIsLoaded(true);
    }
  }, [features]);

  // Default features if not loaded from database
  const defaultFeatures = [
    {
      id: '1',
      title: '💰 Sportiko Fin',
      description: 'Οικονομική διαχείριση συλλόγων. Έσοδα, έξοδα, εγκρίσεις, αναφορές και ρόλοι. Όλα στο: fin.sportiko.eu',
      icon: 'FiDollarSign',
      link_url: 'https://fin.sportiko.eu',
      order_index: 1,
      is_active: true
    },
    {
      id: '2',
      title: '🎓 Sportiko Academy',
      description: 'Διαχείριση ακαδημιών: Εγγραφές, παρουσίες, επικοινωνία με γονείς, ειδοποιήσεις & αξιολογήσεις. Δοκιμάστε το στο: academy.sportiko.eu',
      icon: 'FiUsers',
      link_url: 'https://academy.sportiko.eu',
      order_index: 2,
      is_active: true
    }
  ];

  // English translations for default features
  const defaultFeaturesEn = [
    {
      id: '1',
      title: '💰 Sportiko Fin',
      description: 'Club financial management: Income, expenses, approvals, reports and roles. Visit: fin.sportiko.eu',
      icon: 'FiDollarSign',
      link_url: 'https://fin.sportiko.eu',
      order_index: 1,
      is_active: true
    },
    {
      id: '2',
      title: '🎓 Sportiko Academy',
      description: 'Academy management: Registrations, attendance, parent communication & assessments. Try it at: academy.sportiko.eu',
      icon: 'FiUsers',
      link_url: 'https://academy.sportiko.eu',
      order_index: 2,
      is_active: true
    }
  ];

  // Use features from database if available, otherwise use defaults
  const displayFeatures = isLoaded ? features : defaultFeatures;
  const currentFeatures = currentLanguage.code === 'el' ? displayFeatures : defaultFeaturesEn;

  console.log('FeaturesSection: Displaying features:', currentFeatures);

  return (
    <section id="features" className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {currentLanguage.code === 'el' ? '🚀 Οι Εφαρμογές του Sportiko' : '🚀 Sportiko Apps'}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {currentFeatures
            .filter(feature => feature.is_active)
            .map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <SafeIcon 
                      icon={FiIcons[feature.icon] || FiIcons.FiZap} 
                      className="w-6 h-6 text-blue-600" 
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                </div>
                <p className="text-gray-600 mb-4 whitespace-pre-line">
                  {feature.description}
                </p>
                {feature.link_url && (
                  <a
                    href={feature.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors font-medium"
                  >
                    <SafeIcon icon={FiIcons.FiExternalLink} className="w-4 h-4" />
                    {currentLanguage.code === 'el' ? 'Επισκεφθείτε' : 'Visit'}
                  </a>
                )}
              </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;