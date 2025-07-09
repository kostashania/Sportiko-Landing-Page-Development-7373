import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../hooks/useSettings';

const { FiMail, FiPhone, FiMapPin } = FiIcons;

const ContactSection = () => {
  const { currentLanguage } = useLanguage();
  const { contactInfo, loadContactInfo } = useSettings();
  const [isLoaded, setIsLoaded] = useState(false);
  const [mapUrl, setMapUrl] = useState('https://maps.google.com/?q=Χανιά,Ελλάδα&output=embed');

  useEffect(() => {
    console.log('ContactSection: Loading contact info...');
    loadContactInfo();
  }, [loadContactInfo]);

  useEffect(() => {
    console.log('ContactSection: Contact info changed:', contactInfo);
    if (contactInfo.length > 0) {
      setIsLoaded(true);
      // Find map URL in contact info
      const addressContact = contactInfo.find(item => item.type === 'address');
      if (addressContact && addressContact.link) {
        let url = addressContact.link;
        // Make sure the URL is in embed format
        if (url.includes('maps.google.com') && !url.includes('output=embed')) {
          url = url + (url.includes('?') ? '&' : '?') + 'output=embed';
        }
        setMapUrl(url);
      }
    }
  }, [contactInfo]);

  // Default contact info if not loaded from database
  const defaultContactInfo = [
    {
      id: '1',
      type: 'email',
      value: 'info@sportiko.eu',
      link: 'mailto:info@sportiko.eu',
      icon: 'FiMail',
      order_index: 1,
      is_active: true
    },
    {
      id: '2',
      type: 'phone',
      value: '(+30) 698 4146 197',
      link: 'tel:+306984146197',
      icon: 'FiPhone',
      order_index: 2,
      is_active: true
    },
    {
      id: '3',
      type: 'address',
      value: 'Χανιά, Κρήτη',
      link: 'https://maps.google.com/?q=Χανιά,Ελλάδα',
      icon: 'FiMapPin',
      order_index: 3,
      is_active: true
    }
  ];

  // English translations for default contact info
  const defaultContactInfoEn = [
    {
      id: '1',
      type: 'email',
      value: 'info@sportiko.eu',
      link: 'mailto:info@sportiko.eu',
      icon: 'FiMail',
      order_index: 1,
      is_active: true
    },
    {
      id: '2',
      type: 'phone',
      value: '(+30) 698 4146 197',
      link: 'tel:+306984146197',
      icon: 'FiPhone',
      order_index: 2,
      is_active: true
    },
    {
      id: '3',
      type: 'address',
      value: 'Chania, Crete',
      link: 'https://maps.google.com/?q=Chania,Greece',
      icon: 'FiMapPin',
      order_index: 3,
      is_active: true
    }
  ];

  // Use contact info from database if available, otherwise use defaults
  const displayContactInfo = isLoaded ? contactInfo : defaultContactInfo;
  const currentContactInfo = currentLanguage.code === 'el' ? displayContactInfo : defaultContactInfoEn;

  // Get icon for contact type
  const getIconForType = (type) => {
    switch (type) {
      case 'email': return FiMail;
      case 'phone': return FiPhone;
      case 'address': return FiMapPin;
      default: return FiMail;
    }
  };

  // Get label for contact type
  const getLabelForType = (type, isEnglish = false) => {
    switch (type) {
      case 'email': return isEnglish ? 'Email' : 'Email';
      case 'phone': return isEnglish ? 'Phone' : 'Τηλέφωνο';
      case 'address': return isEnglish ? 'Location' : 'Τοποθεσία';
      default: return isEnglish ? 'Contact' : 'Επικοινωνία';
    }
  };

  console.log('ContactSection: Displaying contact info:', currentContactInfo);
  console.log('ContactSection: Map URL:', mapUrl);

  return (
    <section id="contact" className="py-20 px-4 bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            {currentLanguage.code === 'el' ? '📬 Επικοινωνία' : '📬 Contact'}
          </h2>
          <p className="text-xl mb-12 text-gray-300">
            {currentLanguage.code === 'el' 
              ? 'Έχετε απορίες ή θέλετε παρουσίαση; Επικοινωνήστε μαζί μας:' 
              : 'Have questions or want a presentation? Contact us:'
            }
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 gap-8">
              {currentContactInfo
                .filter(contact => contact.is_active)
                .map((contact, index) => (
                  <motion.div
                    key={contact.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="p-3 bg-blue-600 rounded-full">
                        <SafeIcon 
                          icon={FiIcons[contact.icon] || getIconForType(contact.type)} 
                          className="w-6 h-6 text-white" 
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          {`📍 ${getLabelForType(contact.type, currentLanguage.code === 'en')}`}
                        </h3>
                        {contact.link ? (
                          <a
                            href={contact.link}
                            target={contact.type === 'address' ? '_blank' : undefined}
                            rel={contact.type === 'address' ? 'noopener noreferrer' : undefined}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            {contact.value}
                          </a>
                        ) : (
                          <p className="text-gray-300">{contact.value}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="lg:col-span-3 bg-gray-800 rounded-xl overflow-hidden"
          >
            <div className="aspect-video w-full h-full">
              <iframe
                src={mapUrl}
                title="Google Maps"
                frameBorder="0"
                allowFullScreen=""
                aria-hidden="false"
                tabIndex="0"
                className="w-full h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;