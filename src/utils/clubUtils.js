import supabase from '../lib/supabase';

/**
 * Get all clubs that the current user is a member of
 * @returns {Promise<Array>} List of clubs
 */
export async function getUserClubs() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // First get club IDs the user is a member of
    const { data: memberships, error: membershipError } = await supabase
      .from('club_members')
      .select('club_id, role')
      .eq('user_id', user.id)
      .eq('is_active', true);
      
    if (membershipError) {
      throw membershipError;
    }
    
    if (!memberships || memberships.length === 0) {
      return [];
    }
    
    // Then get the actual club details
    const clubIds = memberships.map(m => m.club_id);
    const { data: clubs, error: clubsError } = await supabase
      .from('clubs')
      .select('*')
      .in('id', clubIds)
      .eq('is_active', true);
      
    if (clubsError) {
      throw clubsError;
    }
    
    // Merge role information into club objects
    return clubs.map(club => {
      const membership = memberships.find(m => m.club_id === club.id);
      return {
        ...club,
        role: membership?.role || 'member'
      };
    });
  } catch (error) {
    console.error('Error fetching user clubs:', error);
    throw error;
  }
}

/**
 * Get apps enabled for a specific club
 * @param {string} clubId The club ID
 * @returns {Promise<Array>} List of enabled apps with their settings
 */
export async function getClubApps(clubId) {
  try {
    const { data, error } = await supabase
      .from('club_apps')
      .select('*')
      .eq('club_id', clubId);
      
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching club apps:', error);
    throw error;
  }
}

/**
 * Toggle an app for a club (enable/disable)
 * @param {string} clubId The club ID
 * @param {string} appType The app type ('academy', 'members', etc.)
 * @param {boolean} enabled Whether to enable or disable the app
 * @param {Object} settings Optional settings for the app
 * @returns {Promise<Object>} Result of the operation
 */
export async function toggleClubApp(clubId, appType, enabled, settings = {}) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('User not authenticated');
    }
    
    // Call our edge function
    const response = await fetch(`${supabase.supabaseUrl}/functions/v1/toggle-club-app`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        clubId,
        appType,
        enabled,
        settings
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to toggle club app');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error toggling club app:', error);
    throw error;
  }
}

/**
 * Get usage statistics for a club
 * @param {string} clubId The club ID
 * @returns {Promise<Object>} Usage statistics
 */
export async function getClubUsage(clubId) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('User not authenticated');
    }
    
    // Call our edge function
    const response = await fetch(`${supabase.supabaseUrl}/functions/v1/get-club-usage?clubId=${clubId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get club usage');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting club usage:', error);
    throw error;
  }
}

/**
 * Provision a new club (super admin only)
 * @param {string} clubName Name of the club
 * @param {string} ownerEmail Email of the club owner
 * @param {string} subscriptionStatus Initial subscription status
 * @returns {Promise<Object>} Result of the operation
 */
export async function provisionClub(clubName, ownerEmail, subscriptionStatus = 'trialing') {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('User not authenticated');
    }
    
    // Call our edge function
    const response = await fetch(`${supabase.supabaseUrl}/functions/v1/provision-club`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        clubName,
        ownerEmail,
        subscriptionStatus
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to provision club');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error provisioning club:', error);
    throw error;
  }
}