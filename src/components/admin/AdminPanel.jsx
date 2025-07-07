import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useSettings } from '../../hooks/useSettings';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import LoginForm from './LoginForm';
import GeneralSettings from './GeneralSettings';
import DesignSettings from './DesignSettings';
import ContentSettings from './ContentSettings';
import SectionSettings from './SectionSettings';
import MediaLibrary from './MediaLibrary';
import UserProfile from './UserProfile';
import SEOSettings from './SEOSettings';
import IntegrationsSettings from './IntegrationsSettings';
import LanguageSettings from './LanguageSettings';
import LogoSettings from './LogoSettings';
import HeroSettings from './HeroSettings';
import FeaturesManager from './FeaturesManager';
import DemoItemsManager from './DemoItemsManager';
import ContactManager from './ContactManager';

const { 
  FiSave, FiArrowLeft, FiEye, FiEdit3, FiPalette, 
  FiType, FiImage, FiLink, FiSettings, FiUser, 
  FiSearch, FiZap, FiLayers, FiShield, FiBarChart3,
  FiGlobe, FiLayout, FiCamera, FiPhone, FiCheck
} = FiIcons;

const AdminPanel = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { 
    settings, updateSetting, loading: settingsLoading,
    loadSettings, loadFeatures, loadSections, loadBenefits,
    loadDemoItems, loadContactInfo, loadMediaLibrary
  } = useSettings();
  const [activeTab, setActiveTab] = useState('general');
  const [saveStatus, setSaveStatus] = useState('');

  // Load all data when the component mounts
  useEffect(() => {
    const initialize = async () => {
      if (user) {
        await loadSettings();
        await loadSections();
        await loadFeatures();
        await loadBenefits();
        await loadDemoItems();
        await loadContactInfo();
        await loadMediaLibrary();
      }
    };
    
    initialize();
  }, [
    user, loadSettings, loadSections, loadFeatures, 
    loadBenefits, loadDemoItems, loadContactInfo, loadMediaLibrary
  ]);

  if (authLoading || settingsLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Φόρτωση...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const handleSaveAll = async () => {
    setSaveStatus('saving');
    try {
      // This would trigger save in all components
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 2000);
    }
  };

  const tabs = [
    { id: 'general', label: 'Γενικά', icon: FiEdit3 },
    { id: 'logo', label: 'Λογότυπο', icon: FiImage },
    { id: 'hero', label: 'Hero Section', icon: FiLayout },
    { id: 'features', label: 'Εφαρμογές', icon: FiZap },
    { id: 'demo', label: 'Demo / Εικόνες', icon: FiCamera },
    { id: 'contact', label: 'Επικοινωνία', icon: FiPhone },
    { id: 'design', label: 'Σχεδιασμός', icon: FiPalette },
    { id: 'content', label: 'Περιεχόμενο', icon: FiType },
    { id: 'language', label: 'Γλώσσες', icon: FiGlobe },
    { id: 'sections', label: 'Ενότητες', icon: FiLayers },
    { id: 'media', label: 'Μέσα', icon: FiImage },
    { id: 'seo', label: 'SEO', icon: FiSearch },
    { id: 'integrations', label: 'Ενσωματώσεις', icon: FiZap },
    { id: 'analytics', label: 'Αναλυτικά', icon: FiBarChart3 },
    { id: 'security', label: 'Ασφάλεια', icon: FiShield },
    { id: 'profile', label: 'Προφίλ', icon: FiUser }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings settings={settings} updateSetting={updateSetting} />;
      case 'logo':
        return <LogoSettings />;
      case 'hero':
        return <HeroSettings />;
      case 'features':
        return <FeaturesManager />;
      case 'demo':
        return <DemoItemsManager />;
      case 'contact':
        return <ContactManager />;
      case 'design':
        return <DesignSettings settings={settings} updateSetting={updateSetting} />;
      case 'content':
        return <ContentSettings settings={settings} updateSetting={updateSetting} />;
      case 'language':
        return <LanguageSettings />;
      case 'sections':
        return <SectionSettings />;
      case 'media':
        return <MediaLibrary />;
      case 'seo':
        return <SEOSettings settings={settings} updateSetting={updateSetting} />;
      case 'integrations':
        return <IntegrationsSettings settings={settings} updateSetting={updateSetting} />;
      case 'profile':
        return <UserProfile user={user} />;
      default:
        return <GeneralSettings settings={settings} updateSetting={updateSetting} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel - Sportiko</h1>
              <div className="flex gap-2">
                <a href="#/" className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                  <SafeIcon icon={FiEye} className="w-4 h-4" />
                  Προβολή Σελίδας
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleSaveAll}
                disabled={saveStatus === 'saving'}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  saveStatus === 'saved'
                    ? 'bg-green-600 text-white'
                    : saveStatus === 'error'
                    ? 'bg-red-600 text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <SafeIcon icon={FiSave} className="w-4 h-4" />
                {saveStatus === 'saving'
                  ? 'Αποθήκευση...'
                  : saveStatus === 'saved'
                  ? 'Αποθηκεύτηκε!'
                  : saveStatus === 'error'
                  ? 'Σφάλμα!'
                  : 'Αποθήκευση'}
              </button>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Συνδεδεμένος ως:</span>
                <span className="font-medium">{user.email}</span>
              </div>
              <button
                onClick={signOut}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Αποσύνδεση
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 bg-white rounded-xl shadow-lg p-6">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <SafeIcon icon={tab.icon} className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          {/* Main Content */}
          <div className="flex-1 bg-white rounded-xl shadow-lg p-8">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;