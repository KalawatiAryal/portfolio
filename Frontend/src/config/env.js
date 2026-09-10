/**
 * Environment Configuration
 * Centralized configuration for different environments
 */

export const config = {
  // API URLs
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/auth',
  PORTFOLIO_API_URL: import.meta.env.VITE_PORTFOLIO_API_URL || 'http://localhost:8000/api/portfolio',
  
  // App Settings
  APP_NAME: 'Portfolio',
  APP_VERSION: '1.0.0',
  
  // JWT Settings
  JWT_STORAGE_KEY: 'accessToken',
  REFRESH_TOKEN_KEY: 'refreshToken',
  USER_STORAGE_KEY: 'user',
  
  // Timeouts
  REQUEST_TIMEOUT: 30000, // 30 seconds
  TOKEN_REFRESH_BUFFER: 5 * 60, // 5 minutes before expiry
  
  // Environment
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  
  // Feature Flags
  ENABLE_AUTH: true,
  ENABLE_PORTFOLIO: true,
  ENABLE_CONTACT: true,
}

export default config
