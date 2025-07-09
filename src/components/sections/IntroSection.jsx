import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../hooks/useSettings';

const IntroSection = () => {
  const { t, currentLanguage } = useLanguage();
  const { settings, loading } = useSettings();

  // Get intro text from settings or use fallback
  const getIntroText = () => {
    if (!loading && settings?.content?.intro_text) {
      return settings.content.intro_text;
    }
    // Fallback text
    return currentLanguage.code === 'el' 
      ? 'Το Sportiko είναι μια σύγχρονη εφαρμογή σχεδιασμένη για να καλύψει τις ανάγκες οικονομικής διαχείρισης κάθε είδους αθλητικού συλλόγου ή σωματείου. Είτε πρόκειται για ποδόσφαιρο, μπάσκετ, βόλεϊ, καράτε ή πολιτιστικό σύλλογο, το Sportiko σας προσφέρει ένα εύχρηστο και ασφαλές περιβάλλον για να οργανώνετε, να καταγράφετε και να ελέγχετε κάθε οικονομική κίνηση και εσωτερική διαδικασία.'
      : 'Sportiko is a modern application designed to meet the financial management needs of any type of sports club or association. Whether it\'s football, basketball, volleyball, karate or a cultural club, Sportiko offers you a user-friendly and secure environment to organize, record and control every financial transaction and internal procedure.';
  };

  const getIntroTitle = () => {
    if (!loading && settings?.content?.intro_title) {
      return settings.content.intro_title;
    }
    return currentLanguage.code === 'el' 
      ? '💡 Εισαγωγική Παράγραφος'
      : '💡 Introduction';
  };

  if (loading) {
    return (
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-8 max-w-md mx-auto"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded max-w-3xl mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            {getIntroTitle()}
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            {getIntroText()}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default IntroSection;