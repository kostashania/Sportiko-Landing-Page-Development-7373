import React, { useState, useEffect } from 'react';
import { useSettings } from '../../hooks/useSettings';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUpload, FiImage, FiSave, FiEye, FiAlertCircle } = FiIcons;

const LogoSettings = () => {
  const { settings, updateSetting, uploadMedia } = useSettings();
  const [logoUrl, setLogoUrl] = useState(settings?.general?.logo_url || '/logo.svg');
  const [logoAlt, setLogoAlt] = useState(settings?.general?.logo_alt || 'Sportiko Logo');
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState('');
  const [imageError, setImageError] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  useEffect(() => {
    setLogoUrl(settings?.general?.logo_url || '/logo.svg');
    setLogoAlt(settings?.general?.logo_alt || 'Sportiko Logo');
  }, [settings]);

  const handleLogoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    setSuccess('');
    setImageError(false);
    setUploadProgress('Επικύρωση αρχείου...');

    try {
      // Validate file size and type
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('Το αρχείο είναι πολύ μεγάλο. Μέγιστο μέγεθος: 10MB');
      }

      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        throw new Error('Μη υποστηριζόμενος τύπος αρχείου. Υποστηρίζονται: JPG, PNG, GIF, WebP, SVG');
      }

      setUploadProgress('Βελτιστοποίηση εικόνας...');
      
      const { url, error } = await uploadMedia(file, 'logo');
      if (error) throw new Error(error);

      setUploadProgress('Αποθήκευση...');
      setLogoUrl(url);
      await updateSetting('general', 'logo_url', url);
      
      setSuccess('Το λογότυπο ενημερώθηκε επιτυχώς!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Upload error:', error);
      setSuccess(`Σφάλμα: ${error.message}`);
      setTimeout(() => setSuccess(''), 5000);
    } finally {
      setUploading(false);
      setUploadProgress('');
      // Clear file input
      event.target.value = '';
    }
  };

  const handleSave = async () => {
    setUploading(true);
    setSuccess('');

    try {
      await updateSetting('general', 'logo_url', logoUrl);
      await updateSetting('general', 'logo_alt', logoAlt);
      setSuccess('Οι ρυθμίσεις λογότυπου αποθηκεύτηκαν επιτυχώς!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Save error:', error);
      setSuccess('Σφάλμα κατά την αποθήκευση.');
      setTimeout(() => setSuccess(''), 3000);
    } finally {
      setUploading(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  // Create a simple fallback logo as data URI
  const fallbackLogo = "data:image/svg+xml;base64," + btoa(`
    <svg width="200" height="80" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="80" rx="8" fill="#2563eb"/>
      <text x="100" y="35" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="white" text-anchor="middle">Sportiko</text>
      <text x="100" y="55" font-family="Arial, sans-serif" font-size="12" fill="#93c5fd" text-anchor="middle">Sports Management</text>
      <circle cx="25" cy="25" r="8" fill="white" opacity="0.8"/>
      <circle cx="175" cy="55" r="6" fill="white" opacity="0.6"/>
    </svg>
  `);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Ρυθμίσεις Λογότυπου</h2>
        <p className="text-gray-600 mb-8">
          Ανεβάστε ή ενημερώστε το λογότυπο της ιστοσελίδας σας. Η εικόνα θα βελτιστοποιηθεί αυτόματα.
        </p>
      </div>

      {success && (
        <div className={`border rounded-lg p-4 ${
          success.includes('Σφάλμα') || success.includes('σφάλμα')
            ? 'bg-red-50 border-red-200'
            : 'bg-green-50 border-green-200'
        }`}>
          <div className="flex items-center gap-2">
            <SafeIcon 
              icon={success.includes('Σφάλμα') ? FiAlertCircle : FiImage} 
              className={`w-5 h-5 ${success.includes('Σφάλμα') ? 'text-red-600' : 'text-green-600'}`} 
            />
            <p className={success.includes('Σφάλμα') || success.includes('σφάλμα') ? 'text-red-800' : 'text-green-800'}>
              {success}
            </p>
          </div>
        </div>
      )}

      {uploadProgress && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <p className="text-blue-800">{uploadProgress}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Logo Upload */}
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <SafeIcon icon={FiUpload} className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Ανέβασμα Λογότυπου</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Επιλέξτε αρχείο
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={uploading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
              />
              <p className="mt-1 text-xs text-gray-500">
                Υποστηρίζονται: JPG, PNG, GIF, WebP, SVG (μέγ. 10MB)
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <strong>Αυτόματη βελτιστοποίηση:</strong> Η εικόνα θα προσαρμοστεί αυτόματα σε κατάλληλες διαστάσεις (400x200px μέγιστο) για καλύτερη απόδοση.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ή Εισάγετε URL
              </label>
              <input
                type="url"
                value={logoUrl}
                onChange={(e) => {
                  setLogoUrl(e.target.value);
                  setImageError(false);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/logo.png"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Εναλλακτικό Κείμενο (alt)
              </label>
              <input
                type="text"
                value={logoAlt}
                onChange={(e) => setLogoAlt(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Sportiko Logo"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={uploading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <SafeIcon icon={FiSave} className="w-5 h-5" />
              {uploading ? 'Αποθήκευση...' : 'Αποθήκευση Αλλαγών'}
            </button>
          </div>
        </div>

        {/* Logo Preview */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <SafeIcon icon={FiEye} className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Προεπισκόπηση Λογότυπου</h3>
          </div>

          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="bg-gray-50 p-8 rounded-lg w-full flex items-center justify-center min-h-32">
              {imageError ? (
                <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                  <SafeIcon icon={FiImage} className="w-16 h-16 mb-4" />
                  <p className="text-sm text-center">Το λογότυπο δεν μπόρεσε να φορτωθεί</p>
                  <p className="text-xs text-center mt-2">Χρησιμοποιείται το προεπιλεγμένο λογότυπο</p>
                  <img
                    src={fallbackLogo}
                    alt="Fallback Logo"
                    className="max-h-20 max-w-full object-contain mt-4"
                  />
                </div>
              ) : (
                <img
                  src={logoUrl}
                  alt={logoAlt}
                  className="max-h-32 max-w-full object-contain"
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                />
              )}
            </div>

            <div className="text-sm text-gray-600 text-center">
              <p>Προτεινόμενες διαστάσεις: 400x200 pixels</p>
              <p>Προτεινόμενοι τύποι: PNG, SVG (με διαφάνεια)</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg w-full">
              <p className="text-blue-800 text-sm">
                <strong>Συμβουλή:</strong> Για καλύτερα αποτελέσματα, χρησιμοποιήστε εικόνα με διαφανές φόντο. Η εικόνα θα βελτιστοποιηθεί αυτόματα για γρήγορη φόρτωση.
              </p>
            </div>

            {/* Logo URL Display */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Τρέχον URL Λογότυπου:
              </label>
              <div className="bg-gray-100 p-3 rounded-lg">
                <code className="text-xs text-gray-800 break-all">{logoUrl}</code>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logo Usage Examples */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Παραδείγματα Χρήσης</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Header Example */}
          <div className="bg-white p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Header Navigation</h4>
            <div className="border rounded p-2 bg-gray-50 flex items-center gap-2">
              {imageError ? (
                <img src={fallbackLogo} alt={logoAlt} className="h-8" />
              ) : (
                <img 
                  src={logoUrl} 
                  alt={logoAlt} 
                  className="h-8" 
                  onError={handleImageError}
                />
              )}
              <span className="text-xs text-gray-600">Menu items...</span>
            </div>
          </div>

          {/* Hero Example */}
          <div className="bg-white p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Hero Section</h4>
            <div className="border rounded p-4 bg-blue-600 text-center">
              {imageError ? (
                <img src={fallbackLogo} alt={logoAlt} className="h-12 mx-auto mb-2" />
              ) : (
                <img 
                  src={logoUrl} 
                  alt={logoAlt} 
                  className="h-12 mx-auto mb-2" 
                  onError={handleImageError}
                />
              )}
              <p className="text-xs text-white">Hero content...</p>
            </div>
          </div>

          {/* Footer Example */}
          <div className="bg-white p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Footer</h4>
            <div className="border rounded p-2 bg-gray-800 text-center">
              {imageError ? (
                <img src={fallbackLogo} alt={logoAlt} className="h-6 mx-auto" />
              ) : (
                <img 
                  src={logoUrl} 
                  alt={logoAlt} 
                  className="h-6 mx-auto" 
                  onError={handleImageError}
                />
              )}
              <p className="text-xs text-gray-300 mt-1">© 2024 Company</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoSettings;