/**
 * Hero Admin Component
 * Manage hero section content
 */

import React, { useState, useEffect } from 'react';
import { homeAPI } from '../../services/homeService';
import '../../styles/admin/HeroAdmin.css';

export default function HeroAdmin() {
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    primary_btn_text: 'Get Started Now',
    primary_btn_link: '/register',
    secondary_btn_text: 'Sign In',
    secondary_btn_link: '/login',
    background_color: '#ffffff',
    text_color: '#000000',
    stats: [
      { label: 'Active Users', value: '1000+' },
      { label: 'Projects Shared', value: '5000+' },
      { label: 'User Satisfaction', value: '98%' }
    ]
  });

  const [heroes, setHeroes] = useState([]);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [heroesLoading, setHeroesLoading] = useState(true);

  // Fetch all heroes on mount
  useEffect(() => {
    fetchHeroes();
  }, []);

  const fetchHeroes = async () => {
    try {
      setHeroesLoading(true);
      const data = await homeAPI.getAllHeroSections();
      setHeroes(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error('Error fetching heroes:', err);
      setError('Failed to load hero sections');
    } finally {
      setHeroesLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatChange = (index, field, value) => {
    const newStats = [...formData.stats];
    newStats[index] = {
      ...newStats[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      stats: newStats
    }));
  };

  const addStat = () => {
    setFormData(prev => ({
      ...prev,
      stats: [...prev.stats, { label: '', value: '' }]
    }));
  };

  const removeStat = (index) => {
    if (formData.stats.length > 1) {
      setFormData(prev => ({
        ...prev,
        stats: prev.stats.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Title and description are required');
      return;
    }

    if (formData.stats.some(s => !s.label.trim() || !s.value.trim())) {
      setError('All statistics must have label and value');
      return;
    }

    setFormLoading(true);

    try {
      if (editingId) {
        // Update existing
        await homeAPI.updateHeroSection(editingId, formData);
        setSuccess('Hero section updated successfully!');
        setEditingId(null);
      } else {
        // Create new
        await homeAPI.createHeroSection(formData);
        setSuccess('Hero section created successfully!');
      }

      // Reset form
      setFormData({
        title: '',
        subtitle: '',
        description: '',
        primary_btn_text: 'Get Started Now',
        primary_btn_link: '/register',
        secondary_btn_text: 'Sign In',
        secondary_btn_link: '/login',
        background_color: '#ffffff',
        text_color: '#000000',
        stats: [
          { label: 'Active Users', value: '1000+' },
          { label: 'Projects Shared', value: '5000+' },
          { label: 'User Satisfaction', value: '98%' }
        ]
      });

      // Refresh list
      await fetchHeroes();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.message || 'Failed to save hero section');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (hero) => {
    setFormData({
      title: hero.title || '',
      subtitle: hero.subtitle || '',
      description: hero.description || '',
      primary_btn_text: hero.primary_btn_text || 'Get Started Now',
      primary_btn_link: hero.primary_btn_link || '/register',
      secondary_btn_text: hero.secondary_btn_text || 'Sign In',
      secondary_btn_link: hero.secondary_btn_link || '/login',
      background_color: hero.background_color || '#ffffff',
      text_color: hero.text_color || '#000000',
      stats: hero.stats || []
    });
    setEditingId(hero.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      primary_btn_text: 'Get Started Now',
      primary_btn_link: '/register',
      secondary_btn_text: 'Sign In',
      secondary_btn_link: '/login',
      background_color: '#ffffff',
      text_color: '#000000',
      stats: [
        { label: 'Active Users', value: '1000+' },
        { label: 'Projects Shared', value: '5000+' },
        { label: 'User Satisfaction', value: '98%' }
      ]
    });
    setError('');
  };

  return (
    <div className="hero-admin-component">
      <h2>🎨 Hero Section Management</h2>

      <div className="hero-admin-container">
        {/* Form Section */}
        <div className="hero-form-section">
          <h3>{editingId ? 'Edit Hero Section' : 'Create New Hero'}</h3>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit} className="hero-form">
            {/* Title */}
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Hello, I'm Kala"
                required
              />
            </div>

            {/* Subtitle */}
            <div className="form-group">
              <label htmlFor="subtitle">Subtitle</label>
              <input
                type="text"
                id="subtitle"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                placeholder="e.g., Full-Stack Developer"
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Hero section description"
                rows="4"
                required
              ></textarea>
            </div>

            {/* Button Texts and Links */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="primary_btn_text">Primary Button Text</label>
                <input
                  type="text"
                  id="primary_btn_text"
                  name="primary_btn_text"
                  value={formData.primary_btn_text}
                  onChange={handleInputChange}
                  placeholder="Get Started Now"
                />
              </div>

              <div className="form-group">
                <label htmlFor="primary_btn_link">Primary Button Link</label>
                <input
                  type="text"
                  id="primary_btn_link"
                  name="primary_btn_link"
                  value={formData.primary_btn_link}
                  onChange={handleInputChange}
                  placeholder="/register"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="secondary_btn_text">Secondary Button Text</label>
                <input
                  type="text"
                  id="secondary_btn_text"
                  name="secondary_btn_text"
                  value={formData.secondary_btn_text}
                  onChange={handleInputChange}
                  placeholder="Sign In"
                />
              </div>

              <div className="form-group">
                <label htmlFor="secondary_btn_link">Secondary Button Link</label>
                <input
                  type="text"
                  id="secondary_btn_link"
                  name="secondary_btn_link"
                  value={formData.secondary_btn_link}
                  onChange={handleInputChange}
                  placeholder="/login"
                />
              </div>
            </div>

            {/* Colors */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="background_color">Background Color</label>
                <div className="color-input-group">
                  <input
                    type="color"
                    id="background_color"
                    name="background_color"
                    value={formData.background_color}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    value={formData.background_color}
                    onChange={handleInputChange}
                    name="background_color"
                    placeholder="#ffffff"
                    className="color-text"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="text_color">Text Color</label>
                <div className="color-input-group">
                  <input
                    type="color"
                    id="text_color"
                    name="text_color"
                    value={formData.text_color}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    value={formData.text_color}
                    onChange={handleInputChange}
                    name="text_color"
                    placeholder="#000000"
                    className="color-text"
                  />
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="form-group">
              <label>Statistics *</label>
              <div className="stats-container">
                {formData.stats.map((stat, index) => (
                  <div key={index} className="stat-input-group">
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                      placeholder="Label (e.g., Active Users)"
                      required
                    />
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => handleStatChange(index, 'value', e.target.value)}
                      placeholder="Value (e.g., 1000+)"
                      required
                    />
                    {formData.stats.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStat(index)}
                        className="btn-remove-stat"
                        title="Remove stat"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addStat}
                className="btn-add-stat"
              >
                + Add Statistic
              </button>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button type="submit" disabled={formLoading} className="btn btn-primary">
                {formLoading ? 'Saving...' : (editingId ? 'Update Hero' : 'Create Hero')}
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

        {/* Heroes List */}
        <div className="heroes-list-section">
          <h3>Existing Hero Sections</h3>

          {heroesLoading ? (
            <div className="loading">⏳ Loading hero sections...</div>
          ) : heroes.length === 0 ? (
            <div className="empty-state">
              <p>📝 No hero sections yet. Create one to get started!</p>
            </div>
          ) : (
            <div className="heroes-grid">
              {heroes.map(hero => (
                <div key={hero.id} className="hero-card">
                  <div className="hero-card-header">
                    <h4>{hero.title}</h4>
                    {hero.subtitle && <p className="subtitle">{hero.subtitle}</p>}
                  </div>

                  <p className="description">{hero.description}</p>

                  {hero.stats && hero.stats.length > 0 && (
                    <div className="card-stats">
                      <strong>Statistics:</strong>
                      <ul>
                        {hero.stats.map((stat, idx) => (
                          <li key={idx}>
                            <span className="stat-value">{stat.value}</span>
                            <span className="stat-label">{stat.label}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="card-buttons">
                    <button
                      onClick={() => handleEdit(hero)}
                      className="btn btn-small btn-primary"
                    >
                      ✏️ Edit
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
