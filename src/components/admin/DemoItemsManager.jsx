import React, { useState, useEffect } from 'react';
import { useSettings } from '../../hooks/useSettings';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiTrash2, FiEdit3, FiMove, FiSave, FiEye, FiLink, FiImage, FiUpload } = FiIcons;

const DemoItemsManager = () => {
  const { demoItems, loadDemoItems, createDemoItem, updateDemoItem, deleteDemoItem, uploadMedia } = useSettings();
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    image_url: '',
    link_url: '',
    description: '',
    icon: 'FiMonitor',
    order_index: 0,
    is_active: true
  });
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await loadDemoItems();
      setLoading(false);
    };
    
    fetchData();
  }, [loadDemoItems]);

  const handleAddItem = async () => {
    setLoading(true);
    try {
      await createDemoItem({
        ...newItem,
        order_index: demoItems.length + 1
      });
      setNewItem({
        title: '',
        image_url: '',
        link_url: '',
        description: '',
        icon: 'FiMonitor',
        order_index: 0,
        is_active: true
      });
      setShowAddForm(false);
      setSuccess('Το νέο στοιχείο προστέθηκε επιτυχώς!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error adding demo item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateItem = async () => {
    setLoading(true);
    try {
      await updateDemoItem(editingItem.id, editingItem);
      setEditingItem(null);
      setSuccess('Το στοιχείο ενημερώθηκε επιτυχώς!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating demo item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm('Είστε βέβαιοι ότι θέλετε να διαγράψετε αυτό το στοιχείο;')) {
      setLoading(true);
      try {
        await deleteDemoItem(id);
        setSuccess('Το στοιχείο διαγράφηκε επιτυχώς!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        console.error('Error deleting demo item:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleMoveUp = async (index) => {
    if (index === 0) return;
    
    setLoading(true);
    try {
      const item1 = demoItems[index];
      const item2 = demoItems[index - 1];
      
      await updateDemoItem(item1.id, { ...item1, order_index: item1.order_index - 1 });
      await updateDemoItem(item2.id, { ...item2, order_index: item2.order_index + 1 });
      
      await loadDemoItems();
    } catch (error) {
      console.error('Error moving demo item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMoveDown = async (index) => {
    if (index === demoItems.length - 1) return;
    
    setLoading(true);
    try {
      const item1 = demoItems[index];
      const item2 = demoItems[index + 1];
      
      await updateDemoItem(item1.id, { ...item1, order_index: item1.order_index + 1 });
      await updateDemoItem(item2.id, { ...item2, order_index: item2.order_index - 1 });
      
      await loadDemoItems();
    } catch (error) {
      console.error('Error moving demo item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event, itemSetter) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const { url, error } = await uploadMedia(file, 'demo');
      if (error) throw error;
      
      itemSetter(prev => ({ ...prev, image_url: url }));
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const iconOptions = [
    'FiMonitor', 'FiSmartphone', 'FiTablet', 'FiImage', 'FiVideo',
    'FiLayout', 'FiGrid', 'FiList', 'FiMenu', 'FiSliders'
  ];

  if (loading && demoItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Φόρτωση στοιχείων demo...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Διαχείριση Demo / Εικόνων</h2>
        <p className="text-gray-600 mb-8">
          Προσθέστε, επεξεργαστείτε και οργανώστε τα demo στοιχεία και τις εικόνες που εμφανίζονται στην ιστοσελίδα.
        </p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">{success}</p>
        </div>
      )}

      {/* Demo Items List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 bg-gray-50 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Λίστα Demo / Εικόνων</h3>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <SafeIcon icon={FiPlus} className="w-5 h-5" />
            Προσθήκη Στοιχείου
          </button>
        </div>

        {demoItems.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Δεν υπάρχουν demo στοιχεία. Πατήστε "Προσθήκη Στοιχείου" για να προσθέσετε το πρώτο σας στοιχείο.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {demoItems.map((item, index) => (
              <div key={item.id} className={`bg-gray-50 rounded-xl overflow-hidden shadow-lg ${!item.is_active ? 'opacity-60' : ''}`}>
                <div className="aspect-square w-full bg-gray-200 relative">
                  <img 
                    src={item.image_url} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                    }}
                  />
                  <div className="absolute top-2 right-2 flex gap-1 bg-white bg-opacity-80 rounded-lg p-1">
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === demoItems.length - 1}
                      className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setEditingItem(item)}
                      className="p-1 text-blue-600 hover:text-blue-800"
                    >
                      <SafeIcon icon={FiEdit3} className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <SafeIcon icon={FiTrash2} className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <SafeIcon icon={FiIcons[item.icon]} className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-gray-900">{item.title}</h4>
                  </div>
                  
                  {item.description && (
                    <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                  )}
                  
                  {item.link_url && (
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <SafeIcon icon={FiLink} className="w-4 h-4" />
                      <a href={item.link_url} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                        {item.link_url}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Demo Item Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Προσθήκη Νέου Demo Στοιχείου</h3>
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
                    value={newItem.title}
                    onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="π.χ. Καρτέλα Ταμείου"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Εικόνα
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={newItem.image_url}
                      onChange={(e) => setNewItem({...newItem, image_url: e.target.value})}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/image.jpg"
                    />
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, setNewItem)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <button
                        className="h-full px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        disabled={uploading}
                      >
                        <SafeIcon icon={FiUpload} className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  {newItem.image_url && (
                    <div className="mt-2 p-2 bg-gray-100 rounded-lg">
                      <img 
                        src={newItem.image_url} 
                        alt="Preview" 
                        className="h-32 mx-auto object-contain"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                        }}
                      />
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Εικονίδιο
                  </label>
                  <select
                    value={newItem.icon}
                    onChange={(e) => setNewItem({...newItem, icon: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {iconOptions.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Περιγραφή (προαιρετικό)
                  </label>
                  <textarea
                    value={newItem.description}
                    onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                    rows="2"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Σύντομη περιγραφή..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL Συνδέσμου (προαιρετικό)
                  </label>
                  <input
                    type="url"
                    value={newItem.link_url}
                    onChange={(e) => setNewItem({...newItem, link_url: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/demo"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is-active"
                    checked={newItem.is_active}
                    onChange={(e) => setNewItem({...newItem, is_active: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <label htmlFor="is-active" className="ml-2 text-sm text-gray-700">
                    Ενεργό Στοιχείο
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
                    onClick={handleAddItem}
                    disabled={!newItem.title.trim() || !newItem.image_url.trim()}
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

      {/* Edit Demo Item Form */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Επεξεργασία Demo Στοιχείου</h3>
                <button
                  onClick={() => setEditingItem(null)}
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
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="π.χ. Καρτέλα Ταμείου"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Εικόνα
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={editingItem.image_url}
                      onChange={(e) => setEditingItem({...editingItem, image_url: e.target.value})}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/image.jpg"
                    />
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, setEditingItem)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <button
                        className="h-full px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        disabled={uploading}
                      >
                        <SafeIcon icon={FiUpload} className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  {editingItem.image_url && (
                    <div className="mt-2 p-2 bg-gray-100 rounded-lg">
                      <img 
                        src={editingItem.image_url} 
                        alt="Preview" 
                        className="h-32 mx-auto object-contain"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                        }}
                      />
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Εικονίδιο
                  </label>
                  <select
                    value={editingItem.icon}
                    onChange={(e) => setEditingItem({...editingItem, icon: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {iconOptions.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Περιγραφή (προαιρετικό)
                  </label>
                  <textarea
                    value={editingItem.description || ''}
                    onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                    rows="2"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Σύντομη περιγραφή..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL Συνδέσμου (προαιρετικό)
                  </label>
                  <input
                    type="url"
                    value={editingItem.link_url || ''}
                    onChange={(e) => setEditingItem({...editingItem, link_url: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/demo"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="edit-is-active"
                    checked={editingItem.is_active}
                    onChange={(e) => setEditingItem({...editingItem, is_active: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <label htmlFor="edit-is-active" className="ml-2 text-sm text-gray-700">
                    Ενεργό Στοιχείο
                  </label>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => setEditingItem(null)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Ακύρωση
                  </button>
                  <button
                    onClick={handleUpdateItem}
                    disabled={!editingItem.title.trim() || !editingItem.image_url.trim()}
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

export default DemoItemsManager;