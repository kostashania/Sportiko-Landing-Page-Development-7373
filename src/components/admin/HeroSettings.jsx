import React, { useState, useEffect } from 'react';
import { useSettings } from '../../hooks/useSettings';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiEdit3, FiSave, FiEye, FiLink, FiImage, FiUpload } = FiIcons;

const HeroSettings = () => {
  const { settings, updateSetting, uploadMedia, loadSettings } = useSettings();
  const [heroData, setHeroData] = useState({
    title: settings?.content?.hero_title || '👉 Η Ψηφιακή Πλατφόρμα για τον Αθλητικό σας Σύλλογο',
    subtitle: settings?.content?.hero_subtitle || 'Διαχειρίσου έσοδα, έξοδα, εγκρίσεις, ταμείο και ρόλους με διαφάνεια και επαγγελματισμό – όλα από ένα σημείο.',
    ctaPrimary: settings?.content?.hero_cta_primary || '✅ Ξεκινήστε Δωρεάν',
    ctaSecondary: settings?.content?.hero_cta_secondary || '💼 Δείτε Παρουσίαση',
    ctaPrimaryUrl: settings?.content?.hero_cta_primary_url || 'https://spiffy-nougat-80a628.netlify.app',
    ctaSecondaryUrl: settings?.content?.hero_cta_secondary_url || '#demo',
    backgroundImage: settings?.content?.hero_background_image || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
  });
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState('');

  // Load settings when component mounts
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    if (settings?.content) {
      setHeroData({
        title: settings.content.hero_title || heroData.title,
        subtitle: settings.content.hero_subtitle || heroData.subtitle,
        ctaPrimary: settings.content.hero_cta_primary || heroData.ctaPrimary,
        ctaSecondary: settings.content.hero_cta_secondary || heroData.ctaSecondary,
        ctaPrimaryUrl: settings.content.hero_cta_primary_url || heroData.ctaPrimaryUrl,
        ctaSecondaryUrl: settings.content.hero_cta_secondary_url || heroData.ctaSecondaryUrl,
        backgroundImage: settings.content.hero_background_image || heroData.backgroundImage,
      });
    }
  }, [settings]);

  const handleChange = (key, value) => {
    setHeroData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setUploading(true);
    setSuccess('');
    
    try {
      console.log('Saving hero settings:', heroData);
      
      // Save all hero settings one by one
      const savePromises = Object.keys(heroData).map(async (key) => {
        const settingKey = `hero_${key.toLowerCase()}`;
        console.log(`Saving ${settingKey}:`, heroData[key]);
        return await updateSetting('content', settingKey, heroData[key]);
      });

      const results = await Promise.all(savePromises);
      
      // Check for any errors
      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        throw new Error('Some settings failed to save');
      }

      setSuccess('Οι ρυθμίσεις του Hero Section αποθηκεύτηκαν επιτυχώς!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Save error:', error);
      setSuccess(`Σφάλμα: ${error.message}`);
      setTimeout(() => setSuccess(''), 5000);
    } finally {
      setUploading(false);
    }
  };

  const handleBackgroundUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    setSuccess('');
    
    try {
      const { url, error } = await uploadMedia(file, 'hero');
      if (error) throw new Error(error);

      handleChange('backgroundImage', url);
      
      // Save the background image URL to settings immediately
      await updateSetting('content', 'hero_background_image', url);

      setSuccess('Η εικόνα φόντου ενημερώθηκε επιτυχώς!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Upload error:', error);
      setSuccess(`Σφάλμα: ${error.message}`);
      setTimeout(() => setSuccess(''), 5000);
    } finally {
      setUploading(false);
      // Clear file input
      event.target.value = '';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Ρυθμίσεις Hero Section</h2>
        <p className="text-gray-600 mb-8">
          Προσαρμόστε το κύριο τμήμα της αρχικής σελίδας.
        </p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hero Content */}
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <SafeIcon icon={FiEdit3} className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Περιεχόμενο Hero</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Τίτλος
              </label>
              <textarea
                value={heroData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                rows="2"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Εισάγετε τον τίτλο του hero section"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Υπότιτλος
              </label>
              <textarea
                value={heroData.subtitle}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Εισάγετε τον υπότιτλο του hero section"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Κείμενο Κύριου Κουμπιού (CTA)
              </label>
              <input
                type="text"
                value={heroData.ctaPrimary}
                onChange={(e) => handleChange('ctaPrimary', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="π.χ. Ξεκινήστε Δωρεάν"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Κύριου Κουμπιού
              </label>
              <input
                type="text"
                value={heroData.ctaPrimaryUrl}
                onChange={(e) => handleChange('ctaPrimaryUrl', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/signup"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Κείμενο Δευτερεύοντος Κουμπιού
              </label>
              <input
                type="text"
                value={heroData.ctaSecondary}
                onChange={(e) => handleChange('ctaSecondary', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="π.χ. Δείτε Παρουσίαση"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Δευτερεύοντος Κουμπιού
              </label>
              <input
                type="text"
                value={heroData.ctaSecondaryUrl}
                onChange={(e) => handleChange('ctaSecondaryUrl', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/demo"
              />
            </div>
          </div>
        </div>

        {/* Hero Background */}
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <SafeIcon icon={FiImage} className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Εικόνα Φόντου</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Εικόνας Φόντου
              </label>
              <input
                type="text"
                value={heroData.backgroundImage}
                onChange={(e) => handleChange('backgroundImage', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/background.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ή Ανεβάστε Νέα Εικόνα
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleBackgroundUpload}
                disabled={uploading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Προεπισκόπηση Φόντου</h4>
              <div className="aspect-video w-full rounded-lg overflow-hidden">
                <img
                  src={heroData.backgroundImage}
                  alt="Hero background"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/800x400?text=Background+Image';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <SafeIcon icon={FiEye} className="w-6 h-6 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Προεπισκόπηση Hero Section</h3>
        </div>

        <div
          className="relative rounded-xl overflow-hidden p-8 flex flex-col items-center justify-center"
          style={{
            backgroundImage: `url(${heroData.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '300px'
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="relative z-10 text-center text-white max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">{heroData.title}</h1>
            <p className="text-lg mb-6">{heroData.subtitle}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-6 py-3 bg-green-600 rounded-lg font-semibold">
                {heroData.ctaPrimary}
              </button>
              <button className="px-6 py-3 bg-blue-600 rounded-lg font-semibold">
                {heroData.ctaSecondary}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={uploading}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <SafeIcon icon={FiSave} className="w-5 h-5" />
          {uploading ? 'Αποθήκευση...' : 'Αποθήκευση Όλων των Αλλαγών'}
        </button>
      </div>
    </div>
  );
};

export default HeroSettings;