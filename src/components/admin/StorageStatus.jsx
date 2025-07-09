import React from 'react';
import { useStorageBucket } from '../../hooks/useStorageBucket';
import { clearBucketCache } from '../../utils/storageUtils';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiDatabase, FiCheck, FiX, FiRefreshCw, FiAlertTriangle } = FiIcons;

const StorageStatus = () => {
  const { isReady, error, config, retry, bucketName } = useStorageBucket();

  const handleClearCache = () => {
    clearBucketCache();
    retry();
  };

  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex items-center gap-3 mb-4">
        <SafeIcon icon={FiDatabase} className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-gray-900">Storage Status</h3>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Bucket Name:</span>
          <code className="text-xs bg-gray-100 px-2 py-1 rounded">{bucketName}</code>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Status:</span>
          <div className="flex items-center gap-2">
            {isReady ? (
              <>
                <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">Ready</span>
              </>
            ) : error ? (
              <>
                <SafeIcon icon={FiX} className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-600">Error</span>
              </>
            ) : (
              <>
                <SafeIcon icon={FiRefreshCw} className="w-4 h-4 text-yellow-600 animate-spin" />
                <span className="text-sm text-yellow-600">Initializing</span>
              </>
            )}
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <div className="flex items-start gap-2">
              <SafeIcon icon={FiAlertTriangle} className="w-4 h-4 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm text-red-800 font-medium">Storage Error</p>
                <p className="text-xs text-red-600 mt-1">{error.message}</p>
              </div>
            </div>
          </div>
        )}
        
        {config && (
          <div className="text-xs text-gray-500 space-y-1">
            <div>Max file size: {Math.round(config.fileSizeLimit / 1024 / 1024)}MB</div>
            <div>Allowed types: {config.allowedMimeTypes.join(', ')}</div>
          </div>
        )}
        
        <div className="flex gap-2 pt-2">
          <button
            onClick={retry}
            disabled={!error}
            className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Retry
          </button>
          
          <button
            onClick={handleClearCache}
            className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Clear Cache
          </button>
        </div>
      </div>
    </div>
  );
};

export default StorageStatus;