import { useState, useEffect } from 'react';
import supabase from '../lib/supabase';

export const useSettings = () => {
  const [settings, setSettings] = useState({});
  const [sections, setSections] = useState([]);
  const [mediaLibrary, setMediaLibrary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSettings();
    loadSections();
    loadMediaLibrary();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;

      const settingsObj = {};
      data.forEach(setting => {
        if (!settingsObj[setting.category]) {
          settingsObj[setting.category] = {};
        }
        
        // Handle nested JSON values
        try {
          if (typeof setting.value === 'string' && (
            setting.value.startsWith('{') || 
            setting.value.startsWith('[')
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
      setError(error.message);
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
      setSections(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const loadMediaLibrary = async () => {
    try {
      const { data, error } = await supabase
        .from('media_library')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMediaLibrary(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const updateSetting = async (category, key, value) => {
    try {
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
        
        setSettings(prev => ({
          ...prev,
          [category]: value
        }));
        
        return { error: null };
      }
      
      // For single setting updates
      let valueToStore = value;
      if (typeof value === 'object') {
        valueToStore = JSON.stringify(value);
      }
      
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          category,
          key,
          value: valueToStore,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setSettings(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [key]: value
        }
      }));

      return { error: null };
    } catch (error) {
      setError(error.message);
      return { error };
    }
  };

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
          section.id === sectionId ? { ...section, ...updates } : section
        )
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
    mediaLibrary,
    loading,
    error,
    updateSetting,
    updateSection,
    uploadMedia,
    loadSettings,
    loadSections,
    loadMediaLibrary
  };
};