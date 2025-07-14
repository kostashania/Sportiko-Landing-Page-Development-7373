import React, { useState } from 'react';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import StorageStatus from './StorageStatus';

const { FiGlobe, FiServer, FiLink, FiShield } = FiIcons;

const GeneralSettings = ({ settings, updateSetting }) => {
  const [localSettings, setLocalSettings] = useState({
    siteName: settings?.general?.site_name || 'Sportiko.eu',
    projectId: settings?.general?.project_id || 'bjelydvroavsqczejpgd',
    appUrl: settings?.general?.app_url || 'https://sportiko.eu/',
    googleRecaptchaSiteKey: settings?.general?.google_recaptcha_site_key || '',
    googleRecaptchaSecretKey: settings?.general?.google_recaptcha_secret_key || ''
  });

  const handleChange = (key, value) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
    updateSetting('general', key.replace(/([A-Z])/g, '_$1').toLowerCase(), value);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Γενικές Ρυθμίσεις</h2>
        <p className="text-gray-600 mb-8">
          Διαχειριστείτε τις βασικές ρυθμίσεις της ιστοσελίδας σας.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Site Information */}
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <SafeIcon icon={FiGlobe} className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Πληροφορίες Ιστοσελίδας</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="site-name" className="block text-sm font-medium text-gray-700 mb-2">
                Όνομα Ιστοσελίδας
              </label>
              <input
                id="site-name"
                type="text"
                value={localSettings.siteName}
                onChange={(e) => handleChange('siteName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Sportiko.eu"
                autoComplete="organization"
              />
            </div>
            
            <div>
              <label htmlFor="app-url" className="block text-sm font-medium text-gray-700 mb-2">
                URL Εφαρμογής
              </label>
              <input
                id="app-url"
                type="url"
                value={localSettings.appUrl}
                onChange={(e) => handleChange('appUrl', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://sportiko.eu/"
                autoComplete="url"
              />
            </div>
          </div>
        </div>

        {/* Database Settings */}
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <SafeIcon icon={FiServer} className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Ρυθμίσεις Βάσης Δεδομένων</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="project-id" className="block text-sm font-medium text-gray-700 mb-2">
                Supabase Project ID
              </label>
              <input
                id="project-id"
                type="text"
                value={localSettings.projectId}
                onChange={(e) => handleChange('projectId', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="bjelydvroavsqczejpgd"
                autoComplete="off"
              />
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <SafeIcon icon={FiLink} className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Κατάσταση Σύνδεσης</span>
              </div>
              <p className="text-sm text-blue-700">
                Συνδεδεμένο με Supabase ✓
              </p>
            </div>
          </div>
        </div>

        {/* Storage Status */}
        <div className="lg:col-span-2">
          <StorageStatus />
        </div>

        {/* Google reCAPTCHA */}
        <div className="bg-gray-50 rounded-xl p-6 lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <SafeIcon icon={FiShield} className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900">Google reCAPTCHA</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="recaptcha-site-key" className="block text-sm font-medium text-gray-700 mb-2">
                Site Key (Δημόσιο Κλειδί)
              </label>
              <input
                id="recaptcha-site-key"
                type="text"
                value={localSettings.googleRecaptchaSiteKey}
                onChange={(e) => handleChange('googleRecaptchaSiteKey', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="6LcXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                autoComplete="off"
              />
            </div>
            
            <div>
              <label htmlFor="recaptcha-secret-key" className="block text-sm font-medium text-gray-700 mb-2">
                Secret Key (Μυστικό Κλειδί)
              </label>
              <input
                id="recaptcha-secret-key"
                type="password"
                value={localSettings.googleRecaptchaSecretKey}
                onChange={(e) => handleChange('googleRecaptchaSecretKey', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="6LcXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                autoComplete="new-password"
              />
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Οδηγίες:</strong> Για να ενεργοποιήσετε το Google reCAPTCHA, επισκεφτείτε το{' '}
              <a 
                href="https://www.google.com/recaptcha/admin" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Google reCAPTCHA Admin Console
              </a>{' '}
              και δημιουργήστε ένα νέο site.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-green-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Κατάσταση Συστήματος</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <SafeIcon icon={FiServer} className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">Βάση Δεδομένων</p>
            <p className="text-xs text-green-600">Συνδεδεμένη</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <SafeIcon icon={FiGlobe} className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">Ιστοσελίδα</p>
            <p className="text-xs text-green-600">Ενεργή</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <SafeIcon icon={FiShield} className="w-6 h-6 text-yellow-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">reCAPTCHA</p>
            <p className="text-xs text-yellow-600">
              {localSettings.googleRecaptchaSiteKey ? 'Ενεργό' : 'Ανενεργό'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;