/**
 * Protected Route Component
 * Redirects to login if user is not authenticated or not staff
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requireStaff = false }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireStaff && !user?.is_staff) {
    return <Navigate to="/" replace />;
  }

  return children;
}
