/**
 * Newsletter Admin Component
 * Manage newsletter subscribers
 */

import React, { useState, useEffect } from 'react';
import { homeAPI } from '../../services/homeService';
import '../../styles/admin/NewsletterAdmin.css';

export default function NewsletterAdmin() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, inactive
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, email

  // Fetch subscribers on mount
  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await homeAPI.getAllSubscribers();
      
      // Ensure data is an array
      const subscribersList = Array.isArray(data) ? data : [];
      setSubscribers(subscribersList);

      // Calculate stats
      const active = subscribersList.filter(s => s.is_subscribed).length;
      const inactive = subscribersList.filter(s => !s.is_subscribed).length;

      setStats({
        total: subscribersList.length,
        active,
        inactive,
      });
    } catch (err) {
      console.error('Error fetching subscribers:', err);
      setError(err.message || 'Failed to load subscribers. Make sure you\'re logged in as admin.');
      setSubscribers([]);
      setStats({ total: 0, active: 0, inactive: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async (id, email) => {
    if (!window.confirm(`Unsubscribe ${email}?`)) return;

    try {
      setError('');
      await homeAPI.updateSubscriber(id, false);
      setSuccess(`${email} has been unsubscribed`);
      await fetchSubscribers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error unsubscribing:', err);
      setError(`Failed to unsubscribe ${email}`);
    }
  };

  const handleResubscribe = async (id, email) => {
    if (!window.confirm(`Resubscribe ${email}?`)) return;

    try {
      setError('');
      await homeAPI.updateSubscriber(id, true);
      setSuccess(`${email} has been resubscribed`);
      await fetchSubscribers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error resubscribing:', err);
      setError(`Failed to resubscribe ${email}`);
    }
  };

  const handleDelete = async (id, email) => {
    if (!window.confirm(`Permanently delete ${email}? This cannot be undone.`)) return;

    try {
      setError('');
      await homeAPI.deleteSubscriber(id);
      setSuccess(`${email} has been deleted`);
      await fetchSubscribers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting subscriber:', err);
      setError(`Failed to delete ${email}`);
    }
  };

  // Filter and sort subscribers
  let filteredSubscribers = subscribers.filter(sub => {
    const matchesSearch =
      sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sub.first_name && sub.first_name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && sub.is_subscribed) ||
      (filterStatus === 'inactive' && !sub.is_subscribed);

    return matchesSearch && matchesStatus;
  });

  // Sort
  filteredSubscribers = filteredSubscribers.sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.subscribed_at) - new Date(a.subscribed_at);
      case 'oldest':
        return new Date(a.subscribed_at) - new Date(b.subscribed_at);
      case 'email':
        return a.email.localeCompare(b.email);
      default:
        return 0;
    }
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="newsletter-admin-component">
      <h2>📧 Newsletter Management</h2>

      {/* Stats */}
      <div className="newsletter-stats">
        <div className="stat-box">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Subscribers</div>
        </div>
        <div className="stat-box active">
          <div className="stat-number">{stats.active}</div>
          <div className="stat-label">Active</div>
        </div>
        <div className="stat-box inactive">
          <div className="stat-number">{stats.inactive}</div>
          <div className="stat-label">Inactive</div>
        </div>
      </div>

      {/* Alerts */}
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Controls */}
      <div className="controls-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search by email or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="select-filter"
          >
            <option value="all">All Subscribers</option>
            <option value="active">✓ Active</option>
            <option value="inactive">✗ Inactive</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="select-filter"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="email">By Email</option>
          </select>
        </div>
      </div>

      {/* Subscribers List */}
      <div className="subscribers-section">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>⏳ Loading subscribers...</p>
          </div>
        ) : filteredSubscribers.length === 0 ? (
          <div className="empty-state">
            <p>📭 {searchTerm ? 'No subscribers match your search' : 'No subscribers yet'}</p>
          </div>
        ) : (
          <div className="subscribers-list">
            <div className="list-header">
              <div className="col-status">Status</div>
              <div className="col-email">Email</div>
              <div className="col-name">Name</div>
              <div className="col-date">Subscribed Date</div>
              <div className="col-actions">Actions</div>
            </div>

            {filteredSubscribers.map((subscriber) => (
              <div key={subscriber.id} className="subscriber-row">
                <div className="col-status">
                  <span className={`status-badge ${subscriber.is_subscribed ? 'active' : 'inactive'}`}>
                    {subscriber.is_subscribed ? '✓ Active' : '✗ Inactive'}
                  </span>
                </div>

                <div className="col-email">
                  <a href={`mailto:${subscriber.email}`} title="Send email">
                    {subscriber.email}
                  </a>
                </div>

                <div className="col-name">
                  {subscriber.first_name || '—'}
                </div>

                <div className="col-date">
                  {formatDate(subscriber.subscribed_at)}
                </div>

                <div className="col-actions">
                  {subscriber.is_subscribed ? (
                    <>
                      <button
                        onClick={() => handleUnsubscribe(subscriber.id, subscriber.email)}
                        className="btn-action btn-unsubscribe"
                        title="Unsubscribe"
                      >
                        📧 Unsubscribe
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleResubscribe(subscriber.id, subscriber.email)}
                        className="btn-action btn-resubscribe"
                        title="Resubscribe"
                      >
                        ♻️ Resubscribe
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => handleDelete(subscriber.id, subscriber.email)}
                    className="btn-action btn-delete"
                    title="Delete permanently"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredSubscribers.length > 0 && (
          <div className="list-footer">
            <p>Showing {filteredSubscribers.length} of {stats.total} subscribers</p>
          </div>
        )}
      </div>
    </div>
  );
}
