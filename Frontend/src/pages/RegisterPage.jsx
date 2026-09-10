/**
 * Register Page Component
 * Minimalist card-based design
 * Handles user registration with backend API integration
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/RegisterPage.css';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading, error: contextError } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('Username is required');
      return false;
    }

    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters');
      return false;
    }

    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email');
      return false;
    }

    if (!formData.password) {
      setError('Password is required');
      return false;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }

    if (formData.password !== formData.password2) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password2: formData.password2,
      });

      navigate('/login');
    } catch (err) {
      const errorData = err.message;
      if (typeof errorData === 'string' && errorData.includes('{')) {
        try {
          const parsed = JSON.parse(errorData);
          const firstError = Object.values(parsed)[0];
          setError(Array.isArray(firstError) ? firstError[0] : firstError);
        } catch {
          setError(errorData);
        }
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="card-header">
          <h1 className="register-title">Create Account</h1>
          <p className="register-subtitle">Join our community</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {/* Error Messages */}
          {(error || contextError) && (
            <div className="error-alert">
              <span>{error || contextError}</span>
            </div>
          )}

          {/* Username Field */}
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-input"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
              autoComplete="username"
            />
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              autoComplete="email"
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
              name="password"
              className="form-input"
              placeholder="Min. 8 characters"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <label htmlFor="password2" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              id="password2"
              name="password2"
              className="form-input"
              placeholder="Confirm your password"
              value={formData.password2}
              onChange={handleChange}
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Login Link */}
        <div className="login-prompt">
          <span>Already have an account? </span>
          <Link to="/login" className="login-link">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}