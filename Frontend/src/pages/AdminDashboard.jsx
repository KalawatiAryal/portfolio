/**
 * Admin Dashboard
 * Central admin panel for managing all site content
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { homeAPI } from '../services/homeService';
import HeroAdmin from '../components/admin/HeroAdmin';
import NewsletterAdmin from '../components/admin/NewsletterAdmin';
import '../styles/AdminDashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    refreshUser();
  }, []);

  const avatarSrc = user?.profile?.profile_picture_url || user?.profile?.profile_picture;
  const initials =
    (user?.first_name?.[0] || '') + (user?.last_name?.[0] || '') ||
    user?.username?.[0] ||
    'A';

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-avatar">
            {avatarSrc ? (
              <img src={avatarSrc} alt="Profile" />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <h2 className="sidebar-title">🎛️ Admin Panel</h2>
          <p className="sidebar-user">
            Welcome, {user?.first_name || user?.username || 'Admin'}
          </p>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
            title="Dashboard overview"
          >
            <span className="nav-icon">📊</span>
            <span className="nav-label">Dashboard</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'hero' ? 'active' : ''}`}
            onClick={() => setActiveTab('hero')}
            title="Manage hero sections"
          >
            <span className="nav-icon">🎨</span>
            <span className="nav-label">Hero Section</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'newsletter' ? 'active' : ''}`}
            onClick={() => setActiveTab('newsletter')}
            title="Manage newsletter subscribers"
          >
            <span className="nav-icon">📧</span>
            <span className="nav-label">Newsletter</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button
            className="btn-logout"
            onClick={() => navigate('/profile')}
            title="My Profile"
          >
            <span>👤</span> Profile
          </button>
          <button
            className="btn-logout"
            onClick={handleLogout}
            title="Logout"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-content">
        {/* Header */}
        <div className="admin-header">
          <div className="header-left">
            <h1 className="header-title">Admin Panel</h1>
            <p className="header-subtitle">Manage your site content</p>
          </div>
          <div className="header-right">
            <div className="header-user">
              <div className="header-avatar">
                {avatarSrc ? (
                  <img src={avatarSrc} alt="Profile" />
                ) : (
                  <span>{initials}</span>
                )}
              </div>
              <span className="header-user-name">
                {user?.first_name || user?.username}
              </span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="admin-main">
          {activeTab === 'dashboard' && <DashboardOverview />}
          {activeTab === 'hero' && <HeroAdmin />}
          {activeTab === 'newsletter' && <NewsletterAdmin />}
        </div>
      </main>
    </div>
  );
}

/**
 * Dashboard Overview Component
 * Homepage-styled cards with gradients and animations
 */
function DashboardOverview() {
  const [stats, setStats] = useState({
    subscribers: 0,
    heroes: 0,
    loading: true,
  });

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const subCount = await homeAPI.getSubscriberCount();
        const heroes = await homeAPI.getAllHeroSections();

        setStats({
          subscribers: subCount.total_subscribers || 0,
          heroes: Array.isArray(heroes) ? heroes.length : (heroes.results?.length || 0),
          loading: false,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="dashboard-overview">
      {/* Hero Welcome */}
      <section className="admin-hero">
        <div className="admin-hero-content">
          <h2 className="admin-hero-title">
            Welcome back, <span className="gradient-text">Admin</span>
          </h2>
          <p className="admin-hero-subtitle">
            Manage your site content, track newsletter subscribers, and keep your homepage fresh.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="admin-stats">
        <div className="admin-stat-card">
          <div className="admin-stat-icon">📧</div>
          <div className="admin-stat-content">
            <h3>Newsletter Subscribers</h3>
            <p className="admin-stat-number">
              {stats.loading ? '...' : stats.subscribers}
            </p>
            <p className="admin-stat-label">Active subscribers</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">🎨</div>
          <div className="admin-stat-content">
            <h3>Hero Sections</h3>
            <p className="admin-stat-number">
              {stats.loading ? '...' : stats.heroes}
            </p>
            <p className="admin-stat-label">Total created</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">⚙️</div>
          <div className="admin-stat-content">
            <h3>Site Status</h3>
            <p className="admin-stat-number">✅</p>
            <p className="admin-stat-label">Everything working</p>
          </div>
        </div>
      </section>

      {/* Quick Guide Cards */}
      <section className="admin-guide">
        <h2 className="admin-section-title">Quick Guide</h2>
        <div className="admin-guide-grid">
          <div className="admin-guide-card">
            <div className="admin-guide-icon">🎨</div>
            <h3>Hero Section</h3>
            <p>Manage the main hero banner with title, description, buttons, and statistics.</p>
          </div>

          <div className="admin-guide-card">
            <div className="admin-guide-icon">📧</div>
            <h3>Newsletter</h3>
            <p>View and manage subscribers, including their subscription status and date.</p>
          </div>

          <div className="admin-guide-card">
            <div className="admin-guide-icon">👤</div>
            <h3>Admin Profile</h3>
            <p>Your account is set up as admin. Only admin users can access this panel.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
