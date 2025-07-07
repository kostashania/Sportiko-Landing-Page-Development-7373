import React, { useState } from 'react';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiZap, FiGlobe, FiActivity, FiCode, FiMessageSquare } = FiIcons;

const IntegrationsSettings = ({ settings, updateSetting }) => {
  const [localSettings, setLocalSettings] = useState({
    googleAnalyticsId: settings?.integrations?.google_analytics_id || '',
    facebookPixelId: settings?.integrations?.facebook_pixel_id || '',
    hotjarId: settings?.integrations?.hotjar_id || '',
    customHeaderScripts: settings?.integrations?.custom_header_scripts || '',
    customFooterScripts: settings?.integrations?.custom_footer_scripts || '',
    chatbotEnabled: settings?.integrations?.chatbot_enabled || false,
    chatbotConfig: settings?.integrations?.chatbot_config || ''
  });

  const handleChange = (key, value) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
    updateSetting('integrations', key.replace(/([A-Z])/g, '_$1').toLowerCase(), value);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Ενσωματώσεις</h2>
        <p className="text-gray-600 mb-8">
          Συνδέστε την ιστοσελίδα σας με εξωτερικές υπηρεσίες και εργαλεία.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Analytics */}
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <SafeIcon icon={FiActivity} className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google Analytics ID (G-XXXXXXXXXX)
              </label>
              <input
                type="text"
                value={localSettings.googleAnalyticsId}
                onChange={(e) => handleChange('googleAnalyticsId', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="G-XXXXXXXXXX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facebook Pixel ID
              </label>
              <input
                type="text"
                value={localSettings.facebookPixelId}
                onChange={(e) => handleChange('facebookPixelId', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="XXXXXXXXXXXXXXXXXX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hotjar ID
              </label>
              <input
                type="text"
                value={localSettings.hotjarId}
                onChange={(e) => handleChange('hotjarId', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="XXXXXXX"
              />
            </div>
          </div>
        </div>

        {/* Custom Scripts */}
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <SafeIcon icon={FiCode} className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Custom Scripts</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Header Scripts
              </label>
              <textarea
                value={localSettings.customHeaderScripts}
                onChange={(e) => handleChange('customHeaderScripts', e.target.value)}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                placeholder="<!-- Scripts for head section -->"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Footer Scripts
              </label>
              <textarea
                value={localSettings.customFooterScripts}
                onChange={(e) => handleChange('customFooterScripts', e.target.value)}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                placeholder="<!-- Scripts for end of body -->"
              />
            </div>
          </div>
        </div>

        {/* Chatbot */}
        <div className="bg-gray-50 rounded-xl p-6 lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <SafeIcon icon={FiMessageSquare} className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Chatbot</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={localSettings.chatbotEnabled}
                onChange={(e) => handleChange('chatbotEnabled', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label className="text-sm font-medium text-gray-700">
                Ενεργοποίηση Chatbot
              </label>
            </div>

            {localSettings.chatbotEnabled && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Κώδικας Chatbot
                </label>
                <textarea
                  value={localSettings.chatbotConfig}
                  onChange={(e) => handleChange('chatbotConfig', e.target.value)}
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  placeholder="<!-- Chatbot configuration code -->"
                />
              </div>
            )}
          </div>

          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Σημείωση:</strong> Μπορείτε να χρησιμοποιήσετε οποιαδήποτε υπηρεσία chatbot όπως Intercom, Drift, ή Tawk.to. Ακολουθήστε τις οδηγίες του παρόχου για τον κώδικα ενσωμάτωσης.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-green-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Κατάσταση Ενσωματώσεων</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <SafeIcon icon={FiActivity} className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">Google Analytics</p>
            <p className="text-xs text-green-600">
              {localSettings.googleAnalyticsId ? 'Ενεργό' : 'Ανενεργό'}
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <SafeIcon icon={FiGlobe} className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">Facebook Pixel</p>
            <p className="text-xs text-blue-600">
              {localSettings.facebookPixelId ? 'Ενεργό' : 'Ανενεργό'}
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <SafeIcon icon={FiMessageSquare} className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">Chatbot</p>
            <p className="text-xs text-purple-600">
              {localSettings.chatbotEnabled ? 'Ενεργό' : 'Ανενεργό'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsSettings;