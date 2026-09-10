/**
 * Authentication Context
 * Provides global authentication state and methods
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI, tokenService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (tokenService.isAuthenticated()) {
          // Get fresh user data from server to ensure is_staff is updated
          try {
            const currentUser = await authAPI.getCurrentUser();
            setUser(currentUser);
          } catch (err) {
            // Fallback to stored user data
            const storedUser = tokenService.getUser();
            setUser(storedUser);
          }
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        tokenService.clearTokens();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.login(username, password);
      setUser(response.user);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.register(userData);
      setUser(response.user);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await authAPI.logout();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    setError(null);
    try {
      const response = await authAPI.updateProfile(profileData);
      setUser(response.user);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Profile update failed';
      setError(errorMessage);
      throw err;
    }
  };

  const refreshUser = async () => {
    if (!tokenService.isAuthenticated()) return;
    try {
      const currentUser = await authAPI.getCurrentUser();
      setUser(currentUser);
      return currentUser;
    } catch (err) {
      console.error('Refresh user failed:', err);
    }
  };

  const changePassword = async (oldPassword, newPassword, confirmPassword = newPassword) => {
    setError(null);
    try {
      const response = await authAPI.changePassword(oldPassword, newPassword, confirmPassword);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Password change failed';
      setError(errorMessage);
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
