import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

// Create the auth context
const AuthContext = createContext(null);

// Create the AuthProvider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('authToken');
        
        if (token) {
          // Set the token in the API headers
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Get user data
          const response = await api.get('/auth/me');
          setCurrentUser(response.data);
        }
      } catch (err) {
        console.error('Authentication check failed:', err);
        // Clear any invalid tokens
        localStorage.removeItem('authToken');
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Login function
  const login = async (email, password) => {
    setError(null);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      // Store the token in localStorage
      localStorage.setItem('authToken', token);
      
      // Set the token in the API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Update the current user
      setCurrentUser(user);
      return user;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  // Register function
  const register = async (userData) => {
    setError(null);
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('authToken');
    delete api.defaults.headers.common['Authorization'];
    setCurrentUser(null);
  };

  // The value that will be provided to consumers of this context
  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;