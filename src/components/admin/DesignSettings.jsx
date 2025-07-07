import React, { useState } from 'react';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPalette, FiType, FiImage, FiEye, FiVideo, FiUpload } = FiIcons;

const DesignSettings = ({ settings, updateSetting }) => {
  const [localSettings, setLocalSettings] = useState({
    primaryColor: settings?.design?.primary_color || '#2563eb',
    secondaryColor: settings?.design?.secondary_color || '#16a34a',
    fontFamily: settings?.design?.font_family || 'Inter',
    heroBackgroundType: settings?.design?.hero_background_type || 'gradient',
    heroBackgroundValue: settings?.design?.hero_background_value || 'from-blue-50 to-green-50',
    heroOverlayOpacity: settings?.design?.hero_overlay_opacity || 0.5
  });

  const handleChange = (key, value) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
    updateSetting('design', key.replace(/([A-Z])/g, '_$1').toLowerCase(), value);
  };

  const fontOptions = [
    { value: 'Inter', label: 'Inter' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Open Sans', label: 'Open Sans' },
    { value: 'Poppins', label: 'Poppins' },
    { value: 'Montserrat', label: 'Montserrat' },
    { value: 'Lato', label: 'Lato' },
    { value: 'Source Sans Pro', label: 'Source Sans Pro' }
  ];

  const gradientOptions = [
    { value: 'from-blue-50 to-green-50', label: 'Μπλε προς Πράσινο' },
    { value: 'from-purple-50 to-pink-50', label: 'Μωβ προς Ροζ' },
    { value: 'from-yellow-50 to-orange-50', label: 'Κίτρινο προς Πορτοκαλί' },
    { value: 'from-gray-50 to-white', label: 'Γκρι προς Λευκό' },
    { value: 'from-indigo-50 to-blue-50', label: 'Ινδικό προς Μπλε' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Ρυθμίσεις Σχεδιασμού</h2>
        <p className="text-gray-600 mb-8">
          Προσαρμόστε την εμφάνιση και το στυλ της ιστοσελίδας σας.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Color Palette */}
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <SafeIcon icon={FiPalette} className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Παλέτα Χρωμάτων</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Κύριο Χρώμα
              </label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={localSettings.primaryColor}
                  onChange={(e) => handleChange('primaryColor', e.target.value)}
                  className="w-16 h-12 rounded-lg border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={localSettings.primaryColor}
                  onChange={(e) => handleChange('primaryColor', e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="#2563eb"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Δευτερεύον Χρώμα
              </label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={localSettings.secondaryColor}
                  onChange={(e) => handleChange('secondaryColor', e.target.value)}
                  className="w-16 h-12 rounded-lg border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={localSettings.secondaryColor}
                  onChange={(e) => handleChange('secondaryColor', e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="#16a34a"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 p-4 bg-white rounded-lg">
              <div 
                className="h-8 rounded" 
                style={{ backgroundColor: localSettings.primaryColor }}
              ></div>
              <div 
                className="h-8 rounded" 
                style={{ backgroundColor: localSettings.secondaryColor }}
              ></div>
            </div>
          </div>
        </div>

        {/* Typography */}
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <SafeIcon icon={FiType} className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Τυπογραφία</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Κύρια Γραμματοσειρά
              </label>
              <select
                value={localSettings.fontFamily}
                onChange={(e) => handleChange('fontFamily', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {fontOptions.map(font => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-4 bg-white rounded-lg">
              <p 
                className="text-lg font-semibold mb-2"
                style={{ fontFamily: localSettings.fontFamily }}
              >
                Δείγμα Κειμένου
              </p>
              <p 
                className="text-sm text-gray-600"
                style={{ fontFamily: localSettings.fontFamily }}
              >
                Αυτό είναι ένα δείγμα κειμένου με τη γραμματοσειρά {localSettings.fontFamily}.
              </p>
            </div>
          </div>
        </div>

        {/* Hero Background */}
        <div className="bg-gray-50 rounded-xl p-6 lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <SafeIcon icon={FiImage} className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Φόντο Hero Section</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Τύπος Φόντου
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="heroBackgroundType"
                    value="gradient"
                    checked={localSettings.heroBackgroundType === 'gradient'}
                    onChange={(e) => handleChange('heroBackgroundType', e.target.value)}
                    className="text-blue-600"
                  />
                  <span>Gradient</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="heroBackgroundType"
                    value="image"
                    checked={localSettings.heroBackgroundType === 'image'}
                    onChange={(e) => handleChange('heroBackgroundType', e.target.value)}
                    className="text-blue-600"
                  />
                  <span>Εικόνα</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="heroBackgroundType"
                    value="video"
                    checked={localSettings.heroBackgroundType === 'video'}
                    onChange={(e) => handleChange('heroBackgroundType', e.target.value)}
                    className="text-blue-600"
                  />
                  <span>Βίντεο</span>
                </label>
              </div>
            </div>

            {localSettings.heroBackgroundType === 'gradient' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gradient
                </label>
                <select
                  value={localSettings.heroBackgroundValue}
                  onChange={(e) => handleChange('heroBackgroundValue', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {gradientOptions.map(gradient => (
                    <option key={gradient.value} value={gradient.value}>
                      {gradient.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {localSettings.heroBackgroundType === 'image' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Εικόνας
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={localSettings.heroBackgroundValue}
                    onChange={(e) => handleChange('heroBackgroundValue', e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                  <button className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <SafeIcon icon={FiUpload} className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {localSettings.heroBackgroundType === 'video' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Βίντεο
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={localSettings.heroBackgroundValue}
                    onChange={(e) => handleChange('heroBackgroundValue', e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/video.mp4"
                  />
                  <button className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <SafeIcon icon={FiUpload} className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {(localSettings.heroBackgroundType === 'image' || localSettings.heroBackgroundType === 'video') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Διαφάνεια Overlay ({Math.round(localSettings.heroOverlayOpacity * 100)}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={localSettings.heroOverlayOpacity}
                  onChange={(e) => handleChange('heroOverlayOpacity', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <SafeIcon icon={FiEye} className="w-6 h-6 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">Προεπισκόπηση</h3>
        </div>
        
        <div className="bg-white rounded-lg p-6 border">
          <div 
            className="h-32 rounded-lg flex items-center justify-center relative overflow-hidden"
            style={{
              background: localSettings.heroBackgroundType === 'gradient' 
                ? `linear-gradient(to right, ${localSettings.heroBackgroundValue.includes('from-') ? 
                    localSettings.heroBackgroundValue.replace('from-', '').replace('to-', '').split(' ').map(c => `var(--${c})`).join(', ') : 
                    localSettings.heroBackgroundValue})` 
                : localSettings.heroBackgroundType === 'image' 
                ? `url(${localSettings.heroBackgroundValue}) center/cover`
                : localSettings.primaryColor
            }}
          >
            {(localSettings.heroBackgroundType === 'image' || localSettings.heroBackgroundType === 'video') && (
              <div 
                className="absolute inset-0 bg-black"
                style={{ opacity: localSettings.heroOverlayOpacity }}
              ></div>
            )}
            <div className="relative z-10 text-center">
              <h4 
                className="text-xl font-bold mb-2"
                style={{ 
                  fontFamily: localSettings.fontFamily,
                  color: localSettings.heroBackgroundType === 'gradient' ? '#1f2937' : '#ffffff'
                }}
              >
                Δείγμα Τίτλου
              </h4>
              <p 
                className="text-sm"
                style={{ 
                  fontFamily: localSettings.fontFamily,
                  color: localSettings.heroBackgroundType === 'gradient' ? '#6b7280' : '#e5e7eb'
                }}
              >
                Αυτό είναι ένα δείγμα κειμένου για προεπισκόπηση.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignSettings;