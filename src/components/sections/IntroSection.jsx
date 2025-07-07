import React from 'react';
import { motion } from 'framer-motion';

const IntroSection = () => {
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
            💡 Εισαγωγική Παράγραφος
          </h2>
          
          <p className="text-lg text-gray-700 leading-relaxed">
            Το Sportiko είναι μια σύγχρονη εφαρμογή σχεδιασμένη για να καλύψει τις ανάγκες οικονομικής διαχείρισης κάθε είδους αθλητικού συλλόγου ή σωματείου. Είτε πρόκειται για ποδόσφαιρο, μπάσκετ, βόλεϊ, καράτε ή πολιτιστικό σύλλογο, το Sportiko σας προσφέρει ένα εύχρηστο και ασφαλές περιβάλλον για να οργανώνετε, να καταγράφετε και να ελέγχετε κάθε οικονομική κίνηση και εσωτερική διαδικασία.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default IntroSection;