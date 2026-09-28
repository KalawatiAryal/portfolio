/**
 * Skills Admin Component
 * Manage homepage skills
 */

import React, { useState, useEffect } from 'react';
import { homeAPI } from '../../services/homeService';
import '../../styles/admin/SkillsAdmin.css';

export default function SkillsAdmin() {
  const [skills, setSkills] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    iconUrl: '',
    color: '#667eea',
    level: 0,
    description: '',
    order: 0,
    is_active: true,
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await homeAPI.getSkills();
      setSkills(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error('Error fetching skills:', err);
      setError('Failed to load skills. Make sure you\'re logged in as admin.');
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

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? 0 : Math.max(0, Math.min(100, parseInt(value, 10) || 0)),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name.trim() || !formData.iconUrl.trim() || !formData.description.trim()) {
      setError('Name, icon URL, and description are required');
      return;
    }

    setFormLoading(true);

    try {
      const payload = {
        ...formData,
        level: parseInt(formData.level, 10) || 0,
        order: parseInt(formData.order, 10) || 0,
      };

      if (editingId) {
        await homeAPI.updateSkill(editingId, payload);
        setSuccess('Skill updated successfully!');
        setEditingId(null);
      } else {
        await homeAPI.createSkill(payload);
        setSuccess('Skill created successfully!');
      }

      setFormData({
        name: '',
        iconUrl: '',
        color: '#667eea',
        level: 0,
        description: '',
        order: 0,
        is_active: true,
      });

      await fetchSkills();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error saving skill:', err);
      setError(err.message || 'Failed to save skill');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (skill) => {
    setFormData({
      name: skill.name || '',
      iconUrl: skill.iconUrl || '',
      color: skill.color || '#667eea',
      level: skill.level ?? 0,
      description: skill.description || '',
      order: skill.order ?? 0,
      is_active: skill.is_active ?? true,
    });
    setEditingId(skill.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      name: '',
      iconUrl: '',
      color: '#667eea',
      level: 0,
      description: '',
      order: 0,
      is_active: true,
    });
    setError('');
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;

    try {
      setError('');
      await homeAPI.deleteSkill(id);
      setSuccess(`${name} has been deleted`);
      await fetchSkills();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting skill:', err);
      setError(`Failed to delete ${name}`);
    }
  };

  return (
    <div className="skills-admin-component">
      <h2>🛠️ Skills Management</h2>

      <div className="skills-admin-container">
        {/* Form Section */}
        <div className="skills-form-section">
          <h3>{editingId ? 'Edit Skill' : 'Add New Skill'}</h3>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit} className="skills-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Skill Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Python"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="iconUrl">Icon URL *</label>
                <input
                  type="url"
                  id="iconUrl"
                  name="iconUrl"
                  value={formData.iconUrl}
                  onChange={handleInputChange}
                  placeholder="https://cdn.jsdelivr.net/gh/devicons/..."
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="color">Brand Color</label>
                <div className="color-input-group">
                  <input
                    type="color"
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    placeholder="#667eea"
                    className="color-text"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="level">Proficiency (%)</label>
                <input
                  type="number"
                  id="level"
                  name="level"
                  min="0"
                  max="100"
                  value={formData.level}
                  onChange={handleNumberChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="order">Display Order</label>
                <input
                  type="number"
                  id="order"
                  name="order"
                  min="0"
                  value={formData.order}
                  onChange={handleNumberChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Short description of the skill"
                rows="3"
                required
              ></textarea>
            </div>

            <div className="form-group form-checkbox">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                />
                <span>Active (visible on homepage)</span>
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" disabled={formLoading} className="btn btn-primary">
                {formLoading ? 'Saving...' : (editingId ? 'Update Skill' : 'Add Skill')}
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

        {/* Skills List */}
        <div className="skills-list-section">
          <h3>Existing Skills</h3>

          {loading ? (
            <div className="loading">⏳ Loading skills...</div>
          ) : skills.length === 0 ? (
            <div className="empty-state">
              <p>📝 No skills yet. Add one to get started!</p>
            </div>
          ) : (
            <div className="skills-admin-grid">
              {skills.map(skill => (
                <div key={skill.id} className={`skill-admin-card ${skill.is_active ? '' : 'inactive'}`}>
                  <div className="skill-admin-header">
                    <img
                      src={skill.iconUrl}
                      alt={`${skill.name} logo`}
                      className="skill-admin-icon"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div className="skill-admin-info">
                      <h4>{skill.name}</h4>
                      <span className="skill-admin-level">{skill.level}%</span>
                    </div>
                  </div>

                  <div className="skill-admin-progress">
                    <div
                      className="skill-admin-progress-bar"
                      style={{ width: `${skill.level}%`, backgroundColor: skill.color }}
                    ></div>
                  </div>

                  <p className="skill-admin-description">{skill.description}</p>

                  <div className="skill-admin-meta">
                    <span className={`status-badge ${skill.is_active ? 'active' : 'inactive'}`}>
                      {skill.is_active ? '✓ Active' : '✗ Inactive'}
                    </span>
                    <span className="order-badge">Order: {skill.order}</span>
                  </div>

                  <div className="card-buttons">
                    <button
                      onClick={() => handleEdit(skill)}
                      className="btn btn-small btn-primary"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(skill.id, skill.name)}
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
