/**
 * Login Page Component
 * Minimalist card-based login design
 * Handles user login with backend API integration
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/LoginPage.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading, error: contextError } = useAuth();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Email or Username is required');
      return;
    }

    if (!password) {
      setError('Password is required');
      return;
    }

    try {
      await login(username, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="card-header">
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {/* Error Messages */}
          {(error || contextError) && (
            <div className="error-alert">
              <span>{error || contextError}</span>
            </div>
          )}

          {/* Email/Username Field */}
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Email or Username
            </label>
            <input
              type="text"
              id="username"
              className="form-input"
              placeholder="Enter your email or username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              autoComplete="username"
            />
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          {/* Links */}
          <div className="form-links">
            <Link to="/forgot-password" className="forgot-link">
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="signup-prompt">
          <span>Don't have an account? </span>
          <Link to="/register" className="signup-link">
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}


