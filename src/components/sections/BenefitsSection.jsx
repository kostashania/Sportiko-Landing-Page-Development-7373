import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCheck } = FiIcons;

const BenefitsSection = () => {
  const benefits = [
    "Εύχρηστο περιβάλλον για όλους – ακόμα και για μη εξοικειωμένους",
    "Διαφάνεια στη διαχείριση των οικονομικών του συλλόγου",
    "Πλήρες ιστορικό για κάθε καταχώρηση & ενέργεια",
    "Επαγγελματικό εργαλείο για παρουσίαση σε χορηγούς, μέλη & γονείς",
    "Απευθύνεται σε κάθε τύπο συλλόγου – όχι μόνο ποδοσφαιρικούς"
  ];

  return (
    <section className="py-20 px-4 bg-blue-600 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            📈 Γιατί να επιλέξετε Sportiko;
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start gap-4 text-left"
              >
                <div className="flex-shrink-0 p-1 bg-green-500 rounded-full">
                  <SafeIcon icon={FiCheck} className="w-4 h-4 text-white" />
                </div>
                <p className="text-lg">{benefit}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsSection;