import React, { useState, useEffect } from 'react';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useSettings } from '../../hooks/useSettings';
import { useLanguage, languages } from '../../context/LanguageContext';

const { FiGlobe, FiSave, FiEdit3, FiPlus, FiTrash2 } = FiIcons;

const LanguageSettings = () => {
  const { settings, updateSetting } = useSettings();
  const { translations, setTranslations } = useLanguage();
  
  const [activeLanguage, setActiveLanguage] = useState('el');
  const [editingKey, setEditingKey] = useState(null);
  const [newTranslationKey, setNewTranslationKey] = useState('');
  const [newTranslationValues, setNewTranslationValues] = useState({ el: '', en: '' });
  const [localTranslations, setLocalTranslations] = useState({ el: {}, en: {} });
  const [showAddForm, setShowAddForm] = useState(false);

  // Initialize translations
  useEffect(() => {
    if (settings?.translations) {
      setLocalTranslations(settings.translations);
    } else {
      // Initialize with default structure if empty
      setLocalTranslations({
        el: {
          'site.title': 'Sportiko.eu - Η Ψηφιακή Πλατφόρμα για Αθλητικούς Συλλόγους',
          'site.description': 'Διαχειρίσου έσοδα, έξοδα, εγκρίσεις, ταμείο και ρόλους με διαφάνεια και επαγγελματισμό',
          'hero.title': '👉 Η Ψηφιακή Πλατφόρμα για τον Αθλητικό σας Σύλλογο',
          'hero.subtitle': 'Διαχειρίσου έσοδα, έξοδα, εγκρίσεις, ταμείο και ρόλους με διαφάνεια και επαγγελματισμό – όλα από ένα σημείο.',
          'hero.cta.primary': '✅ Ξεκινήστε Δωρεάν',
          'hero.cta.secondary': '💼 Δείτε Παρουσίαση',
        },
        en: {
          'site.title': 'Sportiko.eu - The Digital Platform for Sports Clubs',
          'site.description': 'Manage income, expenses, approvals, treasury and roles with transparency and professionalism',
          'hero.title': '👉 The Digital Platform for your Sports Club',
          'hero.subtitle': 'Manage income, expenses, approvals, treasury and roles with transparency and professionalism – all from one place.',
          'hero.cta.primary': '✅ Start for Free',
          'hero.cta.secondary': '💼 View Presentation',
        }
      });
    }
  }, [settings]);

  const handleSaveTranslations = async () => {
    await updateSetting('translations', null, localTranslations);
    setTranslations(localTranslations);
  };

  const handleUpdateTranslation = (key, lang, value) => {
    setLocalTranslations(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [key]: value
      }
    }));
  };

  const handleAddTranslation = () => {
    if (!newTranslationKey) return;
    
    // Add new translation key to all languages
    const updatedTranslations = { ...localTranslations };
    Object.keys(languages).forEach(langCode => {
      updatedTranslations[langCode] = {
        ...updatedTranslations[langCode],
        [newTranslationKey]: newTranslationValues[langCode] || ''
      };
    });
    
    setLocalTranslations(updatedTranslations);
    setNewTranslationKey('');
    setNewTranslationValues({ el: '', en: '' });
    setShowAddForm(false);
  };

  const handleDeleteTranslation = (key) => {
    if (window.confirm(`Are you sure you want to delete the translation key: ${key}?`)) {
      const updatedTranslations = { ...localTranslations };
      Object.keys(languages).forEach(langCode => {
        const { [key]: _, ...rest } = updatedTranslations[langCode];
        updatedTranslations[langCode] = rest;
      });
      
      setLocalTranslations(updatedTranslations);
    }
  };

  // Get all unique translation keys across all languages
  const getAllTranslationKeys = () => {
    const allKeys = new Set();
    Object.values(localTranslations).forEach(langTranslations => {
      Object.keys(langTranslations).forEach(key => allKeys.add(key));
    });
    return Array.from(allKeys).sort();
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Ρυθμίσεις Γλώσσας</h2>
        <p className="text-gray-600 mb-8">
          Διαχειριστείτε τις μεταφράσεις της ιστοσελίδας σας.
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {Object.values(languages).map((lang) => (
            <button
              key={lang.code}
              onClick={() => setActiveLanguage(lang.code)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeLanguage === lang.code 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
        <button
          onClick={handleSaveTranslations}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <SafeIcon icon={FiSave} className="w-4 h-4" />
          Αποθήκευση Μεταφράσεων
        </button>
      </div>

      {/* Add New Translation Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <SafeIcon icon={FiPlus} className="w-4 h-4" />
          Προσθήκη Νέας Μετάφρασης
        </button>
      </div>

      {/* Add New Translation Form */}
      {showAddForm && (
        <div className="bg-blue-50 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Προσθήκη Νέας Μετάφρασης</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Κλειδί Μετάφρασης (π.χ. "section.title")
              </label>
              <input
                type="text"
                value={newTranslationKey}
                onChange={(e) => setNewTranslationKey(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Εισάγετε κλειδί μετάφρασης"
              />
            </div>
            
            {/* Translation inputs for each language */}
            {Object.values(languages).map((lang) => (
              <div key={lang.code}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {lang.flag} {lang.name}
                </label>
                <input
                  type="text"
                  value={newTranslationValues[lang.code] || ''}
                  onChange={(e) => 
                    setNewTranslationValues(prev => ({
                      ...prev,
                      [lang.code]: e.target.value
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`Τιμή στα ${lang.name}`}
                />
              </div>
            ))}
            
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Ακύρωση
              </button>
              <button
                onClick={handleAddTranslation}
                disabled={!newTranslationKey}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <SafeIcon icon={FiPlus} className="w-4 h-4" />
                Προσθήκη
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Translations Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Κλειδί Μετάφρασης
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {languages.el.flag} Ελληνικά
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {languages.en.flag} English
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ενέργειες
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getAllTranslationKeys().map((key) => (
                <tr key={key} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {key}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {editingKey === key ? (
                      <input
                        type="text"
                        value={localTranslations.el[key] || ''}
                        onChange={(e) => handleUpdateTranslation(key, 'el', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      localTranslations.el[key] || '-'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {editingKey === key ? (
                      <input
                        type="text"
                        value={localTranslations.en[key] || ''}
                        onChange={(e) => handleUpdateTranslation(key, 'en', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      localTranslations.en[key] || '-'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {editingKey === key ? (
                      <button
                        onClick={() => setEditingKey(null)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Αποθήκευση
                      </button>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingKey(key)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <SafeIcon icon={FiEdit3} className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTranslation(key)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LanguageSettings;