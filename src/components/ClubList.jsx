import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserClubs } from '../utils/clubUtils';

function ClubList() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadClubs() {
      try {
        setLoading(true);
        const userClubs = await getUserClubs();
        setClubs(userClubs);
      } catch (err) {
        console.error('Error loading clubs:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    loadClubs();
  }, []);
  
  if (loading) {
    return <div className="p-6">Loading your clubs...</div>;
  }
  
  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }
  
  if (clubs.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="mb-4">You don't have any clubs yet.</p>
        <p className="text-sm text-gray-500">
          Contact a Sportiko admin to get access to your club.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Your Clubs</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubs.map(club => (
          <Link
            key={club.id}
            to={`/clubs/${club.id}`}
            className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{club.name}</h2>
              <span className={`px-2 py-1 text-xs rounded ${club.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {club.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500">Your Role</p>
              <p className="font-medium capitalize">{club.role}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Subscription</p>
              <p className="font-medium capitalize">{club.subscription_status}</p>
            </div>
            
            <div className="mt-4 text-sm text-blue-600">
              View Details →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ClubList;