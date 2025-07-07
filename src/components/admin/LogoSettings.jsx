import React, { useState, useEffect } from 'react';
import { useSettings } from '../../hooks/useSettings';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUpload, FiImage, FiSave, FiEye } = FiIcons;

const LogoSettings = () => {
  const { settings, updateSetting, uploadMedia } = useSettings();
  const [logoUrl, setLogoUrl] = useState(settings?.general?.logo_url || 'https://via.placeholder.com/200x80?text=Sportiko+Logo');
  const [logoAlt, setLogoAlt] = useState(settings?.general?.logo_alt || 'Sportiko Logo');
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setLogoUrl(settings?.general?.logo_url || 'https://via.placeholder.com/200x80?text=Sportiko+Logo');
    setLogoAlt(settings?.general?.logo_alt || 'Sportiko Logo');
  }, [settings]);

  const handleLogoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setUploading(true);
    setSuccess('');
    
    try {
      const { url, error } = await uploadMedia(file, 'logo');
      if (error) throw error;
      
      setLogoUrl(url);
      await updateSetting('general', 'logo_url', url);
      setSuccess('Το λογότυπο ενημερώθηκε επιτυχώς!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
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
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Ρυθμίσεις Λογότυπου</h2>
        <p className="text-gray-600 mb-8">
          Ανεβάστε ή ενημερώστε το λογότυπο της ιστοσελίδας σας.
        </p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">{success}</p>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ή Εισάγετε URL
              </label>
              <input 
                type="url" 
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
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
            <div className="bg-gray-50 p-8 rounded-lg w-full flex items-center justify-center">
              <img 
                src={logoUrl} 
                alt={logoAlt} 
                className="max-h-32 max-w-full object-contain"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/200x80?text=Logo+Error';
                }}
              />
            </div>
            
            <div className="text-sm text-gray-600 text-center">
              <p>Προτεινόμενες διαστάσεις: 200x80 pixels</p>
              <p>Προτεινόμενοι τύποι: PNG, SVG (με διαφάνεια)</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg w-full">
              <p className="text-blue-800 text-sm">
                <strong>Συμβουλή:</strong> Για καλύτερα αποτελέσματα, χρησιμοποιήστε εικόνα με διαφανές φόντο.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoSettings;