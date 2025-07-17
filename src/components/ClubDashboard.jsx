import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getClubApps, getClubUsage } from '../utils/clubUtils';
import supabase from '../lib/supabase';

function ClubDashboard() {
  const { clubId } = useParams();
  const [club, setClub] = useState(null);
  const [apps, setApps] = useState([]);
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadClubData() {
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
        
        // Get usage statistics
        const usageData = await getClubUsage(clubId);
        setUsage(usageData.usage);
        
      } catch (err) {
        console.error('Error loading club data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    loadClubData();
  }, [clubId]);
  
  if (loading) {
    return <div className="p-6">Loading club data...</div>;
  }
  
  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }
  
  if (!club) {
    return <div className="p-6">Club not found</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{club.name}</h1>
      
      {/* Club Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Club Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Subscription Status</p>
            <p className="font-medium">{club.subscription_status}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Subscription Ends</p>
            <p className="font-medium">
              {club.subscription_end_date 
                ? new Date(club.subscription_end_date).toLocaleDateString() 
                : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Active</p>
            <p className="font-medium">{club.is_active ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>
      
      {/* Apps */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Apps</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {apps.map(app => (
            <div 
              key={app.id} 
              className={`p-4 rounded-lg ${app.is_enabled ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{app.app_type}</h3>
                <span className={`px-2 py-1 text-xs rounded ${app.is_enabled ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>
                  {app.is_enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              {app.is_enabled && (
                <a 
                  href={`https://${app.app_type}.sportiko.eu?club=${club.slug}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm text-blue-600 hover:underline"
                >
                  Open App
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Usage Statistics */}
      {usage && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Usage Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-500">Total Files</p>
              <p className="text-2xl font-bold">{usage.storage.files}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-500">Storage Used</p>
              <p className="text-2xl font-bold">{Math.round(usage.storage.size_bytes / (1024 * 1024) * 10) / 10} MB</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-500">Total Apps</p>
              <p className="text-2xl font-bold">{usage.apps.total}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-500">Enabled Apps</p>
              <p className="text-2xl font-bold">{usage.apps.enabled}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClubDashboard;