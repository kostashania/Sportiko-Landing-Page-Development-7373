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
        settingsObj[setting.category][setting.key] = setting.value;
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
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          category,
          key,
          value,
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
          type: file.type.startsWith('image/') ? 'image' : 
                file.type.startsWith('video/') ? 'video' : 'file',
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