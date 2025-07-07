import React, { useState } from 'react';
import { useSettings } from '../../hooks/useSettings';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiLayers, FiToggleLeft, FiToggleRight, FiEdit3, FiEye, FiEyeOff, FiMove, FiSettings } = FiIcons;

const SectionSettings = () => {
  const { sections, updateSection } = useSettings();
  const [editingSection, setEditingSection] = useState(null);

  const handleToggleSection = async (sectionId, isActive) => {
    await updateSection(sectionId, { is_active: !isActive });
  };

  const handleEditSection = (section) => {
    setEditingSection(section);
  };

  const handleSaveSection = async (sectionId, updates) => {
    await updateSection(sectionId, updates);
    setEditingSection(null);
  };

  const sectionIcons = {
    hero: '🏠',
    intro: '💡',
    features: '🔧',
    benefits: '📈',
    demo: '📷',
    contact: '📞'
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Διαχείριση Ενοτήτων</h2>
        <p className="text-gray-600 mb-8">
          Ενεργοποιήστε/απενεργοποιήστε και προσαρμόστε τις ενότητες της ιστοσελίδας σας.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sections List */}
        <div className="space-y-4">
          {sections.map((section, index) => (
            <div key={section.id} className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{sectionIcons[section.name] || '📄'}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                    <p className="text-sm text-gray-600">Θέση: {section.order_index}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleSection(section.id, section.is_active)}
                    className={`p-2 rounded-lg transition-colors ${
                      section.is_active 
                        ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                        : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                    }`}
                  >
                    <SafeIcon icon={section.is_active ? FiEye : FiEyeOff} className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleEditSection(section)}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <SafeIcon icon={FiEdit3} className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Κατάσταση</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    section.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {section.is_active ? 'Ενεργή' : 'Ανενεργή'}
                  </span>
                </div>

                {section.content && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Ρυθμίσεις:</p>
                    <div className="bg-white rounded-lg p-3 text-xs">
                      {section.content.icon && (
                        <div className="flex items-center gap-2 mb-1">
                          <span>Εικονίδιο:</span>
                          <span className="font-mono">{section.content.icon}</span>
                        </div>
                      )}
                      {section.content.background_color && (
                        <div className="flex items-center gap-2 mb-1">
                          <span>Χρώμα φόντου:</span>
                          <div 
                            className="w-4 h-4 rounded border"
                            style={{ backgroundColor: section.content.background_color }}
                          ></div>
                        </div>
                      )}
                      {section.content.layout && (
                        <div className="flex items-center gap-2">
                          <span>Layout:</span>
                          <span className="font-mono">{section.content.layout}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Section Editor */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <SafeIcon icon={FiSettings} className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              {editingSection ? `Επεξεργασία: ${editingSection.title}` : 'Επιλέξτε ενότητα για επεξεργασία'}
            </h3>
          </div>

          {editingSection ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Τίτλος Ενότητας
                </label>
                <input
                  type="text"
                  value={editingSection.title}
                  onChange={(e) => setEditingSection(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Θέση στη Σελίδα
                </label>
                <input
                  type="number"
                  value={editingSection.order_index}
                  onChange={(e) => setEditingSection(prev => ({ ...prev, order_index: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Section-specific settings */}
              {editingSection.name === 'hero' && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Ρυθμίσεις Hero Section</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL Βίντεο Φόντου
                    </label>
                    <input
                      type="url"
                      value={editingSection.content?.background_video || ''}
                      onChange={(e) => setEditingSection(prev => ({
                        ...prev,
                        content: { ...prev.content, background_video: e.target.value }
                      }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/video.mp4"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Διαφάνεια Overlay ({Math.round((editingSection.content?.overlay_opacity || 0.5) * 100)}%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={editingSection.content?.overlay_opacity || 0.5}
                      onChange={(e) => setEditingSection(prev => ({
                        ...prev,
                        content: { ...prev.content, overlay_opacity: parseFloat(e.target.value) }
                      }))}
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              {editingSection.name === 'features' && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Ρυθμίσεις Features</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Αριθμός Στηλών
                    </label>
                    <select
                      value={editingSection.content?.columns || 3}
                      onChange={(e) => setEditingSection(prev => ({
                        ...prev,
                        content: { ...prev.content, columns: parseInt(e.target.value) }
                      }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value={1}>1 Στήλη</option>
                      <option value={2}>2 Στήλες</option>
                      <option value={3}>3 Στήλες</option>
                      <option value={4}>4 Στήλες</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Layout
                    </label>
                    <select
                      value={editingSection.content?.layout || 'grid'}
                      onChange={(e) => setEditingSection(prev => ({
                        ...prev,
                        content: { ...prev.content, layout: e.target.value }
                      }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="grid">Grid</option>
                      <option value="list">List</option>
                      <option value="carousel">Carousel</option>
                    </select>
                  </div>
                </div>
              )}

              {editingSection.name === 'demo' && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Ρυθμίσεις Demo</h4>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editingSection.content?.show_video || false}
                      onChange={(e) => setEditingSection(prev => ({
                        ...prev,
                        content: { ...prev.content, show_video: e.target.checked }
                      }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="text-sm font-medium text-gray-700">
                      Εμφάνιση βίντεο demo
                    </label>
                  </div>

                  {editingSection.content?.show_video && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL Βίντεο Demo
                      </label>
                      <input
                        type="url"
                        value={editingSection.content?.video_url || ''}
                        onChange={(e) => setEditingSection(prev => ({
                          ...prev,
                          content: { ...prev.content, video_url: e.target.value }
                        }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://youtube.com/watch?v=..."
                      />
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Εικονίδιο Ενότητας
                </label>
                <input
                  type="text"
                  value={editingSection.content?.icon || ''}
                  onChange={(e) => setEditingSection(prev => ({
                    ...prev,
                    content: { ...prev.content, icon: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="π.χ. 🏠, 💡, 🔧"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => handleSaveSection(editingSection.id, editingSection)}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Αποθήκευση Αλλαγών
                </button>
                <button
                  onClick={() => setEditingSection(null)}
                  className="px-4 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Ακύρωση
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <SafeIcon icon={FiLayers} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                Επιλέξτε μια ενότητα από τη λίστα για να την επεξεργαστείτε.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SectionSettings;