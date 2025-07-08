import React, { useState, useCallback } from 'react';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiType, FiEdit3, FiEye, FiLink2 } = FiIcons;

const ContentSettings = ({ settings, updateSetting }) => {
  const [localSettings, setLocalSettings] = useState({
    heroTitle: settings?.content?.hero_title || '👉 Η Ψηφιακή Πλατφόρμα για τον Αθλητικό σας Σύλλογο',
    heroSubtitle: settings?.content?.hero_subtitle || 'Διαχειρίσου έσοδα, έξοδα, εγκρίσεις, ταμείο και ρόλους με διαφάνεια και επαγγελματισμό – όλα από ένα σημείο.',
    heroCtaPrimary: settings?.content?.hero_cta_primary || '✅ Ξεκινήστε Δωρεάν',
    heroCtaSecondary: settings?.content?.hero_cta_secondary || '💼 Δείτε Παρουσίαση',
    introText: settings?.content?.intro_text || 'Το Sportiko είναι μια σύγχρονη εφαρμογή...',
    footerText: settings?.content?.footer_text || '© 2024 Sportiko. Όλα τα δικαιώματα κατοχυρωμένα.'
  });
  const [activePreview, setActivePreview] = useState('hero');

  // Debounce function to prevent multiple rapid calls
  const debounce = useCallback((func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }, []);

  // Debounced update function
  const debouncedUpdate = useCallback(
    debounce((key, value) => {
      updateSetting('content', key.replace(/([A-Z])/g, '_$1').toLowerCase(), value);
    }, 500),
    [updateSetting]
  );

  const handleChange = (key, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Use debounced update to prevent too many API calls
    debouncedUpdate(key, value);
  };

  const sectionIcons = {
    hero: '🏠',
    intro: '💡',
    features: '🔧',
    benefits: '📈',
    demo: '📷',
    contact: '📞',
    footer: '🦶'
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Ρυθμίσεις Περιεχομένου</h2>
        <p className="text-gray-600 mb-8">
          Επεξεργαστείτε τα κείμενα και το περιεχόμενο της ιστοσελίδας σας.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Content Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero Section */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">{sectionIcons.hero}</span>
              <h3 className="text-lg font-semibold text-gray-900">Hero Section</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Κύριος Τίτλος
                </label>
                <textarea
                  value={localSettings.heroTitle}
                  onChange={(e) => handleChange('heroTitle', e.target.value)}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Εισάγετε τον κύριο τίτλο..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Υπότιτλος
                </label>
                <textarea
                  value={localSettings.heroSubtitle}
                  onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Εισάγετε τον υπότιτλο..."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Κύριο Κουμπί CTA
                  </label>
                  <input
                    type="text"
                    value={localSettings.heroCtaPrimary}
                    onChange={(e) => handleChange('heroCtaPrimary', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="π.χ. Ξεκινήστε Δωρεάν"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Δευτερεύον Κουμπί CTA
                  </label>
                  <input
                    type="text"
                    value={localSettings.heroCtaSecondary}
                    onChange={(e) => handleChange('heroCtaSecondary', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="π.χ. Δείτε Παρουσίαση"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Introduction Section */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">{sectionIcons.intro}</span>
              <h3 className="text-lg font-semibold text-gray-900">Εισαγωγή</h3>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Κείμενο Εισαγωγής
              </label>
              <textarea
                value={localSettings.introText}
                onChange={(e) => handleChange('introText', e.target.value)}
                rows="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Εισάγετε το κείμενο εισαγωγής..."
              />
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">{sectionIcons.footer}</span>
              <h3 className="text-lg font-semibold text-gray-900">Footer</h3>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Κείμενο Footer
              </label>
              <input
                type="text"
                value={localSettings.footerText}
                onChange={(e) => handleChange('footerText', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="© 2024 Sportiko. Όλα τα δικαιώματα κατοχυρωμένα."
              />
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <SafeIcon icon={FiEye} className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Προεπισκόπηση</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ενότητα για Προεπισκόπηση
              </label>
              <select
                value={activePreview}
                onChange={(e) => setActivePreview(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="hero">Hero Section</option>
                <option value="intro">Εισαγωγή</option>
                <option value="footer">Footer</option>
              </select>
            </div>
            <div className="border rounded-lg p-4 bg-gray-50">
              {activePreview === 'hero' && (
                <div className="text-center space-y-3">
                  <h4 className="text-lg font-bold text-gray-900">
                    {localSettings.heroTitle}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {localSettings.heroSubtitle}
                  </p>
                  <div className="flex flex-col gap-2">
                    <button className="px-4 py-2 bg-green-600 text-white rounded text-sm">
                      {localSettings.heroCtaPrimary}
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm">
                      {localSettings.heroCtaSecondary}
                    </button>
                  </div>
                </div>
              )}
              {activePreview === 'intro' && (
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    💡 Εισαγωγική Παράγραφος
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {localSettings.introText}
                  </p>
                </div>
              )}
              {activePreview === 'footer' && (
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    {localSettings.footerText}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Συμβουλή:</strong> Χρησιμοποιήστε emojis για να κάνετε το περιεχόμενό σας πιο ελκυστικό και φιλικό.
            </p>
          </div>
        </div>
      </div>

      {/* Content Statistics */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Στατιστικά Περιεχομένου</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {localSettings.heroTitle.length}
            </div>
            <p className="text-sm text-gray-600">Χαρακτήρες Τίτλου</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {localSettings.heroSubtitle.length}
            </div>
            <p className="text-sm text-gray-600">Χαρακτήρες Υπότιτλου</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {localSettings.introText.split(' ').length}
            </div>
            <p className="text-sm text-gray-600">Λέξεις Εισαγωγής</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {(localSettings.heroTitle.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu) || []).length}
            </div>
            <p className="text-sm text-gray-600">Emojis</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentSettings;