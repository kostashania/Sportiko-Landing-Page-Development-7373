import supabase from '../lib/supabase';

/**
 * Create a storage bucket for a club
 * @param {string} bucketName The name of the bucket to create
 * @returns {Promise<Object>} Result of the operation
 */
export async function createStorageBucket(bucketName) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('User not authenticated');
    }
    
    // Call our edge function
    const response = await fetch(`${supabase.supabaseUrl}/functions/v1/create-storage-bucket`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        bucketName
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create storage bucket');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating storage bucket:', error);
    throw error;
  }
}

/**
 * Upload a file to a club's storage bucket
 * @param {string} bucketName The name of the bucket
 * @param {File} file The file to upload
 * @param {string} path Optional path within the bucket
 * @returns {Promise<Object>} Result of the operation
 */
export async function uploadFile(bucketName, file, path = '') {
  try {
    // Generate a unique file name
    const timestamp = new Date().getTime();
    const fileExt = file.name.split('.').pop();
    const fileName = `${path ? `${path}/` : ''}${timestamp}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    // Upload the file
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file);
      
    if (error) {
      throw error;
    }
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);
      
    return {
      data,
      publicUrl: urlData.publicUrl
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

/**
 * List files in a club's storage bucket
 * @param {string} bucketName The name of the bucket
 * @param {string} path Optional path within the bucket
 * @returns {Promise<Array>} List of files
 */
export async function listFiles(bucketName, path = '') {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(path);
      
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
}

/**
 * Delete a file from a club's storage bucket
 * @param {string} bucketName The name of the bucket
 * @param {string} filePath The path to the file
 * @returns {Promise<Object>} Result of the operation
 */
export async function deleteFile(bucketName, filePath) {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);
      
    if (error) {
      throw error;
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}

/**
 * Get the public URL for a file
 * @param {string} bucketName The name of the bucket
 * @param {string} filePath The path to the file
 * @returns {string} The public URL
 */
export function getPublicUrl(bucketName, filePath) {
  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);
    
  return data.publicUrl;
}