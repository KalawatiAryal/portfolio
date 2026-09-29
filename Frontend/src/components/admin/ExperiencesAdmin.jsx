/**
 * Experiences Admin Component
 * Manage work experiences
 */

import React, { useState, useEffect } from 'react';
import { experienceAPI } from '../../services/portfolioService';
import '../../styles/admin/SkillsAdmin.css';

export default function ExperiencesAdmin() {
  const [experiences, setExperiences] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    start_date: '',
    end_date: '',
    is_current: false,
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await experienceAPI.getAll();
      setExperiences(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error('Error fetching experiences:', err);
      setError('Failed to load experiences. Make sure you\'re logged in as admin.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title.trim() || !formData.company.trim() || !formData.start_date) {
      setError('Title, company, and start date are required');
      return;
    }

    setFormLoading(true);

    try {
      const payload = {
        ...formData,
        end_date: formData.is_current ? null : formData.end_date || null,
      };

      if (editingId) {
        await experienceAPI.update(editingId, payload);
        setSuccess('Experience updated successfully!');
        setEditingId(null);
      } else {
        await experienceAPI.create(payload);
        setSuccess('Experience created successfully!');
      }

      setFormData({
        title: '',
        company: '',
        description: '',
        start_date: '',
        end_date: '',
        is_current: false,
      });

      await fetchExperiences();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error saving experience:', err);
      setError(err.message || 'Failed to save experience');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (exp) => {
    setFormData({
      title: exp.title || '',
      company: exp.company || '',
      description: exp.description || '',
      start_date: exp.start_date || '',
      end_date: exp.end_date || '',
      is_current: exp.is_current || false,
    });
    setEditingId(exp.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      title: '',
      company: '',
      description: '',
      start_date: '',
      end_date: '',
      is_current: false,
    });
    setError('');
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;

    try {
      setError('');
      await experienceAPI.delete(id);
      setSuccess(`"${title}" has been deleted`);
      await fetchExperiences();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting experience:', err);
      setError(`Failed to delete "${title}"`);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  return (
    <div className="skills-admin-component">
      <h2>💼 Experience Management</h2>

      <div className="skills-admin-container">
        <div className="skills-form-section">
          <h3>{editingId ? 'Edit Experience' : 'Add New Experience'}</h3>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit} className="skills-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">Job Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Senior Developer"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="company">Company *</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="e.g., Cognition"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Job description and responsibilities"
                rows="4"
              ></textarea>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="start_date">Start Date *</label>
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="end_date">End Date</label>
                <input
                  type="date"
                  id="end_date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  disabled={formData.is_current}
                />
              </div>
            </div>

            <div className="form-group form-checkbox">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="is_current"
                  checked={formData.is_current}
                  onChange={handleInputChange}
                />
                <span>Current position</span>
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" disabled={formLoading} className="btn btn-primary">
                {formLoading ? 'Saving...' : (editingId ? 'Update Experience' : 'Add Experience')}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="skills-list-section">
          <h3>Existing Experiences</h3>

          {loading ? (
            <div className="loading">⏳ Loading experiences...</div>
          ) : experiences.length === 0 ? (
            <div className="empty-state">
              <p>📝 No experiences yet. Add one to get started!</p>
            </div>
          ) : (
            <div className="skills-admin-grid">
              {experiences.map(exp => (
                <div key={exp.id} className="skill-admin-card">
                  <div className="skill-admin-header">
                    <span className="skill-admin-icon">💼</span>
                    <div className="skill-admin-info">
                      <h4>{exp.title}</h4>
                      <span className="skill-admin-level">{exp.company}</span>
                    </div>
                  </div>

                  <p className="skill-admin-description">{exp.description}</p>

                  <div className="skill-admin-meta">
                    <span className="status-badge active">
                      {formatDate(exp.start_date)} — {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                    </span>
                  </div>

                  <div className="card-buttons">
                    <button
                      onClick={() => handleEdit(exp)}
                      className="btn btn-small btn-primary"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(exp.id, exp.title)}
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
    </div>
  );
}
