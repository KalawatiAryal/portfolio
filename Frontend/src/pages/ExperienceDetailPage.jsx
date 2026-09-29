/**
 * Experience Detail Page
 * Shows a single experience fetched from the API or router state
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { experienceAPI } from '../services/portfolioService';
import '../styles/ExperienceDetail.css';

export default function ExperienceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [experience, setExperience] = useState(location.state?.experience || null);
  const [loading, setLoading] = useState(!location.state?.experience);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        setLoading(true);
        const data = await experienceAPI.getById(id);
        setExperience(data);
        setError('');
      } catch (err) {
        console.error('Error fetching experience:', err);
        if (!location.state?.experience) {
          setError('Experience not found');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchExperience();
    }
  }, [id, location.state?.experience]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  if (loading) {
    return (
      <div className="experience-detail-page">
        <div className="experience-detail-container">
          <div className="loading-skeleton">
            <div className="skeleton-title"></div>
            <div className="skeleton-text"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="experience-detail-page">
        <div className="experience-detail-container">
          <div className="experience-detail-card">
            <h2>Experience not found</h2>
            <p>{error || 'The experience you are looking for does not exist.'}</p>
            <button onClick={() => navigate('/')} className="btn btn-primary">
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="experience-detail-page">
      <div className="experience-detail-container">
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back
        </button>

        <div className="experience-detail-card">
          {experience.is_current && <span className="current-badge">✓ Current</span>}

          <h1 className="experience-detail-title">{experience.title}</h1>
          <h2 className="experience-company">{experience.company}</h2>

          <div className="experience-detail-meta">
            <span className="meta-label">Duration</span>
            <p className="experience-dates">
              {formatDate(experience.start_date)} — {experience.is_current ? 'Present' : formatDate(experience.end_date)}
            </p>
          </div>

          {experience.description && (
            <div className="experience-detail-body">
              <h3>Description</h3>
              <p className="experience-description">{experience.description}</p>
            </div>
          )}

          <div className="experience-detail-links">
            <Link to="/" className="project-link ghost">
              🏠 Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
