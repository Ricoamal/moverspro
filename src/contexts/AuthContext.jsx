import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        setIsAuthenticated(true);
        setIsAdmin(false); // You may want to set admin based on user metadata
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
      setLoading(false);
    });
    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setIsAuthenticated(true);
        setIsAdmin(false);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const checkAuthStatus = () => {
    // This function is now handled by the effect above
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setUser(data.user);
    setIsAuthenticated(true);
    setIsAdmin(false); // Set based on your app logic
    return data.user;
  };

  const register = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    setUser(data.user);
    setIsAuthenticated(true);
    setIsAdmin(false);
    return data.user;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  const value = {
    user,
    isAuthenticated,
    isAdmin,
    loading,
    login,
    logout,
    register,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
