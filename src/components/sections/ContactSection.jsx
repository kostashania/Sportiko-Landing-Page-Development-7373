import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMail, FiPhone, FiMapPin } = FiIcons;

const ContactSection = () => {
  const contactInfo = [
    {
      icon: FiMail,
      label: "📧 Email",
      value: "kostasasvestas@yahoo.com",
      link: "mailto:kostasasvestas@yahoo.com"
    },
    {
      icon: FiPhone,
      label: "📱 Τηλέφωνο",
      value: "(+30) 698 4146 197",
      link: "tel:+306984146197"
    },
    {
      icon: FiMapPin,
      label: "📍 Τοποθεσία",
      value: "Χανιά | Υποστήριξη σε όλη την Ελλάδα",
      link: null
    }
  ];

  return (
    <section className="py-20 px-4 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            📞 Επικοινωνία
          </h2>
          
          <p className="text-xl mb-12 text-gray-300">
            Έχετε απορίες ή θέλετε παρουσίαση; Επικοινωνήστε μαζί μας:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactInfo.map((contact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-blue-600 rounded-full mb-4">
                    <SafeIcon icon={contact.icon} className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{contact.label}</h3>
                  {contact.link ? (
                    <a
                      href={contact.link}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {contact.value}
                    </a>
                  ) : (
                    <p className="text-gray-300">{contact.value}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;