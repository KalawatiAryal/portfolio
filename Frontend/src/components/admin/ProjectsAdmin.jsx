/**
 * Projects Admin Component
 * Manage portfolio projects
 */

import React, { useState, useEffect } from 'react';
import { projectAPI } from '../../services/portfolioService';
import '../../styles/admin/SkillsAdmin.css';

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    link: '',
    github_link: '',
    is_featured: false,
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await projectAPI.getAll();
      setProjects(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects. Make sure you\'re logged in as admin.');
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

    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Title and description are required');
      return;
    }

    setFormLoading(true);

    try {
      if (editingId) {
        await projectAPI.update(editingId, formData);
        setSuccess('Project updated successfully!');
        setEditingId(null);
      } else {
        await projectAPI.create(formData);
        setSuccess('Project created successfully!');
      }

      setFormData({
        title: '',
        description: '',
        technologies: '',
        link: '',
        github_link: '',
        is_featured: false,
      });

      await fetchProjects();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error saving project:', err);
      setError(err.message || 'Failed to save project');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (project) => {
    setFormData({
      title: project.title || '',
      description: project.description || '',
      technologies: project.technologies || '',
      link: project.link || '',
      github_link: project.github_link || '',
      is_featured: project.is_featured || false,
    });
    setEditingId(project.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      technologies: '',
      link: '',
      github_link: '',
      is_featured: false,
    });
    setError('');
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;

    try {
      setError('');
      await projectAPI.delete(id);
      setSuccess(`"${title}" has been deleted`);
      await fetchProjects();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting project:', err);
      setError(`Failed to delete "${title}"`);
    }
  };

  return (
    <div className="skills-admin-component">
      <h2>📁 Projects Management</h2>

      <div className="skills-admin-container">
        <div className="skills-form-section">
          <h3>{editingId ? 'Edit Project' : 'Add New Project'}</h3>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit} className="skills-form">
            <div className="form-group">
              <label htmlFor="title">Project Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., E-Commerce Platform"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Project description"
                rows="4"
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="technologies">Technologies</label>
              <input
                type="text"
                id="technologies"
                name="technologies"
                value={formData.technologies}
                onChange={handleInputChange}
                placeholder="e.g., React, Django, PostgreSQL"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="link">Project Link</label>
                <input
                  type="url"
                  id="link"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="github_link">GitHub Link</label>
                <input
                  type="url"
                  id="github_link"
                  name="github_link"
                  value={formData.github_link}
                  onChange={handleInputChange}
                  placeholder="https://github.com/..."
                />
              </div>
            </div>

            <div className="form-group form-checkbox">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleInputChange}
                />
                <span>Featured project</span>
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" disabled={formLoading} className="btn btn-primary">
                {formLoading ? 'Saving...' : (editingId ? 'Update Project' : 'Add Project')}
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
          <h3>Existing Projects</h3>

          {loading ? (
            <div className="loading">⏳ Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="empty-state">
              <p>📝 No projects yet. Add one to get started!</p>
            </div>
          ) : (
            <div className="skills-admin-grid">
              {projects.map(project => (
                <div key={project.id} className="skill-admin-card">
                  <div className="skill-admin-header">
                    <span className="skill-admin-icon">💼</span>
                    <div className="skill-admin-info">
                      <h4>{project.title}</h4>
                      <span className="skill-admin-level">
                        {project.is_featured ? '⭐ Featured' : 'Project'}
                      </span>
                    </div>
                  </div>

                  <p className="skill-admin-description">{project.description}</p>

                  {project.technologies && (
                    <p className="skill-admin-description" style={{ marginTop: 0 }}>
                      <strong>Tech:</strong> {project.technologies}
                    </p>
                  )}

                  <div className="skill-admin-meta">
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="status-badge active">
                        🔗 Live
                      </a>
                    )}
                    {project.github_link && (
                      <a href={project.github_link} target="_blank" rel="noopener noreferrer" className="order-badge">
                        💻 GitHub
                      </a>
                    )}
                  </div>

                  <div className="card-buttons">
                    <button
                      onClick={() => handleEdit(project)}
                      className="btn btn-small btn-primary"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project.id, project.title)}
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
