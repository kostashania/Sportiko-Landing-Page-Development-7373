import React, { useState, useEffect } from 'react';
import { useSettings } from '../../hooks/useSettings';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiTrash2, FiEdit3, FiMove, FiSave, FiMail, FiPhone, FiMapPin, FiLink } = FiIcons;

const ContactManager = () => {
  const { contactInfo, loadContactInfo, createContactInfo, updateContactInfo, deleteContactInfo } = useSettings();
  const [loading, setLoading] = useState(true);
  const [editingContact, setEditingContact] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState({
    type: 'email',
    value: '',
    link: '',
    icon: 'FiMail',
    order_index: 0,
    is_active: true
  });
  const [success, setSuccess] = useState('');
  const [mapUrl, setMapUrl] = useState('https://maps.google.com/?q=Χανιά,Ελλάδα');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await loadContactInfo();
      setLoading(false);
    };
    
    fetchData();
  }, [loadContactInfo]);

  useEffect(() => {
    // Find the address contact to get map URL
    const addressContact = contactInfo.find(contact => contact.type === 'address');
    if (addressContact && addressContact.link) {
      setMapUrl(addressContact.link);
    }
  }, [contactInfo]);

  const handleAddContact = async () => {
    setLoading(true);
    try {
      // Auto-generate link based on type if not provided
      let link = newContact.link;
      if (!link) {
        if (newContact.type === 'email') {
          link = `mailto:${newContact.value}`;
        } else if (newContact.type === 'phone') {
          link = `tel:${newContact.value.replace(/\s+/g, '')}`;
        } else if (newContact.type === 'address') {
          link = `https://maps.google.com/?q=${encodeURIComponent(newContact.value)}`;
        }
      }

      await createContactInfo({
        ...newContact,
        link,
        order_index: contactInfo.length + 1
      });
      setNewContact({
        type: 'email',
        value: '',
        link: '',
        icon: 'FiMail',
        order_index: 0,
        is_active: true
      });
      setShowAddForm(false);
      setSuccess('Η νέα επαφή προστέθηκε επιτυχώς!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error adding contact:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateContact = async () => {
    setLoading(true);
    try {
      // Auto-generate link based on type if not provided
      let link = editingContact.link;
      if (!link) {
        if (editingContact.type === 'email') {
          link = `mailto:${editingContact.value}`;
        } else if (editingContact.type === 'phone') {
          link = `tel:${editingContact.value.replace(/\s+/g, '')}`;
        } else if (editingContact.type === 'address') {
          link = `https://maps.google.com/?q=${encodeURIComponent(editingContact.value)}`;
        }
      }

      await updateContactInfo(editingContact.id, { ...editingContact, link });
      
      // If updating address contact, also update mapUrl
      if (editingContact.type === 'address') {
        setMapUrl(link);
      }
      
      setEditingContact(null);
      setSuccess('Η επαφή ενημερώθηκε επιτυχώς!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating contact:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContact = async (id) => {
    if (window.confirm('Είστε βέβαιοι ότι θέλετε να διαγράψετε αυτή την επαφή;')) {
      setLoading(true);
      try {
        await deleteContactInfo(id);
        setSuccess('Η επαφή διαγράφηκε επιτυχώς!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        console.error('Error deleting contact:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleMoveUp = async (index) => {
    if (index === 0) return;
    
    setLoading(true);
    try {
      const contact1 = contactInfo[index];
      const contact2 = contactInfo[index - 1];
      
      await updateContactInfo(contact1.id, { ...contact1, order_index: contact1.order_index - 1 });
      await updateContactInfo(contact2.id, { ...contact2, order_index: contact2.order_index + 1 });
      
      await loadContactInfo();
    } catch (error) {
      console.error('Error moving contact:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMoveDown = async (index) => {
    if (index === contactInfo.length - 1) return;
    
    setLoading(true);
    try {
      const contact1 = contactInfo[index];
      const contact2 = contactInfo[index + 1];
      
      await updateContactInfo(contact1.id, { ...contact1, order_index: contact1.order_index + 1 });
      await updateContactInfo(contact2.id, { ...contact2, order_index: contact2.order_index - 1 });
      
      await loadContactInfo();
    } catch (error) {
      console.error('Error moving contact:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMapUrl = async () => {
    setLoading(true);
    try {
      // Find the address contact
      const addressContact = contactInfo.find(contact => contact.type === 'address');
      if (addressContact) {
        await updateContactInfo(addressContact.id, { ...addressContact, link: mapUrl });
        setSuccess('Ο χάρτης ενημερώθηκε επιτυχώς!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Error updating map URL:', error);
    } finally {
      setLoading(false);
    }
  };

  const contactTypes = [
    { value: 'email', label: 'Email', icon: 'FiMail' },
    { value: 'phone', label: 'Τηλέφωνο', icon: 'FiPhone' },
    { value: 'address', label: 'Διεύθυνση', icon: 'FiMapPin' },
    { value: 'social', label: 'Κοινωνικά Δίκτυα', icon: 'FiLink' }
  ];

  const getIconForType = (type) => {
    const contactType = contactTypes.find(t => t.value === type);
    return contactType ? contactType.icon : 'FiLink';
  };

  const handleTypeChange = (e, setter) => {
    const type = e.target.value;
    setter(prev => ({
      ...prev,
      type,
      icon: getIconForType(type)
    }));
  };

  if (loading && contactInfo.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Φόρτωση στοιχείων επικοινωνίας...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Διαχείριση Επικοινωνίας</h2>
        <p className="text-gray-600 mb-8">
          Προσθέστε, επεξεργαστείτε και οργανώστε τα στοιχεία επικοινωνίας που εμφανίζονται στην ιστοσελίδα.
        </p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">{success}</p>
        </div>
      )}

      {/* Contact Info List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 bg-gray-50 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Στοιχεία Επικοινωνίας</h3>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <SafeIcon icon={FiPlus} className="w-5 h-5" />
            Προσθήκη Επαφής
          </button>
        </div>

        {contactInfo.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Δεν υπάρχουν στοιχεία επικοινωνίας. Πατήστε "Προσθήκη Επαφής" για να προσθέσετε το πρώτο σας στοιχείο.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {contactInfo.map((contact, index) => (
              <li key={contact.id} className={`p-6 ${!contact.is_active ? 'opacity-60' : ''}`}>
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <SafeIcon icon={FiIcons[contact.icon]} className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        {contactTypes.find(t => t.value === contact.type)?.label || 'Επαφή'}
                      </h4>
                      <p className="text-gray-600 mt-1">{contact.value}</p>
                      
                      {contact.link && (
                        <div className="flex items-center gap-2 mt-2 text-sm text-blue-600">
                          <SafeIcon icon={FiLink} className="w-4 h-4" />
                          <a href={contact.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {contact.link}
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
                      disabled={index === contactInfo.length - 1}
                      className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setEditingContact(contact)}
                      className="p-2 text-blue-600 hover:text-blue-800"
                    >
                      <SafeIcon icon={FiEdit3} className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteContact(contact.id)}
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

      {/* Google Maps URL */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <SafeIcon icon={FiMapPin} className="w-6 h-6 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-900">Χάρτης Google</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL Google Maps
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={mapUrl}
                onChange={(e) => setMapUrl(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://maps.google.com/?q=Χανιά,Ελλάδα"
              />
              <button
                onClick={handleUpdateMapUrl}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <SafeIcon icon={FiSave} className="w-5 h-5" />
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Εισάγετε το URL του Google Maps για τη διεύθυνσή σας.
            </p>
          </div>
          
          <div className="aspect-video w-full rounded-lg overflow-hidden">
            <iframe
              src={mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Add Contact Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Προσθήκη Νέας Επαφής</h3>
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
                    Τύπος Επαφής
                  </label>
                  <select
                    value={newContact.type}
                    onChange={(e) => handleTypeChange(e, setNewContact)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {contactTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Τιμή
                  </label>
                  <input
                    type={newContact.type === 'email' ? 'email' : 'text'}
                    value={newContact.value}
                    onChange={(e) => setNewContact({...newContact, value: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={
                      newContact.type === 'email' ? 'example@example.com' :
                      newContact.type === 'phone' ? '(+30) 123 4567 890' :
                      newContact.type === 'address' ? 'Οδός, Πόλη, ΤΚ' : 'Τιμή'
                    }
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Σύνδεσμος (προαιρετικό - θα δημιουργηθεί αυτόματα αν αφεθεί κενό)
                  </label>
                  <input
                    type="url"
                    value={newContact.link}
                    onChange={(e) => setNewContact({...newContact, link: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={
                      newContact.type === 'email' ? 'mailto:example@example.com' :
                      newContact.type === 'phone' ? 'tel:+301234567890' :
                      newContact.type === 'address' ? 'https://maps.google.com/?q=...' : 'https://...'
                    }
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is-active"
                    checked={newContact.is_active}
                    onChange={(e) => setNewContact({...newContact, is_active: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <label htmlFor="is-active" className="ml-2 text-sm text-gray-700">
                    Ενεργή Επαφή
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
                    onClick={handleAddContact}
                    disabled={!newContact.value.trim()}
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

      {/* Edit Contact Form */}
      {editingContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Επεξεργασία Επαφής</h3>
                <button
                  onClick={() => setEditingContact(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Τύπος Επαφής
                  </label>
                  <select
                    value={editingContact.type}
                    onChange={(e) => handleTypeChange(e, setEditingContact)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {contactTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Τιμή
                  </label>
                  <input
                    type={editingContact.type === 'email' ? 'email' : 'text'}
                    value={editingContact.value}
                    onChange={(e) => setEditingContact({...editingContact, value: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={
                      editingContact.type === 'email' ? 'example@example.com' :
                      editingContact.type === 'phone' ? '(+30) 123 4567 890' :
                      editingContact.type === 'address' ? 'Οδός, Πόλη, ΤΚ' : 'Τιμή'
                    }
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Σύνδεσμος (προαιρετικό - θα δημιουργηθεί αυτόματα αν αφεθεί κενό)
                  </label>
                  <input
                    type="url"
                    value={editingContact.link || ''}
                    onChange={(e) => setEditingContact({...editingContact, link: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={
                      editingContact.type === 'email' ? 'mailto:example@example.com' :
                      editingContact.type === 'phone' ? 'tel:+301234567890' :
                      editingContact.type === 'address' ? 'https://maps.google.com/?q=...' : 'https://...'
                    }
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="edit-is-active"
                    checked={editingContact.is_active}
                    onChange={(e) => setEditingContact({...editingContact, is_active: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <label htmlFor="edit-is-active" className="ml-2 text-sm text-gray-700">
                    Ενεργή Επαφή
                  </label>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => setEditingContact(null)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Ακύρωση
                  </button>
                  <button
                    onClick={handleUpdateContact}
                    disabled={!editingContact.value.trim()}
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

export default ContactManager;