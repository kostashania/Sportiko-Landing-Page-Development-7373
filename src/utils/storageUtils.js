/**
 * Storage utilities for managing Supabase storage buckets in a multi-app environment
 */
import supabase from '../lib/supabase';

// Configuration for different apps
const APP_CONFIGS = {
  'sportiko.eu': {
    bucketName: 'media-sportiko',
    allowedMimeTypes: ['image/*', 'video/*'],
    fileSizeLimit: 10485760 // 10MB
  },
  'fin.sportiko.eu': {
    bucketName: 'media-fin',
    allowedMimeTypes: ['image/*', 'application/pdf'],
    fileSizeLimit: 5242880 // 5MB
  },
  'academy.sportiko.eu': {
    bucketName: 'media-academy',
    allowedMimeTypes: ['image/*', 'video/*', 'application/pdf'],
    fileSizeLimit: 15728640 // 15MB
  }
};

/**
 * Get the current app configuration based on domain
 */
export const getCurrentAppConfig = () => {
  const hostname = window.location.hostname;
  // Default to main app if exact match not found
  return APP_CONFIGS[hostname] || APP_CONFIGS['sportiko.eu'];
};

/**
 * Cache for bucket existence checks to avoid repeated API calls
 */
class BucketCache {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
  }

  get(bucketName) {
    const cached = this.cache.get(bucketName);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > this.cacheExpiry) {
      this.cache.delete(bucketName);
      return null;
    }
    
    return cached.exists;
  }

  set(bucketName, exists) {
    this.cache.set(bucketName, {
      exists,
      timestamp: Date.now()
    });
  }

  clear() {
    this.cache.clear();
  }
}

const bucketCache = new BucketCache();

/**
 * Check if a storage bucket exists
 * For manually created buckets, we assume they exist and cache the result
 */
export const checkBucketExists = async (bucketName) => {
  try {
    // Check cache first
    const cachedResult = bucketCache.get(bucketName);
    if (cachedResult !== null) {
      console.log(`Bucket ${bucketName} existence check (cached):`, cachedResult);
      return cachedResult;
    }

    // For known manually created buckets, assume they exist
    const manuallyCreatedBuckets = ['media-sportiko', 'media-fin', 'media-academy'];
    if (manuallyCreatedBuckets.includes(bucketName)) {
      console.log(`Bucket ${bucketName} is manually created, assuming it exists`);
      bucketCache.set(bucketName, true);
      return true;
    }

    console.log(`Checking if bucket ${bucketName} exists...`);
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error listing buckets:', error);
      // For known buckets, assume they exist even if we can't list them
      if (manuallyCreatedBuckets.includes(bucketName)) {
        bucketCache.set(bucketName, true);
        return true;
      }
      throw error;
    }

    const exists = buckets?.some(bucket => bucket.name === bucketName) || false;
    
    // Cache the result
    bucketCache.set(bucketName, exists);
    console.log(`Bucket ${bucketName} exists:`, exists);
    return exists;
  } catch (error) {
    console.error(`Error checking bucket ${bucketName}:`, error);
    // For known manually created buckets, assume they exist
    const manuallyCreatedBuckets = ['media-sportiko', 'media-fin', 'media-academy'];
    if (manuallyCreatedBuckets.includes(bucketName)) {
      bucketCache.set(bucketName, true);
      return true;
    }
    return false;
  }
};

/**
 * REMOVED: createStorageBucket function
 * Buckets are manually created and should not be created programmatically
 */

/**
 * Ensure storage bucket exists (only check, never create)
 * This is the main function to use in your components
 */
export const ensureStorageBucket = async (config = null) => {
  const appConfig = config || getCurrentAppConfig();
  const { bucketName } = appConfig;

  try {
    console.log(`Ensuring bucket ${bucketName} exists...`);
    
    // Only check if bucket exists, never try to create
    const exists = await checkBucketExists(bucketName);
    
    if (exists) {
      console.log(`Bucket ${bucketName} is available`);
      return { success: true, existed: true };
    } else {
      console.error(`Bucket ${bucketName} does not exist and cannot be created programmatically`);
      throw new Error(`Bucket ${bucketName} does not exist. Please create it manually in Supabase Storage.`);
    }
  } catch (error) {
    console.error(`Error ensuring bucket ${bucketName}:`, error);
    // For known manually created buckets, assume they exist despite errors
    const manuallyCreatedBuckets = ['media-sportiko', 'media-fin', 'media-academy'];
    if (manuallyCreatedBuckets.includes(bucketName)) {
      console.log(`Assuming bucket ${bucketName} exists despite error`);
      bucketCache.set(bucketName, true);
      return { success: true, existed: true };
    }
    throw error;
  }
};

