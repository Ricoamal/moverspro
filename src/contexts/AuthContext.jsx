import React, { createContext, useContext, useState, useEffect } from 'react';

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
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const userType = localStorage.getItem('userType');
      const userEmail = localStorage.getItem('userEmail');
      
      if (userType && userEmail) {
        const userData = {
          email: userEmail,
          type: userType,
          isAdmin: userType === 'admin'
        };
        
        setUser(userData);
        setIsAuthenticated(true);
        setIsAdmin(userType === 'admin');
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const login = (email, password, userType = 'customer') => {
    return new Promise((resolve, reject) => {
      // Mock authentication logic (matches existing LoginForm)
      const mockCredentials = {
        admin: { email: 'admin@moveease.co.ke', password: 'admin123' },
        customer: { email: 'customer@example.com', password: 'customer123' }
      };

      setTimeout(() => {
        if (
          (userType === 'admin' && email === mockCredentials.admin.email && password === mockCredentials.admin.password) ||
          (userType === 'customer' && email === mockCredentials.customer.email && password === mockCredentials.customer.password)
        ) {
          // Successful login
          localStorage.setItem('userType', userType);
          localStorage.setItem('userEmail', email);
          
          const userData = {
            email,
            type: userType,
            isAdmin: userType === 'admin'
          };
          
          setUser(userData);
          setIsAuthenticated(true);
          setIsAdmin(userType === 'admin');
          
          resolve(userData);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  };

  const logout = () => {
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('rememberMe');
    
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
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
