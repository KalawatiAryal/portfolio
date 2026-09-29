/**
 * Project Detail Page
 * Shows a single project fetched from the API or router state
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { projectAPI } from '../services/portfolioService';
import '../styles/ProjectDetail.css';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [project, setProject] = useState(location.state?.project || null);
  const [loading, setLoading] = useState(!location.state?.project);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const data = await projectAPI.getById(id);
        setProject(data);
        setError('');
      } catch (err) {
        console.error('Error fetching project:', err);
        if (!location.state?.project) {
          setError('Project not found');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id, location.state?.project]);

  const getImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith('http')) return image;
    const apiRoot = 'http://localhost:8000';
    return `${apiRoot}${image}`;
  };

  if (loading) {
    return (
      <div className="project-detail-page">
        <div className="project-detail-container">
          <div className="loading-skeleton">
            <div className="skeleton-title"></div>
            <div className="skeleton-text"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="project-detail-page">
        <div className="project-detail-container">
          <div className="project-detail-card">
            <h2>Project not found</h2>
            <p>{error || 'The project you are looking for does not exist.'}</p>
            <button onClick={() => navigate('/')} className="btn btn-primary">
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="project-detail-page">
      <div className="project-detail-container">
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back
        </button>

        <div className="project-detail-card">
          {project.is_featured && <span className="featured-badge">⭐ Featured</span>}

          <h1 className="project-detail-title">{project.title}</h1>

          {project.image && (
            <div className="project-detail-image">
              <img src={getImageUrl(project.image)} alt={project.title} />
            </div>
          )}

          {project.technologies && (
            <div className="project-detail-meta">
              <span className="meta-label">Technologies</span>
              <p className="project-tech">{project.technologies}</p>
            </div>
          )}

          <div className="project-detail-body">
            <h3>Description</h3>
            <p className="project-description">{project.description}</p>
          </div>

          <div className="project-detail-links">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link primary"
              >
                🔗 View Live
              </a>
            )}
            {project.github_link && (
              <a
                href={project.github_link}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link secondary"
              >
                💻 View Code
              </a>
            )}
            <Link to="/" className="project-link ghost">
              🏠 Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
