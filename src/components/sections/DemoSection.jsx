import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMonitor, FiSmartphone, FiTablet } = FiIcons;

const DemoSection = () => {
  const mockups = [
    {
      title: "Καρτέλα Ταμείου",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      icon: FiMonitor
    },
    {
      title: "Φόρμα Καταγραφής Εξόδων",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80",
      icon: FiTablet
    },
    {
      title: "Σελίδα Εγκρίσεων",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      icon: FiSmartphone
    }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            📷 Εικόνες / Demo
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mockups.map((mockup, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <img 
                  src={mockup.image}
                  alt={mockup.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <SafeIcon icon={mockup.icon} className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {mockup.title}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-center text-white"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            🧪 Demo ή Δοκιμαστική Χρήση
          </h3>
          <p className="text-xl mb-8">
            Δοκιμάστε το Sportiko με έναν demo λογαριασμό και δείτε πώς μπορεί να οργανώσει τον σύλλογό σας.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
              📥 Ζητήστε δοκιμή
            </button>
            <a
              href="https://spiffy-nougat-80a628.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-all"
            >
              Δημιουργήστε demo λογαριασμό
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DemoSection;