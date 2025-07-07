import React, { useState } from 'react';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSearch, FiGlobe, FiTag, FiFileText, FiTrendingUp } = FiIcons;

const SEOSettings = ({ settings, updateSetting }) => {
  const [localSettings, setLocalSettings] = useState({
    metaTitle: settings?.seo?.meta_title || 'Sportiko.eu - Η Ψηφιακή Πλατφόρμα για Αθλητικούς Συλλόγους',
    metaDescription: settings?.seo?.meta_description || 'Διαχειρίσου έσοδα, έξοδα, εγκρίσεις, ταμείο και ρόλους με διαφάνεια και επαγγελματισμό',
    metaKeywords: settings?.seo?.meta_keywords || 'αθλητικός σύλλογος, διαχείριση, ταμείο, έσοδα, έξοδα',
    ogTitle: settings?.seo?.og_title || '',
    ogDescription: settings?.seo?.og_description || '',
    ogImage: settings?.seo?.og_image || '',
    structuredData: settings?.seo?.structured_data || ''
  });

  const handleChange = (key, value) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
    updateSetting('seo', key.replace(/([A-Z])/g, '_$1').toLowerCase(), value);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Ρυθμίσεις SEO</h2>
        <p className="text-gray-600 mb-8">
          Βελτιστοποιήστε την ιστοσελίδα σας για τις μηχανές αναζήτησης.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic SEO */}
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <SafeIcon icon={FiSearch} className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Βασικό SEO</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Title ({localSettings.metaTitle.length}/60)
              </label>
              <input
                type="text"
                value={localSettings.metaTitle}
                onChange={(e) => handleChange('metaTitle', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Τίτλος για μηχανές αναζήτησης"
              />
              <div className="mt-1 text-xs text-gray-500">
                {localSettings.metaTitle.length > 60 && (
                  <span className="text-red-600">Ο τίτλος είναι πολύ μεγάλος</span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Description ({localSettings.metaDescription.length}/160)
              </label>
              <textarea
                value={localSettings.metaDescription}
                onChange={(e) => handleChange('metaDescription', e.target.value)}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Περιγραφή για μηχανές αναζήτησης"
              />
              <div className="mt-1 text-xs text-gray-500">
                {localSettings.metaDescription.length > 160 && (
                  <span className="text-red-600">Η περιγραφή είναι πολύ μεγάλη</span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Keywords (χωρισμένες με κόμμα)
              </label>
              <input
                type="text"
                value={localSettings.metaKeywords}
                onChange={(e) => handleChange('metaKeywords', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="λέξη1, λέξη2, λέξη3"
              />
            </div>
          </div>
        </div>

        {/* Open Graph */}
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <SafeIcon icon={FiGlobe} className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Open Graph (Social Media)</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                OG Title
              </label>
              <input
                type="text"
                value={localSettings.ogTitle}
                onChange={(e) => handleChange('ogTitle', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Τίτλος για social media (αφήστε κενό για auto)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                OG Description
              </label>
              <textarea
                value={localSettings.ogDescription}
                onChange={(e) => handleChange('ogDescription', e.target.value)}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Περιγραφή για social media (αφήστε κενό για auto)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                OG Image URL
              </label>
              <input
                type="url"
                value={localSettings.ogImage}
                onChange={(e) => handleChange('ogImage', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/og-image.jpg"
              />
            </div>
          </div>
        </div>

        {/* Structured Data */}
        <div className="bg-gray-50 rounded-xl p-6 lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <SafeIcon icon={FiFileText} className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Structured Data (JSON-LD)</h3>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              JSON-LD Schema
            </label>
            <textarea
              value={localSettings.structuredData}
              onChange={(e) => handleChange('structuredData', e.target.value)}
              rows="10"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              placeholder='{"@context": "https://schema.org", "@type": "Organization", "name": "Sportiko"}'
            />
          </div>
        </div>
      </div>

      {/* SEO Preview */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <SafeIcon icon={FiTrendingUp} className="w-6 h-6 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">Προεπισκόπηση Google</h3>
        </div>
        
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="mb-2">
            <h4 className="text-blue-600 text-lg hover:underline cursor-pointer">
              {localSettings.metaTitle}
            </h4>
          </div>
          <div className="text-green-700 text-sm mb-2">
            https://sportiko.eu
          </div>
          <div className="text-gray-600 text-sm">
            {localSettings.metaDescription}
          </div>
        </div>
      </div>

      {/* SEO Checklist */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Checklist</h3>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className={`w-5 h-5 rounded-full ${localSettings.metaTitle.length > 0 && localSettings.metaTitle.length <= 60 ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="text-sm">Meta Title (1-60 χαρακτήρες)</span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className={`w-5 h-5 rounded-full ${localSettings.metaDescription.length > 0 && localSettings.metaDescription.length <= 160 ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="text-sm">Meta Description (1-160 χαρακτήρες)</span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className={`w-5 h-5 rounded-full ${localSettings.metaKeywords.length > 0 ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
            <span className="text-sm">Meta Keywords</span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className={`w-5 h-5 rounded-full ${localSettings.ogImage.length > 0 ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
            <span className="text-sm">Open Graph Image</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOSettings;