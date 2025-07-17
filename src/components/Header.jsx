import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../lib/supabase';

function Header({ user, isAdmin }) {
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-8">
            <Link to="/" className="font-bold text-xl text-blue-600">
              Sportiko SaaS
            </Link>
            
            {user && (
              <nav className="hidden md:flex items-center gap-6">
                <Link to="/" className="text-gray-700 hover:text-blue-600">
                  Clubs
                </Link>
                
                {isAdmin && (
                  <Link to="/admin/clubs/provision" className="text-gray-700 hover:text-blue-600">
                    Provision Club
                  </Link>
                )}
              </nav>
            )}
          </div>
          
          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-sm">
                <span className="text-gray-500">Signed in as:</span>{' '}
                <span className="font-medium text-gray-900">{user.email}</span>
              </div>
              
              <button 
                onClick={handleSignOut}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link 
              to="/login"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;