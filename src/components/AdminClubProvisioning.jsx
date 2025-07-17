import React, { useState } from 'react';
import { provisionClub } from '../utils/clubUtils';

function AdminClubProvisioning() {
  const [clubName, setClubName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState('trialing');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await provisionClub(clubName, ownerEmail, subscriptionStatus);
      setSuccess(`Club "${clubName}" was successfully provisioned with ID: ${result.club_id}`);
      setClubName('');
      setOwnerEmail('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Provision New Club</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700">{success}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="max-w-lg bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="clubName">
            Club Name
          </label>
          <input
            type="text"
            id="clubName"
            value={clubName}
            onChange={(e) => setClubName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="ownerEmail">
            Owner Email
          </label>
          <input
            type="email"
            id="ownerEmail"
            value={ownerEmail}
            onChange={(e) => setOwnerEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="subscriptionStatus">
            Subscription Status
          </label>
          <select
            id="subscriptionStatus"
            value={subscriptionStatus}
            onChange={(e) => setSubscriptionStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="trialing">Trialing</option>
            <option value="active">Active</option>
            <option value="past_due">Past Due</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {loading ? 'Provisioning...' : 'Provision Club'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminClubProvisioning;