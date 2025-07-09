import { useState, useEffect, useCallback } from 'react';
import supabase from '../lib/supabase';
import { resizeImage, validateImageFile } from '../utils/imageUtils';
import { uploadFile, getCurrentAppConfig, listFiles } from '../utils/storageUtils';
import { useStorageBucket } from './useStorageBucket';

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

  // Use the storage bucket hook
  const { isReady: storageReady, error: storageError, bucketName } = useStorageBucket();

  const loadSettings = useCallback(async () => {
    try {
      console.log('useSettings: Loading settings from database...');
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('category', {ascending: true});
        
      if (error) {
        console.error('useSettings: Settings load error:', error);
        throw error;
      }

      console.log('useSettings: Raw settings data:', data);

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

      console.log('useSettings: Processed settings object:', settingsObj);
      setSettings(settingsObj);
    } catch (error) {
      console.error('useSettings: Failed to load settings:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSections = useCallback(async () => {
    try {
      console.log('useSettings: Loading sections...');
      const { data, error } = await supabase
        .from('sections')
        .select('*')
        .order('order_index', {ascending: true});
        
      if (error) throw error;
      console.log('useSettings: Sections loaded:', data);
      setSections(data || []);
    } catch (error) {
      console.warn('useSettings: Failed to load sections:', error);
      setSections([]);
    }
  }, []);

  const loadFeatures = useCallback(async () => {
    try {
      console.log('useSettings: Loading features...');
      const { data, error } = await supabase
        .from('features')
        .select('*')
        .order('order_index', {ascending: true});
        
      if (error) throw error;
      console.log('useSettings: Features loaded:', data);
      setFeatures(data || []);
    } catch (error) {
      console.warn('useSettings: Failed to load features:', error);
      setFeatures([]);
    }
  }, []);

  const loadBenefits = useCallback(async () => {
    try {
      console.log('useSettings: Loading benefits...');
      const { data, error } = await supabase
        .from('benefits')
        .select('*')
        .order('order_index', {ascending: true});
        
      if (error) throw error;
      console.log('useSettings: Benefits loaded:', data);
      setBenefits(data || []);
    } catch (error) {
      console.warn('useSettings: Failed to load benefits:', error);
      setBenefits([]);
    }
  }, []);

  const loadDemoItems = useCallback(async () => {
    try {
      console.log('useSettings: Loading demo items...');
      const { data, error } = await supabase
        .from('demo_items')
        .select('*')
        .order('order_index', {ascending: true});
        
      if (error) throw error;
      console.log('useSettings: Demo items loaded:', data);
      setDemoItems(data || []);
    } catch (error) {
      console.warn('useSettings: Failed to load demo items:', error);
      setDemoItems([]);
    }
  }, []);

  const loadContactInfo = useCallback(async () => {
    try {
      console.log('useSettings: Loading contact info...');
      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .order('order_index', {ascending: true});
        
      if (error) throw error;
      console.log('useSettings: Contact info loaded:', data);
      setContactInfo(data || []);
    } catch (error) {
      console.warn('useSettings: Failed to load contact info:', error);
      setContactInfo([]);
    }
  }, []);

  // Updated to use Supabase Storage API instead of media_library table
  const loadMediaLibrary = useCallback(async () => {
    try {
      console.log('useSettings: Loading media library from Supabase Storage...');
      
      // Load files from different categories
      const categories = ['general', 'hero', 'logo', 'demo', 'features'];
      const allFiles = [];
      
      for (const category of categories) {
        try {
          const categoryFiles = await listFiles(category);
          allFiles.push(...categoryFiles);
        } catch (error) {
          console.warn(`useSettings: Failed to load files from category ${category}:`, error);
        }
      }
      
      // Also load files from root directory
      try {
        const rootFiles = await listFiles('');
        allFiles.push(...rootFiles.filter(file => !file.filename.includes('/')));
      } catch (error) {
        console.warn('useSettings: Failed to load files from root directory:', error);
      }
      
      console.log('useSettings: Media library loaded:', allFiles.length, 'files');
      setMediaLibrary(allFiles);
    } catch (error) {
      console.warn('useSettings: Failed to load media library:', error);
      setMediaLibrary([]);
    }
  }, []);

  // Update setting function with better error handling and no automatic reload
  const updateSetting = useCallback(async (category, key, value) => {
    try {
      console.log('useSettings: Updating setting:', {category, key, value});
      
      // For entire category updates (like translations)
      if (key === null && typeof value === 'object') {
        // First, delete all existing settings for this category
        const { error: deleteError } = await supabase
          .from('site_settings')
          .delete()
          .eq('category', category);
          
        if (deleteError) {
          console.error('useSettings: Delete error:', deleteError);
          throw deleteError;
        }

        // Insert all new settings
        const insertPromises = Object.entries(value).map(([nestedKey, nestedValue]) => {
          const insertValue = typeof nestedValue === 'object' ? JSON.stringify(nestedValue) : nestedValue;
          return supabase
            .from('site_settings')
            .insert({category, key: nestedKey, value: insertValue, updated_at: new Date().toISOString()});
        });
        
        const results = await Promise.all(insertPromises);
        
        // Check for errors in any of the inserts
        const errors = results.filter(result => result.error);
        if (errors.length > 0) {
          console.error('useSettings: Insert errors:', errors);
          throw errors[0].error;
        }

        setSettings(prev => ({...prev, [category]: value}));
        console.log('useSettings: Category updated successfully');
        return {error: null};
      }

      // For single setting updates
      let valueToStore = value;
      if (typeof value === 'object') {
        valueToStore = JSON.stringify(value);
      }

      // Use upsert to handle both insert and update
      const { data, error } = await supabase
        .from('site_settings')
        .upsert(
          {category, key, value: valueToStore, updated_at: new Date().toISOString()},
          {onConflict: 'category,key', ignoreDuplicates: false}
        )
        .select();
        
      if (error) {
        console.error('useSettings: Upsert error:', error);
        throw error;
      }

      // Update local state immediately
      setSettings(prev => ({
        ...prev,
        [category]: {...(prev[category] || {}), [key]: value}
      }));
      
      console.log('useSettings: Setting updated successfully:', {category, key, value});
      
      return {error: null};
    } catch (error) {
      console.error("useSettings: Error updating setting:", error);
      setError(error.message);
      return {error};
    }
  }, []);

  const updateSection = async (sectionId, updates) => {
    try {
      const { error } = await supabase
        .from('sections')
        .update({...updates, updated_at: new Date().toISOString()})
        .eq('id', sectionId);
        
      if (error) throw error;
      
      setSections(prev => 
        prev.map(section => 
          section.id === sectionId ? {...section, ...updates} : section
        )
      );
      
      return {error: null};
    } catch (error) {
      setError(error.message);
      return {error};
    }
  };

  const createFeature = async (feature) => {
    try {
      const { data, error } = await supabase
        .from('features')
        .insert([{...feature, created_at: new Date().toISOString(), updated_at: new Date().toISOString()}])
        .select();
        
      if (error) throw error;
      
      setFeatures(prev => 
        [...prev, data[0]].sort((a, b) => a.order_index - b.order_index)
      );
      
      return {data: data[0], error: null};
    } catch (error) {
      setError(error.message);
      return {data: null, error};
    }
  };

  const updateFeature = async (featureId, updates) => {
    try {
      const { error } = await supabase
        .from('features')
        .update({...updates, updated_at: new Date().toISOString()})
        .eq('id', featureId);
        
      if (error) throw error;
      
      setFeatures(prev => 
        prev.map(feature => 
          feature.id === featureId ? {...feature, ...updates} : feature
        ).sort((a, b) => a.order_index - b.order_index)
      );
      
      return {error: null};
    } catch (error) {
      setError(error.message);
      return {error};
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
      
      return {error: null};
    } catch (error) {
      setError(error.message);
      return {error};
    }
  };

  const createBenefit = async (benefit) => {
    try {
      const { data, error } = await supabase
        .from('benefits')
        .insert([{...benefit, created_at: new Date().toISOString(), updated_at: new Date().toISOString()}])
        .select();
        
      if (error) throw error;
      
      setBenefits(prev => 
        [...prev, data[0]].sort((a, b) => a.order_index - b.order_index)
      );
      
      return {data: data[0], error: null};
    } catch (error) {
      setError(error.message);
      return {data: null, error};
    }
  };

  const updateBenefit = async (benefitId, updates) => {
    try {
      const { error } = await supabase
        .from('benefits')
        .update({...updates, updated_at: new Date().toISOString()})
        .eq('id', benefitId);
        
      if (error) throw error;
      
      setBenefits(prev => 
        prev.map(benefit => 
          benefit.id === benefitId ? {...benefit, ...updates} : benefit
        ).sort((a, b) => a.order_index - b.order_index)
      );
      
      return {error: null};
    } catch (error) {
      setError(error.message);
      return {error};
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
      
      return {error: null};
    } catch (error) {
      setError(error.message);
      return {error};
    }
  };

  const createDemoItem = async (item) => {
    try {
      const { data, error } = await supabase
        .from('demo_items')
        .insert([{...item, created_at: new Date().toISOString(), updated_at: new Date().toISOString()}])
        .select();
        
      if (error) throw error;
      
      setDemoItems(prev => 
        [...prev, data[0]].sort((a, b) => a.order_index - b.order_index)
      );
      
      return {data: data[0], error: null};
    } catch (error) {
      setError(error.message);
      return {data: null, error};
    }
  };

  const updateDemoItem = async (itemId, updates) => {
    try {
      const { error } = await supabase
        .from('demo_items')
        .update({...updates, updated_at: new Date().toISOString()})
        .eq('id', itemId);
        
      if (error) throw error;
      
      setDemoItems(prev => 
        prev.map(item => 
          item.id === itemId ? {...item, ...updates} : item
        ).sort((a, b) => a.order_index - b.order_index)
      );
      
      return {error: null};
    } catch (error) {
      setError(error.message);
      return {error};
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
      
      return {error: null};
    } catch (error) {
      setError(error.message);
      return {error};
    }
  };

  const createContactInfo = async (contact) => {
    try {
      const { data, error } = await supabase
        .from('contact_info')
        .insert([{...contact, created_at: new Date().toISOString(), updated_at: new Date().toISOString()}])
        .select();
        
      if (error) throw error;
      
      setContactInfo(prev => 
        [...prev, data[0]].sort((a, b) => a.order_index - b.order_index)
      );
      
      return {data: data[0], error: null};
    } catch (error) {
      setError(error.message);
      return {data: null, error};
    }
  };

  const updateContactInfo = async (contactId, updates) => {
    try {
      const { error } = await supabase
        .from('contact_info')
        .update({...updates, updated_at: new Date().toISOString()})
        .eq('id', contactId);
        
      if (error) throw error;
      
      setContactInfo(prev => 
        prev.map(contact => 
          contact.id === contactId ? {...contact, ...updates} : contact
        ).sort((a, b) => a.order_index - b.order_index)
      );
      
      return {error: null};
    } catch (error) {
      setError(error.message);
      return {error};
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
      
      return {error: null};
    } catch (error) {
      setError(error.message);
      return {error};
    }
  };

  const uploadMedia = async (file, category = 'general') => {
    try {
      // Check if storage is ready
      if (!storageReady) {
        throw new Error('Storage not ready. Please try again in a moment.');
      }

      if (storageError) {
        console.warn('useSettings: Storage initialization had issues, but continuing with upload:', storageError);
      }

      // Validate file
      const validation = validateImageFile(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Resize image if it's not SVG
      let fileToUpload = file;
      if (file.type !== 'image/svg+xml') {
        // Determine max dimensions based on category
        let maxWidth = 800;
        let maxHeight = 600;
        
        if (category === 'logo') {
          maxWidth = 400;
          maxHeight = 200;
        } else if (category === 'hero') {
          maxWidth = 1920;
          maxHeight = 1080;
        }
        
        fileToUpload = await resizeImage(file, maxWidth, maxHeight, 0.85);
      }

      // Generate unique filename
      const fileExt = fileToUpload.name.split('.').pop();
      const fileName = `${category}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      console.log('useSettings: Uploading file to storage:', fileName);
      
      // Use the utility function to upload
      const { publicUrl } = await uploadFile(fileName, fileToUpload);

      console.log('useSettings: File uploaded successfully, public URL:', publicUrl);

      // Reload media library to show the new file
      await loadMediaLibrary();
      
      return {url: publicUrl, error: null};
    } catch (error) {
      console.error('useSettings: Upload error:', error);
      setError(error.message);
      return {url: null, error: error.message};
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
    error: error || storageError,
    storageReady,
    bucketName,
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