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

        console.log('Initializing storage bucket for app:', appConfig);

        const result = await ensureStorageBucket(appConfig);
        
        if (mountedRef.current) {
          if (result.success) {
            setIsReady(true);
            setError(null);
            console.log('Storage bucket ready:', appConfig.bucketName);
          } else {
            throw new Error('Failed to ensure storage bucket');
          }
        }
      } catch (err) {
        console.error('Storage bucket initialization error:', err);
        
        if (mountedRef.current) {
          setError(err);
          // Don't block the app for storage issues
          // Set ready to true anyway, uploads will handle their own errors
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