import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';

const { FiDollarSign, FiUsers, FiCheckCircle, FiBarChart3, FiLink } = FiIcons;

const FeaturesSection = () => {
  const { t, currentLanguage } = useLanguage();

  const features = [
    {
      icon: FiDollarSign,
      title: t('features.income.title'),
      items: [
        t('features.income.item1'),
        t('features.income.item2'),
        t('features.income.item3'),
        t('features.income.item4')
      ]
    },
    {
      icon: FiUsers,
      title: t('features.roles.title'),
      items: [
        t('features.roles.item1'),
        t('features.roles.item2'),
        t('features.roles.item3')
      ]
    },
    {
      icon: FiCheckCircle,
      title: t('features.approvals.title'),
      items: [
        t('features.approvals.item1'),
        t('features.approvals.item2')
      ]
    },
    {
      icon: FiBarChart3,
      title: t('features.reports.title'),
      items: [
        t('features.reports.item1'),
        t('features.reports.item2'),
        t('features.reports.item3')
      ]
    },
    {
      icon: FiLink,
      title: t('features.customization.title'),
      items: [
        t('features.customization.item1'),
        t('features.customization.item2')
      ]
    }
  ];

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('features.section.title')}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <SafeIcon icon={feature.icon} className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <ul className="space-y-2">
                {feature.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-gray-600 flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;