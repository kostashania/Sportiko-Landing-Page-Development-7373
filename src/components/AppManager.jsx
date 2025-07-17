import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getClubApps, toggleClubApp } from '../utils/clubUtils';
import supabase from '../lib/supabase';

function AppManager() {
  const { clubId } = useParams();
  const [club, setClub] = useState(null);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        
        // Get club details
        const { data: clubData, error: clubError } = await supabase
          .from('clubs')
          .select('*')
          .eq('id', clubId)
          .single();
          
        if (clubError) throw clubError;
        setClub(clubData);
        
        // Get club apps
        const appData = await getClubApps(clubId);
        setApps(appData);
        
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [clubId]);

  const handleToggleApp = async (appId, appType, currentStatus) => {
    try {
      setUpdating(appId);
      const newStatus = !currentStatus;
      
      await toggleClubApp(clubId, appType, newStatus);
      
      // Update local state
      setApps(prevApps => 
        prevApps.map(app => 
          app.id === appId ? { ...app, is_enabled: newStatus } : app
        )
      );
      
    } catch (err) {
      console.error('Error toggling app:', err);
      setError(`Failed to update ${appType}: ${err.message}`);
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return <div className="p-6">Loading apps...</div>;
  }
  
  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }
  
  if (!club) {
    return <div className="p-6">Club not found</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">{club.name}</h1>
      <p className="mb-6 text-gray-500">App Management</p>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                App
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                URL
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {apps.map(app => (
              <tr key={app.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900 capitalize">{app.app_type}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    app.is_enabled 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {app.is_enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {app.is_enabled ? (
                    <a 
                      href={`https://${app.app_type}.sportiko.eu?club=${club.slug}`}
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:underline"
                    >
                      {app.app_type}.sportiko.eu
                    </a>
                  ) : (
                    <span className="text-gray-400">Not available</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleToggleApp(app.id, app.app_type, app.is_enabled)}
                    disabled={updating === app.id}
                    className={`inline-flex items-center px-3 py-1 border border-transparent rounded-md ${
                      app.is_enabled
                        ? 'text-red-700 bg-red-50 hover:bg-red-100'
                        : 'text-green-700 bg-green-50 hover:bg-green-100'
                    } ${updating === app.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {updating === app.id ? (
                      'Processing...'
                    ) : app.is_enabled ? (
                      'Disable'
                    ) : (
                      'Enable'
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AppManager;