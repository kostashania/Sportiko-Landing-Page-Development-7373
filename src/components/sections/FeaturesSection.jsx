import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiDollarSign, FiUsers, FiCheckCircle, FiBarChart3, FiLink } = FiIcons;

const FeaturesSection = () => {
  const features = [
    {
      icon: FiDollarSign,
      title: "💰 Καταγραφή Εσόδων & Εξόδων",
      items: [
        "Με κατηγορίες και επιμέρους στοιχεία",
        "Επίσημες ή ανεπίσημες συναλλαγές",
        "Πληρωμένες ή εκκρεμείς",
        "Επισυνάψτε παραστατικά ή αποδείξεις"
      ]
    },
    {
      icon: FiUsers,
      title: "👥 Διαχωρισμός Ρόλων",
      items: [
        "Διοίκηση (διαχειρίζεται τα πάντα)",
        "Ταμίας (εγκρίνει συναλλαγές)",
        "Μέλος Δ.Σ. (καταχωρεί και παρακολουθεί)"
      ]
    },
    {
      icon: FiCheckCircle,
      title: "✅ Εγκρίσεις Συναλλαγών",
      items: [
        "Πίνακας ταμία για έγκριση/απόρριψη",
        "Ιστορικό ποιος υπέβαλε και ποιος ενέκρινε"
      ]
    },
    {
      icon: FiBarChart3,
      title: "📊 Αναφορές & Ισοζύγια",
      items: [
        "Ταμείο με πραγματικό υπόλοιπο",
        "Μηνιαίες αναφορές εσόδων/εξόδων",
        "Εξαγωγή σε Excel ή PDF"
      ]
    },
    {
      icon: FiLink,
      title: "🔗 Προσαρμοσμένα Κουμπιά & Συνδέσμοι",
      items: [
        "Φόρμες παρουσιών, προπονήσεων, αξιολογήσεων",
        "Ανοίγουν εύκολα μέσα από το μενού \"Platform\""
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
            🔧 Τι μπορείτε να κάνετε με το Sportiko:
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