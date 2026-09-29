/**
 * Contacts Admin Component
 * Manage contact messages
 */

import React, { useState, useEffect } from 'react';
import { contactAPI } from '../../services/portfolioService';
import '../../styles/admin/SkillsAdmin.css';
import '../../styles/admin/NewsletterAdmin.css';

export default function ContactsAdmin() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, read, unread

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await contactAPI.getAll();
      setContacts(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError('Failed to load contacts. Make sure you\'re logged in as admin.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id, isRead) => {
    try {
      setError('');
      await contactAPI.update(id, { is_read: isRead });
      setSuccess(`Contact marked as ${isRead ? 'read' : 'unread'}`);
      await fetchContacts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating contact:', err);
      setError('Failed to update contact');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete message from "${name}"? This cannot be undone.`)) return;

    try {
      setError('');
      await contactAPI.delete(id);
      setSuccess(`Contact from "${name}" has been deleted`);
      await fetchContacts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting contact:', err);
      setError(`Failed to delete contact from "${name}"`);
    }
  };

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

  const filteredContacts = contacts.filter(contact => {
    if (filterStatus === 'read') return contact.is_read;
    if (filterStatus === 'unread') return !contact.is_read;
    return true;
  });

  const stats = {
    total: contacts.length,
    read: contacts.filter(c => c.is_read).length,
    unread: contacts.filter(c => !c.is_read).length,
  };

  return (
    <div className="skills-admin-component">
      <h2>✉️ Contact Messages</h2>

      <div className="newsletter-stats" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-box">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Messages</div>
        </div>
        <div className="stat-box active">
          <div className="stat-number">{stats.read}</div>
          <div className="stat-label">Read</div>
        </div>
        <div className="stat-box inactive">
          <div className="stat-number">{stats.unread}</div>
          <div className="stat-label">Unread</div>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="controls-section" style={{ marginBottom: '1.5rem' }}>
        <div className="filter-controls">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="select-filter"
          >
            <option value="all">All Messages</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>
      </div>

      <div className="skills-list-section">
        {loading ? (
          <div className="loading">⏳ Loading contacts...</div>
        ) : filteredContacts.length === 0 ? (
          <div className="empty-state">
            <p>📭 {filterStatus === 'all' ? 'No contact messages yet.' : `No ${filterStatus} messages.`}</p>
          </div>
        ) : (
          <div className="skills-admin-grid">
            {filteredContacts.map(contact => (
              <div key={contact.id} className={`skill-admin-card ${contact.is_read ? '' : 'inactive'}`}>
                <div className="skill-admin-header">
                  <span className="skill-admin-icon">✉️</span>
                  <div className="skill-admin-info">
                    <h4>{contact.name}</h4>
                    <a href={`mailto:${contact.email}`} className="skill-admin-level" style={{ textDecoration: 'none' }}>
                      {contact.email}
                    </a>
                  </div>
                </div>

                <p className="skill-admin-description" style={{ whiteSpace: 'pre-wrap' }}>
                  {contact.message}
                </p>

                <div className="skill-admin-meta">
                  <span className={`status-badge ${contact.is_read ? 'active' : 'inactive'}`}>
                    {contact.is_read ? '✓ Read' : '● Unread'}
                  </span>
                  <span className="order-badge">{formatDate(contact.created_at)}</span>
                </div>

                <div className="card-buttons">
                  <button
                    onClick={() => handleMarkRead(contact.id, !contact.is_read)}
                    className="btn btn-small btn-primary"
                  >
                    {contact.is_read ? 'Mark Unread' : 'Mark Read'}
                  </button>
                  <button
                    onClick={() => handleDelete(contact.id, contact.name)}
                    className="btn btn-small btn-delete"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
