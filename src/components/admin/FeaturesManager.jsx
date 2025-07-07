import React, { useState, useEffect } from 'react';
import { useSettings } from '../../hooks/useSettings';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiTrash2, FiEdit3, FiMove, FiSave, FiEye, FiLink } = FiIcons;

const FeaturesManager = () => {
  const { features, loadFeatures, createFeature, updateFeature, deleteFeature } = useSettings();
  const [loading, setLoading] = useState(true);
  const [editingFeature, setEditingFeature] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFeature, setNewFeature] = useState({
    title: '',
    icon: 'FiStar',
    description: '',
    image_url: '',
    link_url: '',
    order_index: 0,
    is_active: true
  });
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await loadFeatures();
      setLoading(false);
    };
    
    fetchData();
  }, [loadFeatures]);

  const handleAddFeature = async () => {
    setLoading(true);
    try {
      await createFeature({
        ...newFeature,
        order_index: features.length + 1
      });
      setNewFeature({
        title: '',
        icon: 'FiStar',
        description: '',
        image_url: '',
        link_url: '',
        order_index: 0,
        is_active: true
      });
      setShowAddForm(false);
      setSuccess('Η νέα λειτουργία προστέθηκε επιτυχώς!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error adding feature:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateFeature = async () => {
    setLoading(true);
    try {
      await updateFeature(editingFeature.id, editingFeature);
      setEditingFeature(null);
      setSuccess('Η λειτουργία ενημερώθηκε επιτυχώς!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating feature:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFeature = async (id) => {
    if (window.confirm('Είστε βέβαιοι ότι θέλετε να διαγράψετε αυτή τη λειτουργία;')) {
      setLoading(true);
      try {
        await deleteFeature(id);
        setSuccess('Η λειτουργία διαγράφηκε επιτυχώς!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        console.error('Error deleting feature:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleMoveUp = async (index) => {
    if (index === 0) return;
    
    setLoading(true);
    try {
      const feature1 = features[index];
      const feature2 = features[index - 1];
      
      await updateFeature(feature1.id, { ...feature1, order_index: feature1.order_index - 1 });
      await updateFeature(feature2.id, { ...feature2, order_index: feature2.order_index + 1 });
      
      await loadFeatures();
    } catch (error) {
      console.error('Error moving feature:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMoveDown = async (index) => {
    if (index === features.length - 1) return;
    
    setLoading(true);
    try {
      const feature1 = features[index];
      const feature2 = features[index + 1];
      
      await updateFeature(feature1.id, { ...feature1, order_index: feature1.order_index + 1 });
      await updateFeature(feature2.id, { ...feature2, order_index: feature2.order_index - 1 });
      
      await loadFeatures();
    } catch (error) {
      console.error('Error moving feature:', error);
    } finally {
      setLoading(false);
    }
  };

  const iconOptions = [
    'FiDollarSign', 'FiUsers', 'FiCheckCircle', 'FiBarChart3', 'FiLink',
    'FiShield', 'FiStar', 'FiClock', 'FiSettings', 'FiTrendingUp'
  ];

  if (loading && features.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Φόρτωση λειτουργιών...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Διαχείριση Λειτουργιών</h2>
        <p className="text-gray-600 mb-8">
          Προσθέστε, επεξεργαστείτε και οργανώστε τις λειτουργίες που εμφανίζονται στην ιστοσελίδα σας.
        </p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">{success}</p>
        </div>
      )}

      {/* Features List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 bg-gray-50 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Λίστα Λειτουργιών</h3>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <SafeIcon icon={FiPlus} className="w-5 h-5" />
            Προσθήκη Λειτουργίας
          </button>
        </div>

        {features.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Δεν υπάρχουν λειτουργίες. Πατήστε "Προσθήκη Λειτουργίας" για να προσθέσετε την πρώτη σας λειτουργία.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {features.map((feature, index) => (
              <li key={feature.id} className={`p-6 ${!feature.is_active ? 'opacity-60' : ''}`}>
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <SafeIcon icon={FiIcons[feature.icon]} className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{feature.title}</h4>
                      <p className="text-gray-600 mt-1">{feature.description}</p>
                      
                      {feature.link_url && (
                        <div className="flex items-center gap-2 mt-2 text-sm text-blue-600">
                          <SafeIcon icon={FiLink} className="w-4 h-4" />
                          <a href={feature.link_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {feature.link_url}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === features.length - 1}
                      className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setEditingFeature(feature)}
                      className="p-2 text-blue-600 hover:text-blue-800"
                    >
                      <SafeIcon icon={FiEdit3} className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteFeature(feature.id)}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <SafeIcon icon={FiTrash2} className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add Feature Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Προσθήκη Νέας Λειτουργίας</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Τίτλος
                  </label>
                  <input
                    type="text"
                    value={newFeature.title}
                    onChange={(e) => setNewFeature({...newFeature, title: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="π.χ. Καταγραφή Εσόδων & Εξόδων"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Εικονίδιο
                  </label>
                  <select
                    value={newFeature.icon}
                    onChange={(e) => setNewFeature({...newFeature, icon: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {iconOptions.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Περιγραφή
                  </label>
                  <textarea
                    value={newFeature.description}
                    onChange={(e) => setNewFeature({...newFeature, description: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Περιγράψτε αυτή τη λειτουργία..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL Συνδέσμου (προαιρετικό)
                  </label>
                  <input
                    type="url"
                    value={newFeature.link_url}
                    onChange={(e) => setNewFeature({...newFeature, link_url: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/feature"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL Εικόνας (προαιρετικό)
                  </label>
                  <input
                    type="url"
                    value={newFeature.image_url}
                    onChange={(e) => setNewFeature({...newFeature, image_url: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is-active"
                    checked={newFeature.is_active}
                    onChange={(e) => setNewFeature({...newFeature, is_active: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <label htmlFor="is-active" className="ml-2 text-sm text-gray-700">
                    Ενεργή Λειτουργία
                  </label>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Ακύρωση
                  </button>
                  <button
                    onClick={handleAddFeature}
                    disabled={!newFeature.title.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <SafeIcon icon={FiPlus} className="w-5 h-5" />
                    Προσθήκη
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Feature Form */}
      {editingFeature && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Επεξεργασία Λειτουργίας</h3>
                <button
                  onClick={() => setEditingFeature(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Τίτλος
                  </label>
                  <input
                    type="text"
                    value={editingFeature.title}
                    onChange={(e) => setEditingFeature({...editingFeature, title: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="π.χ. Καταγραφή Εσόδων & Εξόδων"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Εικονίδιο
                  </label>
                  <select
                    value={editingFeature.icon}
                    onChange={(e) => setEditingFeature({...editingFeature, icon: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {iconOptions.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Περιγραφή
                  </label>
                  <textarea
                    value={editingFeature.description}
                    onChange={(e) => setEditingFeature({...editingFeature, description: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Περιγράψτε αυτή τη λειτουργία..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL Συνδέσμου (προαιρετικό)
                  </label>
                  <input
                    type="url"
                    value={editingFeature.link_url || ''}
                    onChange={(e) => setEditingFeature({...editingFeature, link_url: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/feature"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL Εικόνας (προαιρετικό)
                  </label>
                  <input
                    type="url"
                    value={editingFeature.image_url || ''}
                    onChange={(e) => setEditingFeature({...editingFeature, image_url: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="edit-is-active"
                    checked={editingFeature.is_active}
                    onChange={(e) => setEditingFeature({...editingFeature, is_active: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <label htmlFor="edit-is-active" className="ml-2 text-sm text-gray-700">
                    Ενεργή Λειτουργία
                  </label>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => setEditingFeature(null)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Ακύρωση
                  </button>
                  <button
                    onClick={handleUpdateFeature}
                    disabled={!editingFeature.title.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <SafeIcon icon={FiSave} className="w-5 h-5" />
                    Αποθήκευση
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturesManager;