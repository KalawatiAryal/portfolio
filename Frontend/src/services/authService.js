/**
 * Authentication Service
 * Handles all authentication API calls and token management
 */

import config from '../config/env'

const API_BASE_URL = config.API_BASE_URL;

// Token management
export const tokenService = {
  // Get access token from localStorage
  getAccessToken: () => {
    return localStorage.getItem('accessToken');
  },

  // Get refresh token from localStorage
  getRefreshToken: () => {
    return localStorage.getItem('refreshToken');
  },

  // Set tokens in localStorage
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  },

  // Remove tokens from localStorage
  clearTokens: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  // Get stored user data
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Store user data
  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  },
};

// Authentication API calls
export const authAPI = {
  /**
   * Login user
   * @param {string} username - Username
   * @param {string} password - Password
   * @returns {Promise} Response with user data and tokens
   */
  login: async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }

      const data = await response.json();
      
      // Store tokens and user data
      tokenService.setTokens(data.tokens.access_token, data.tokens.refresh_token);
      tokenService.setUser(data.user);

      return data;
    } catch (error) {
      throw new Error(error.message || 'An error occurred during login');
    }
  },

  /**
   * Register new user
   * @param {object} userData - User registration data
   * @returns {Promise} Response with user data and tokens
   */
  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(JSON.stringify(error));
      }

      const data = await response.json();
      
      // Store tokens and user data
      tokenService.setTokens(data.tokens.access_token, data.tokens.refresh_token);
      tokenService.setUser(data.user);

      return data;
    } catch (error) {
      throw new Error(error.message || 'An error occurred during registration');
    }
  },

  /**
   * Logout user
   * @returns {Promise}
   */
  logout: async () => {
    try {
      const accessToken = tokenService.getAccessToken();
      
      if (accessToken) {
        await fetch(`${API_BASE_URL}/logout/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });
      }

      // Clear local tokens
      tokenService.clearTokens();
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear tokens even if API call fails
      tokenService.clearTokens();
    }
  },

  /**
   * Refresh access token
   * @returns {Promise} New tokens
   */
  refreshToken: async () => {
    try {
      const refreshToken = tokenService.getRefreshToken();
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${API_BASE_URL}/refresh-token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      tokenService.setTokens(data.tokens.access_token, data.tokens.refresh_token);

      return data.tokens;
    } catch (error) {
      tokenService.clearTokens();
      throw new Error(error.message || 'Token refresh failed');
    }
  },

  /**
   * Get current user profile
   * @returns {Promise} User profile data
   */
  getCurrentUser: async () => {
    try {
      const accessToken = tokenService.getAccessToken();

      if (!accessToken) {
        throw new Error('No access token');
      }

      const response = await fetch(`${API_BASE_URL}/me/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Try to refresh token
          await authAPI.refreshToken();
          return authAPI.getCurrentUser();
        }
        throw new Error('Failed to fetch user');
      }

      const data = await response.json();
      tokenService.setUser(data);
      return data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch user profile');
    }
  },

  /**
   * Update user profile
   * @param {object} profileData - Profile data to update
   * @returns {Promise}
   */
  updateProfile: async (profileData) => {
    try {
      const accessToken = tokenService.getAccessToken();
      const isFormData = profileData instanceof FormData;

      const response = await fetch(`${API_BASE_URL}/update-profile/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        },
        body: isFormData ? profileData : JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error('Profile update failed');
      }

      const data = await response.json();
      tokenService.setUser(data.user);
      return data;
    } catch (error) {
      throw new Error(error.message || 'Profile update failed');
    }
  },

  /**
   * Change password
   * @param {string} oldPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise}
   */
  changePassword: async (oldPassword, newPassword, confirmPassword = newPassword) => {
    try {
      const accessToken = tokenService.getAccessToken();

      const response = await fetch(`${API_BASE_URL}/change-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
          new_password2: confirmPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.new_password?.[0] ||
          errorData.old_password?.[0] ||
          errorData.error ||
          'Password change failed'
        );
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Password change failed');
    }
  },
};

// Create a fetch wrapper with automatic token refresh
export const fetchWithAuth = async (url, options = {}) => {
  let accessToken = tokenService.getAccessToken();

  // Add authorization header if token exists
  if (accessToken && !options.headers) {
    options.headers = {};
  }

  if (accessToken) {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`,
    };
  }

  let response = await fetch(url, options);

  // If unauthorized, try to refresh token and retry
  if (response.status === 401 && tokenService.getRefreshToken()) {
    try {
      await authAPI.refreshToken();
      accessToken = tokenService.getAccessToken();
      
      if (options.headers) {
        options.headers['Authorization'] = `Bearer ${accessToken}`;
      }

      response = await fetch(url, options);
    } catch (error) {
      console.error('Token refresh failed:', error);
      tokenService.clearTokens();
    }
  }

  return response;
};
