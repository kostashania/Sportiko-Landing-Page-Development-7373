/**
 * React hook for managing storage bucket initialization
 */
import { useState, useEffect, useRef } from 'react';
import { ensureStorageBucket, getCurrentAppConfig } from '../utils/storageUtils';

export const useStorageBucket = () => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const [config, setConfig] = useState(null);
  const initializationRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    // Cleanup function to track component mount state
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const initializeBucket = async () => {
      // Prevent multiple initializations
      if (initializationRef.current) {
        return;
      }
      
      initializationRef.current = true;

      try {
        const appConfig = getCurrentAppConfig();
        setConfig(appConfig);
        
        console.log('Checking storage bucket for app:', appConfig);
        
        // Only check if bucket exists, never try to create it
        const result = await ensureStorageBucket(appConfig);
        
        if (mountedRef.current) {
          if (result.success) {
            setIsReady(true);
            setError(null);
            console.log('Storage bucket ready:', appConfig.bucketName);
          } else {
            throw new Error('Storage bucket is not available');
          }
        }
      } catch (err) {
        console.error('Storage bucket check error:', err);
        
        if (mountedRef.current) {
          setError(err);
          // Set ready to true anyway for manually created buckets
          // The app should still function even if we can't verify the bucket
          setIsReady(true);
        }
      }
    };

    initializeBucket();
  }, []);

  // Function to manually retry initialization
  const retry = async () => {
    initializationRef.current = false;
    setError(null);
    setIsReady(false);
    
    // Trigger re-initialization
    const appConfig = getCurrentAppConfig();
    setConfig(appConfig);
    
    try {
      const result = await ensureStorageBucket(appConfig);
      if (result.success) {
        setIsReady(true);
        setError(null);
      }
    } catch (err) {
      setError(err);
      setIsReady(true); // Still set ready to not block the app
    }
  };

  return {
    isReady,
    error,
    config,
    retry,
    bucketName: config?.bucketName
  };
};