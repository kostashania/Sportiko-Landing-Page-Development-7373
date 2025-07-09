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
 * Uses caching to avoid repeated API calls
 */
export const checkBucketExists = async (bucketName) => {
  try {
    // Check cache first
    const cachedResult = bucketCache.get(bucketName);
    if (cachedResult !== null) {
      console.log(`Bucket ${bucketName} existence check (cached):`, cachedResult);
      return cachedResult;
    }

    console.log(`Checking if bucket ${bucketName} exists...`);
    
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error listing buckets:', error);
      throw error;
    }

    const exists = buckets?.some(bucket => bucket.name === bucketName) || false;
    
    // Cache the result
    bucketCache.set(bucketName, exists);
    
    console.log(`Bucket ${bucketName} exists:`, exists);
    return exists;
  } catch (error) {
    console.error(`Error checking bucket ${bucketName}:`, error);
    // Don't cache errors, allow retry
    return false;
  }
};

/**
 * Create a storage bucket with appropriate configuration
 */
export const createStorageBucket = async (config = null) => {
  const appConfig = config || getCurrentAppConfig();
  const { bucketName, allowedMimeTypes, fileSizeLimit } = appConfig;

  try {
    console.log(`Creating bucket ${bucketName} with config:`, appConfig);

    const { data, error } = await supabase.storage.createBucket(bucketName, {
      public: true,
      allowedMimeTypes,
      fileSizeLimit
    });

    if (error) {
      // If bucket already exists, that's not really an error for us
      if (error.message?.includes('already exists') || error.message?.includes('Duplicate')) {
        console.log(`Bucket ${bucketName} already exists, continuing...`);
        bucketCache.set(bucketName, true);
        return { success: true, existed: true };
      }
      throw error;
    }

    console.log(`Bucket ${bucketName} created successfully:`, data);
    bucketCache.set(bucketName, true);
    
    return { success: true, existed: false, data };
  } catch (error) {
    console.error(`Error creating bucket ${bucketName}:`, error);
    throw error;
  }
};

/**
 * Ensure storage bucket exists (check first, create if needed)
 * This is the main function to use in your components
 */
export const ensureStorageBucket = async (config = null) => {
  const appConfig = config || getCurrentAppConfig();
  const { bucketName } = appConfig;

  try {
    console.log(`Ensuring bucket ${bucketName} exists...`);

    // First check if bucket exists
    const exists = await checkBucketExists(bucketName);
    
    if (exists) {
      console.log(`Bucket ${bucketName} already exists, no action needed`);
      return { success: true, existed: true };
    }

    // Create bucket if it doesn't exist
    console.log(`Bucket ${bucketName} doesn't exist, creating...`);
    const result = await createStorageBucket(appConfig);
    
    return result;
  } catch (error) {
    console.error(`Error ensuring bucket ${bucketName}:`, error);
    
    // For non-critical errors, don't throw - just log and continue
    if (error.message?.includes('already exists') || 
        error.message?.includes('Duplicate') ||
        error.status === 400) {
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

  // Ensure bucket exists before uploading
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
 * Clear the bucket cache (useful for testing or manual refresh)
 */
export const clearBucketCache = () => {
  bucketCache.clear();
  console.log('Bucket cache cleared');
};