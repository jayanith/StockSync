import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser, registerUser, getCurrentUser } from '@/lib/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in on page load
    const checkLoggedIn = async () => {
      setLoading(true);
      try {
        // First try to get user from localStorage to prevent flicker
        const storedUserInfo = localStorage.getItem('userInfo');
        const token = localStorage.getItem('authToken');
        
        if (storedUserInfo && token) {
          // Immediately set user from localStorage
          const parsedUser = JSON.parse(storedUserInfo);
          setCurrentUser(parsedUser);
          
          // Then verify with backend in the background
          try {
            const userData = await getCurrentUser();
            if (userData && userData.user) {
              // Update user data if needed
              setCurrentUser(userData.user);
            } else {
              // Only clear if backend explicitly says token is invalid
              // But don't redirect to login - this prevents the login redirect on page reload
              console.warn('Backend could not verify user, but keeping local session active');
            }
          } catch (error) {
            // If there's a network error or other non-auth error,
            // keep the user logged in with localStorage data
            console.warn('Error verifying auth with backend, using stored credentials:', error);
            // Only log out if it's a 401 Unauthorized
            if (error.message && error.message.includes('401')) {
              localStorage.removeItem('authToken');
              localStorage.removeItem('userInfo');
              setCurrentUser(null);
            }
          }
        } else {
          // No stored credentials
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginUser(credentials);
      
      // Store token, user info, and login time
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userInfo', JSON.stringify(response.user));
      localStorage.setItem('loginTime', new Date().toISOString());
      
      // Enhance user with status
      const enhancedUser = {
        ...response.user,
        status: 'Active',
        lastLogin: new Date().toLocaleString()
      };
      
      setCurrentUser(enhancedUser);
      return response;
    } catch (error) {
      setError(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await registerUser(userData);
      
      // Store token and user info
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userInfo', JSON.stringify(response.user));
      
      setCurrentUser(response.user);
      return response;
    } catch (error) {
      setError(error.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
