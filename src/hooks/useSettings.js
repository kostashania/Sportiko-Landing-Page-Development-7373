import { useState, useEffect, useCallback } from 'react';
import supabase from '../lib/supabase';

export const useSettings = () => {
  const [settings, setSettings] = useState({});
  const [sections, setSections] = useState([]);
  const [features, setFeatures] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [demoItems, setDemoItems] = useState([]);
  const [contactInfo, setContactInfo] = useState([]);
  const [mediaLibrary, setMediaLibrary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pendingUpdates, setPendingUpdates] = useState(new Set());

  const loadSettings = async () => {
    if (loading) return; // Prevent multiple simultaneous calls
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;

      const settingsObj = {};
      data?.forEach(setting => {
        if (!settingsObj[setting.category]) {
          settingsObj[setting.category] = {};
        }
        // Handle nested JSON values
        try {
          if (typeof setting.value === 'string' && (
            setting.value.startsWith('{') || setting.value.startsWith('[')
          )) {
            settingsObj[setting.category][setting.key] = JSON.parse(setting.value);
          } else {
            settingsObj[setting.category][setting.key] = setting.value;
          }
        } catch (e) {
          settingsObj[setting.category][setting.key] = setting.value;
        }
      });
      setSettings(settingsObj);
    } catch (error) {
      console.warn('Failed to load settings:', error);
      setError(error.message);
      // Set default settings on error
      setSettings({
        general: {
          site_name: 'Sportiko.eu',
          project_id: 'bjelydvroavsqczejpgd',
          app_url: 'https://spiffy-nougat-80a628.netlify.app',
          logo_url: '/logo_500x500.png',
          logo_alt: 'Sportiko Logo'
        },
        content: {
          hero_title: 'Η Πλατφόρμα που Εξελίσσει τον Αθλητικό σας Σύλλογο',
          hero_subtitle: 'Οργανώστε τα οικονομικά και τις ακαδημίες σας με εύχρηστες εφαρμογές που λειτουργούν κάτω από την ενιαία πλατφόρμα του Sportiko.',
          hero_cta_primary: 'Ανακαλύψτε τις Εφαρμογές',
          hero_cta_secondary: 'Επικοινωνία',
          hero_cta_primary_url: '#features',
          hero_cta_secondary_url: '#contact',
          hero_background_image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b'
        },
        design: {
          primary_color: '#2563eb',
          secondary_color: '#16a34a',
          font_family: 'Inter'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSections = async () => {
    try {
      const { data, error } = await supabase
        .from('sections')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setSections(data || []);
    } catch (error) {
      console.warn('Failed to load sections:', error);
      setError(error.message);
      // Set default sections
      setSections([
        {
          id: '1',
          name: 'hero',
          title: 'Hero Section',
          is_active: true,
          order_index: 1,
          content: {
            logo: '/logo_500x500.png',
            background_type: 'gradient',
            cta_primary_url: '#features',
            cta_secondary_url: '#contact'
          }
        },
        {
          id: '2',
          name: 'intro',
          title: 'Introduction',
          is_active: true,
          order_index: 2,
          content: {}
        },
        {
          id: '3',
          name: 'features',
          title: 'Features',
          is_active: true,
          order_index: 3,
          content: {
            columns: 3,
            layout: 'grid'
          }
        },
        {
          id: '4',
          name: 'benefits',
          title: 'Benefits',
          is_active: true,
          order_index: 4,
          content: {}
        },
        {
          id: '5',
          name: 'demo',
          title: 'Demo',
          is_active: true,
          order_index: 5,
          content: {
            show_video: false
          }
        },
        {
          id: '6',
          name: 'contact',
          title: 'Contact',
          is_active: true,
          order_index: 6,
          content: {
            google_maps_url: 'https://maps.google.com/?q=Χανιά,Ελλάδα'
          }
        }
      ]);
    }
  };

  const loadFeatures = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('features')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setFeatures(data || []);
    } catch (error) {
      console.warn('Failed to load features:', error);
      setError(error.message);
      // Set default features
      setFeatures([
        {
          id: '1',
          title: '💰 Sportiko Fin',
          description: 'Οικονομική διαχείριση συλλόγων. Έσοδα, έξοδα, εγκρίσεις, αναφορές και ρόλοι. Όλα στο: fin.sportiko.eu',
          icon: 'FiDollarSign',
          link_url: 'https://fin.sportiko.eu',
          order_index: 1,
          is_active: true
        },
        {
          id: '2',
          title: '🎓 Sportiko Academy',
          description: 'Διαχείριση ακαδημιών: Εγγραφές, παρουσίες, επικοινωνία με γονείς, ειδοποιήσεις & αξιολογήσεις. Δοκιμάστε το στο: academy.sportiko.eu',
          icon: 'FiUsers',
          link_url: 'https://academy.sportiko.eu',
          order_index: 2,
          is_active: true
        }
      ]);
    }
  }, []);

  const loadBenefits = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('benefits')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setBenefits(data || []);
    } catch (error) {
      console.warn('Failed to load benefits:', error);
      setError(error.message);
      // Set default benefits
      setBenefits([
        {
          id: '1',
          title: 'Εύχρηστο περιβάλλον',
          description: 'Εύχρηστο περιβάλλον για όλους – ακόμα και για μη εξοικειωμένους',
          order_index: 1,
          is_active: true
        },
        {
          id: '2',
          title: 'Διαφάνεια',
          description: 'Διαφάνεια στη διαχείριση των οικονομικών του συλλόγου',
          order_index: 2,
          is_active: true
        },
        {
          id: '3',
          title: 'Πλήρες ιστορικό',
          description: 'Πλήρες ιστορικό για κάθε καταχώρηση & ενέργεια',
          order_index: 3,
          is_active: true
        }
      ]);
    }
  }, []);

  const loadDemoItems = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('demo_items')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setDemoItems(data || []);
    } catch (error) {
      console.warn('Failed to load demo items:', error);
      setError(error.message);
      // Set default demo items
      setDemoItems([
        {
          id: '1',
          title: 'Καρτέλα Ταμείου',
          image_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f',
          link_url: 'https://fin.sportiko.eu',
          icon: 'FiMonitor',
          order_index: 1,
          is_active: true
        },
        {
          id: '2',
          title: 'Φόρμα Καταγραφής Εξόδων',
          image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
          link_url: 'https://fin.sportiko.eu',
          icon: 'FiTablet',
          order_index: 2,
          is_active: true
        },
        {
          id: '3',
          title: 'Σελίδα Εγκρίσεων',
          image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
          link_url: 'https://fin.sportiko.eu',
          icon: 'FiSmartphone',
          order_index: 3,
          is_active: true
        }
      ]);
    }
  }, []);

  const loadContactInfo = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setContactInfo(data || []);
    } catch (error) {
      console.warn('Failed to load contact info:', error);
      setError(error.message);
      // Set default contact info
      setContactInfo([
        {
          id: '1',
          type: 'email',
          value: 'info@sportiko.eu',
          link: 'mailto:info@sportiko.eu',
          icon: 'FiMail',
          order_index: 1,
          is_active: true
        },
        {
          id: '2',
          type: 'phone',
          value: '(+30) 698 4146 197',
          link: 'tel:+306984146197',
          icon: 'FiPhone',
          order_index: 2,
          is_active: true
        },
        {
          id: '3',
          type: 'address',
          value: 'Χανιά, Κρήτη',
          link: 'https://maps.google.com/?q=Χανιά,Ελλάδα',
          icon: 'FiMapPin',
          order_index: 3,
          is_active: true
        }
      ]);
    }
  }, []);

  const loadMediaLibrary = async () => {
    try {
      const { data, error } = await supabase
        .from('media_library')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMediaLibrary(data || []);
    } catch (error) {
      console.warn('Failed to load media library:', error);
      setError(error.message);
      setMediaLibrary([]);
    }
  };

  // Debounced update setting function
  const updateSetting = useCallback(async (category, key, value) => {
    const updateKey = `${category}-${key}`;
    
    // Prevent duplicate calls
    if (pendingUpdates.has(updateKey)) {
      return { error: null };
    }

    try {
      setPendingUpdates(prev => new Set(prev).add(updateKey));
      
      // For entire category updates (like translations)
      if (key === null && typeof value === 'object') {
        const promises = [];
        
        // First, delete all existing settings for this category
        const { error: deleteError } = await supabase
          .from('site_settings')
          .delete()
          .eq('category', category);
          
        if (deleteError) throw deleteError;
        
        // Insert all new settings
        Object.entries(value).forEach(([nestedKey, nestedValue]) => {
          if (typeof nestedValue === 'object') {
            promises.push(
              supabase
                .from('site_settings')
                .insert({
                  category,
                  key: nestedKey,
                  value: JSON.stringify(nestedValue),
                  updated_at: new Date().toISOString()
                })
            );
          } else {
            promises.push(
              supabase
                .from('site_settings')
                .insert({
                  category,
                  key: nestedKey,
                  value: nestedValue,
                  updated_at: new Date().toISOString()
                })
            );
          }
        });
        
        await Promise.all(promises);
        setSettings(prev => ({ ...prev, [category]: value }));
        return { error: null };
      }

      // For single setting updates
      let valueToStore = value;
      if (typeof value === 'object') {
        valueToStore = JSON.stringify(value);
      }
      
      // Use upsert instead of separate check/insert/update
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          category,
          key,
          value: valueToStore,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'category,key'
        });
      
      if (error) throw error;
      
      setSettings(prev => ({
        ...prev,
        [category]: {
          ...(prev[category] || {}),
          [key]: value
        }
      }));
      
      return { error: null };
    } catch (error) {
      console.error("Error updating setting:", error);
      setError(error.message);
      return { error };
    } finally {
      setPendingUpdates(prev => {
        const newSet = new Set(prev);
        newSet.delete(updateKey);
        return newSet;
      });
    }
  }, [pendingUpdates]);

  const updateSection = async (sectionId, updates) => {
    try {
      const { error } = await supabase
        .from('sections')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', sectionId);

      if (error) throw error;

      setSections(prev =>
        prev.map(section =>
          section.id === sectionId
            ? { ...section, ...updates }
            : section
        )
      );

      return { error: null };
    } catch (error) {
      setError(error.message);
      return { error };
    }
  };

  const createFeature = async (feature) => {
    try {
      const { data, error } = await supabase
        .from('features')
        .insert([{
          ...feature,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();

      if (error) throw error;

      setFeatures(prev =>
        [...prev, data[0]].sort((a, b) => a.order_index - b.order_index)
      );

      return { data: data[0], error: null };
    } catch (error) {
      setError(error.message);
      return { data: null, error };
    }
  };

  const updateFeature = async (featureId, updates) => {
    try {
      const { error } = await supabase
        .from('features')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', featureId);

      if (error) throw error;

      setFeatures(prev =>
        prev.map(feature =>
          feature.id === featureId
            ? { ...feature, ...updates }
            : feature
        ).sort((a, b) => a.order_index - b.order_index)
      );

      return { error: null };
    } catch (error) {
      setError(error.message);
      return { error };
    }
  };

  const deleteFeature = async (featureId) => {
    try {
      const { error } = await supabase
        .from('features')
        .delete()
        .eq('id', featureId);

      if (error) throw error;

      setFeatures(prev =>
        prev.filter(feature => feature.id !== featureId)
      );

      return { error: null };
    } catch (error) {
      setError(error.message);
      return { error };
    }
  };

  const createBenefit = async (benefit) => {
    try {
      const { data, error } = await supabase
        .from('benefits')
        .insert([{
          ...benefit,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();

      if (error) throw error;

      setBenefits(prev =>
        [...prev, data[0]].sort((a, b) => a.order_index - b.order_index)
      );

      return { data: data[0], error: null };
    } catch (error) {
      setError(error.message);
      return { data: null, error };
    }
  };

  const updateBenefit = async (benefitId, updates) => {
    try {
      const { error } = await supabase
        .from('benefits')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', benefitId);

      if (error) throw error;

      setBenefits(prev =>
        prev.map(benefit =>
          benefit.id === benefitId
            ? { ...benefit, ...updates }
            : benefit
        ).sort((a, b) => a.order_index - b.order_index)
      );

      return { error: null };
    } catch (error) {
      setError(error.message);
      return { error };
    }
  };

  const deleteBenefit = async (benefitId) => {
    try {
      const { error } = await supabase
        .from('benefits')
        .delete()
        .eq('id', benefitId);

      if (error) throw error;

      setBenefits(prev =>
        prev.filter(benefit => benefit.id !== benefitId)
      );

      return { error: null };
    } catch (error) {
      setError(error.message);
      return { error };
    }
  };

  const createDemoItem = async (item) => {
    try {
      const { data, error } = await supabase
        .from('demo_items')
        .insert([{
          ...item,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();

      if (error) throw error;

      setDemoItems(prev =>
        [...prev, data[0]].sort((a, b) => a.order_index - b.order_index)
      );

      return { data: data[0], error: null };
    } catch (error) {
      setError(error.message);
      return { data: null, error };
    }
  };

  const updateDemoItem = async (itemId, updates) => {
    try {
      const { error } = await supabase
        .from('demo_items')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', itemId);

      if (error) throw error;

      setDemoItems(prev =>
        prev.map(item =>
          item.id === itemId
            ? { ...item, ...updates }
            : item
        ).sort((a, b) => a.order_index - b.order_index)
      );

      return { error: null };
    } catch (error) {
      setError(error.message);
      return { error };
    }
  };

  const deleteDemoItem = async (itemId) => {
    try {
      const { error } = await supabase
        .from('demo_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setDemoItems(prev =>
        prev.filter(item => item.id !== itemId)
      );

      return { error: null };
    } catch (error) {
      setError(error.message);
      return { error };
    }
  };

  const createContactInfo = async (contact) => {
    try {
      const { data, error } = await supabase
        .from('contact_info')
        .insert([{
          ...contact,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();

      if (error) throw error;

      setContactInfo(prev =>
        [...prev, data[0]].sort((a, b) => a.order_index - b.order_index)
      );

      return { data: data[0], error: null };
    } catch (error) {
      setError(error.message);
      return { data: null, error };
    }
  };

  const updateContactInfo = async (contactId, updates) => {
    try {
      const { error } = await supabase
        .from('contact_info')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', contactId);

      if (error) throw error;

      setContactInfo(prev =>
        prev.map(contact =>
          contact.id === contactId
            ? { ...contact, ...updates }
            : contact
        ).sort((a, b) => a.order_index - b.order_index)
      );

      return { error: null };
    } catch (error) {
      setError(error.message);
      return { error };
    }
  };

  const deleteContactInfo = async (contactId) => {
    try {
      const { error } = await supabase
        .from('contact_info')
        .delete()
        .eq('id', contactId);

      if (error) throw error;

      setContactInfo(prev =>
        prev.filter(contact => contact.id !== contactId)
      );

      return { error: null };
    } catch (error) {
      setError(error.message);
      return { error };
    }
  };

  const uploadMedia = async (file, category = 'general') => {
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(fileName);

      const { error: insertError } = await supabase
        .from('media_library')
        .insert([{
          filename: file.name,
          url: publicUrl,
          type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'file',
          category,
          size_bytes: file.size
        }]);

      if (insertError) throw insertError;

      await loadMediaLibrary();
      return { url: publicUrl, error: null };
    } catch (error) {
      setError(error.message);
      return { url: null, error };
    }
  };

  return {
    settings,
    sections,
    features,
    benefits,
    demoItems,
    contactInfo,
    mediaLibrary,
    loading,
    error,
    updateSetting,
    updateSection,
    createFeature,
    updateFeature,
    deleteFeature,
    createBenefit,
    updateBenefit,
    deleteBenefit,
    createDemoItem,
    updateDemoItem,
    deleteDemoItem,
    createContactInfo,
    updateContactInfo,
    deleteContactInfo,
    uploadMedia,
    loadSettings,
    loadSections,
    loadFeatures,
    loadBenefits,
    loadDemoItems,
    loadContactInfo,
    loadMediaLibrary
  };
};