/**
 * Get the public URL for a file in the app's bucket
 */
export const getPublicUrl = (fileName, config = null) => {
  const appConfig = config || getCurrentAppConfig();
  const { bucketName } = appConfig;
  
  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName);
    
  return data.publicUrl;
};

/**
 * Upload a file to the app's bucket
 */
export const uploadFile = async (fileName, file, config = null) => {
  const appConfig = config || getCurrentAppConfig();
  const { bucketName } = appConfig;

  // Ensure bucket exists before uploading (check only, no creation)
  await ensureStorageBucket(appConfig);

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw error;
  }

  return {
    data,
    publicUrl: getPublicUrl(fileName, appConfig)
  };
};

/**
 * List files in the storage bucket using Supabase Storage API
 */
export const listFiles = async (path = '', config = null) => {
  const appConfig = config || getCurrentAppConfig();
  const { bucketName } = appConfig;

  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(path, {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) {
      throw error;
    }

    // Transform the data to match our expected format
    const transformedData = data?.map(file => ({
      id: file.name, // Use filename as ID since we don't have a database table
      filename: file.name,
      url: getPublicUrl(path ? `${path}/${file.name}` : file.name, appConfig),
      type: getFileTypeFromName(file.name),
      category: path || 'general',
      size_bytes: file.metadata?.size || 0,
      created_at: file.created_at,
      updated_at: file.updated_at
    })) || [];

    return transformedData;
  } catch (error) {
    console.error('Error listing files:', error);
    return [];
  }
};

/**
 * Helper function to determine file type from filename
 */
const getFileTypeFromName = (filename) => {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const videoExtensions = ['mp4', 'webm', 'ogg', 'avi', 'mov'];
  
  if (imageExtensions.includes(extension)) {
    return 'image';
  } else if (videoExtensions.includes(extension)) {
    return 'video';
  } else {
    return 'file';
  }
};

/**
 * Delete a file from the storage bucket
 */
export const deleteFile = async (fileName, config = null) => {
  const appConfig = config || getCurrentAppConfig();
  const { bucketName } = appConfig;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .remove([fileName]);

  if (error) {
    throw error;
  }

  return data;
};

/**
 * Clear the bucket cache (useful for testing or manual refresh)
 */
export const clearBucketCache = () => {
  bucketCache.clear();
  console.log('Bucket cache cleared');
};

/**
 * S3-compatible configuration (for backend use only)
 * These credentials should be stored securely and only used on the backend
 */
export const getS3Config = () => {
  return {
    accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY || 'ab6103794f757225f42f1d14b62fe442',
    secretAccessKey: process.env.SUPABASE_S3_SECRET_KEY || 'da9ea17d7021cd9701c82f990261aaf59ae3199df746a51ecd9f4dcf73a15b3f',
    endpoint: 'https://bjelydvroavsqczejpgd.supabase.co/storage/v1/s3',
    region: 'eu-central-1',
    forcePathStyle: true
  };
};

/**
 * Upload using S3-compatible API (for backend use only)
 * This would typically be used in a Node.js backend environment
 */
export const uploadFileS3Compatible = async (fileName, fileBuffer, config = null) => {
  // This function would be used in a backend environment with AWS SDK
  // Frontend should use the regular uploadFile function
  console.warn('S3-compatible upload should be used in backend environment only');
  
  // Example implementation (commented out as it requires AWS SDK):
  /*
  const AWS = require('aws-sdk');
  const s3Config = getS3Config();
  
  const s3 = new AWS.S3({
    accessKeyId: s3Config.accessKeyId,
    secretAccessKey: s3Config.secretAccessKey,
    endpoint: s3Config.endpoint,
    region: s3Config.region,
    s3ForcePathStyle: true
  });
  
  const appConfig = config || getCurrentAppConfig();
  const { bucketName } = appConfig;
  
  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: fileBuffer,
    ContentType: 'application/octet-stream'
  };
  
  return await s3.upload(params).promise();
  */
};