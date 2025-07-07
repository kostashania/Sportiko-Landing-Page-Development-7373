import React, { useState } from 'react';
import { useSettings } from '../../hooks/useSettings';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiImage, FiVideo, FiUpload, FiTrash2, FiEye, FiCopy, FiFolder } = FiIcons;

const MediaLibrary = () => {
  const { mediaLibrary, uploadMedia, loadMediaLibrary } = useSettings();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const categories = [
    { value: 'all', label: 'Όλα' },
    { value: 'hero', label: 'Hero' },
    { value: 'features', label: 'Features' },
    { value: 'demo', label: 'Demo' },
    { value: 'general', label: 'Γενικά' }
  ];

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      await uploadMedia(file, selectedCategory === 'all' ? 'general' : selectedCategory);
      event.target.value = '';
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    alert('URL αντιγράφηκε στο clipboard!');
  };

  const filteredMedia = mediaLibrary.filter(media => 
    selectedCategory === 'all' || media.category === selectedCategory
  );

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return FiImage;
    if (type.startsWith('video/')) return FiVideo;
    return FiFolder;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Βιβλιοθήκη Μέσων</h2>
        <p className="text-gray-600 mb-8">
          Διαχειριστείτε τις εικόνες, βίντεο και άλλα αρχεία της ιστοσελίδας σας.
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <SafeIcon icon={FiUpload} className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Μεταφόρτωση Αρχείων</h3>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Κατηγορία
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.filter(cat => cat.value !== 'all').map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Επιλογή Αρχείου
            </label>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>

        {uploading && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800">Μεταφόρτωση αρχείου...</p>
          </div>
        )}
      </div>

      {/* Filter Section */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category.value}
            onClick={() => setSelectedCategory(category.value)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === category.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMedia.map((media) => (
          <div key={media.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="aspect-square bg-gray-100 flex items-center justify-center">
              {media.type === 'image' ? (
                <img 
                  src={media.url} 
                  alt={media.alt_text || media.filename}
                  className="w-full h-full object-cover"
                />
              ) : (
                <SafeIcon icon={getFileIcon(media.type)} className="w-16 h-16 text-gray-400" />
              )}
            </div>
            
            <div className="p-4">
              <h4 className="font-semibold text-gray-900 mb-2 truncate">
                {media.filename}
              </h4>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Τύπος:</span>
                  <span className="font-medium">{media.type}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Κατηγορία:</span>
                  <span className="font-medium">{media.category}</span>
                </div>
                
                {media.size_bytes && (
                  <div className="flex items-center justify-between">
                    <span>Μέγεθος:</span>
                    <span className="font-medium">{formatFileSize(media.size_bytes)}</span>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setSelectedFile(media)}
                  className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                >
                  <SafeIcon icon={FiEye} className="w-4 h-4 mx-auto" />
                </button>
                
                <button
                  onClick={() => handleCopyUrl(media.url)}
                  className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                >
                  <SafeIcon icon={FiCopy} className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMedia.length === 0 && (
        <div className="text-center py-12">
          <SafeIcon icon={FiImage} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {selectedCategory === 'all' 
              ? 'Δεν υπάρχουν αρχεία στη βιβλιοθήκη μέσων.'
              : `Δεν υπάρχουν αρχεία στην κατηγορία "${categories.find(c => c.value === selectedCategory)?.label}".`
            }
          </p>
        </div>
      )}

      {/* File Preview Modal */}
      {selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedFile.filename}
                </h3>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="mb-4">
                {selectedFile.type === 'image' ? (
                  <img 
                    src={selectedFile.url} 
                    alt={selectedFile.alt_text || selectedFile.filename}
                    className="max-w-full h-auto rounded-lg"
                  />
                ) : (
                  <div className="bg-gray-100 rounded-lg p-8 text-center">
                    <SafeIcon icon={getFileIcon(selectedFile.type)} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">{selectedFile.filename}</p>
                  </div>
                )}
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">URL:</span>
                    <input 
                      type="text" 
                      value={selectedFile.url} 
                      readOnly 
                      className="w-full mt-1 px-3 py-2 bg-white border border-gray-300 rounded text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-gray-600">Τύπος:</span>
                    <p className="font-medium">{selectedFile.type}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Κατηγορία:</span>
                    <p className="font-medium">{selectedFile.category}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Ημερομηνία:</span>
                    <p className="font-medium">
                      {new Date(selectedFile.created_at).toLocaleDateString('el-GR')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;