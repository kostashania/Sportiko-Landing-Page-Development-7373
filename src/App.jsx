import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import supabase from './lib/supabase';

// Components
import ClubList from './components/ClubList';
import ClubDashboard from './components/ClubDashboard';
import AppManager from './components/AppManager';
import AdminClubProvisioning from './components/AdminClubProvisioning';
import NotFound from './components/NotFound';
import Header from './components/Header';
import Login from './components/Login';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Check if user is admin
        if (session?.user) {
          const { data } = await supabase
            .from('admin_users')
            .select('is_super_admin')
            .eq('user_id', session.user.id)
            .maybeSingle();
          
          setIsAdmin(!!data?.is_super_admin);
        } else {
          setIsAdmin(false);
        }
      }
    );
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Check if user is admin
      if (session?.user) {
        supabase
          .from('admin_users')
          .select('is_super_admin')
          .eq('user_id', session.user.id)
          .maybeSingle()
          .then(({ data }) => {
            setIsAdmin(!!data?.is_super_admin);
            setLoading(false);
          });
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (loading) return <div className="p-6">Loading...</div>;
    if (!session) return <Navigate to="/login" />;
    return children;
  };
  
  // Admin route component
  const AdminRoute = ({ children }) => {
    if (loading) return <div className="p-6">Loading...</div>;
    if (!session) return <Navigate to="/login" />;
    if (!isAdmin) return <Navigate to="/" />;
    return children;
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header user={user} isAdmin={isAdmin} />
        
        <div className="container mx-auto py-6">
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <ClubList />
              </ProtectedRoute>
            } />
            
            <Route path="/clubs/:clubId" element={
              <ProtectedRoute>
                <ClubDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/clubs/:clubId/apps" element={
              <ProtectedRoute>
                <AppManager />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/clubs/provision" element={
              <AdminRoute>
                <AdminClubProvisioning />
              </AdminRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;