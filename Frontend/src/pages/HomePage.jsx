/**
 * Home Page Component
 * Modern homepage with hero section, features, newsletter, and footer
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { homeAPI } from '../services/homeService';
import { projectAPI, experienceAPI, contactAPI } from '../services/portfolioService';
import '../styles/HomePage.css';

function SkillIcon({ name, src, color }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="skill-icon" style={{ '--skill-color': color }}>
      {!loaded && (
        <span className="skill-fallback" style={{ color }}>
          {name}
        </span>
      )}
      <img
        src={src}
        alt={`${name} logo`}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(false)}
        style={{ display: loaded ? 'block' : 'none' }}
      />
    </div>
  );
}

export default function HomePage() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Hero state
  const [hero, setHero] = useState(null);
  const [heroLoading, setHeroLoading] = useState(true);
  const [heroError, setHeroError] = useState(null);

  // Newsletter state
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [newsletterStatus, setNewsletterStatus] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  // Skills state
  const [skills, setSkills] = useState([]);
  const [navOpen, setNavOpen] = useState(false);

  // Portfolio state
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);

  // Contact form state
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactStatus, setContactStatus] = useState('');
  const [contactLoading, setContactLoading] = useState(false);

  // Fetch hero section on mount
  useEffect(() => {
    const fetchHero = async () => {
      try {
        setHeroLoading(true);
        const data = await homeAPI.getHeroSection();
        setHero(data);
        setHeroError(null);
      } catch (error) {
        console.error('Error fetching hero:', error);
        setHeroError(error.message);
        // Fallback to default hero
        setHero({
          title: "Hello, I'm Kala",
          subtitle: "Full-Stack Developer",
          description: "I build modern, user-friendly web applications using React, Django, Python and modern web technologies.",
          primary_btn_text: "Get Started Now",
          secondary_btn_text: "Sign In",
          stats: [
            { label: 'Active Users', value: '1000+' },
            { label: 'Projects Shared', value: '5000+' },
            { label: 'User Satisfaction', value: '98%' }
          ]
        });
      } finally {
        setHeroLoading(false);
      }
    };

    fetchHero();
  }, []);

  // Check newsletter subscription status for the current email
  useEffect(() => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setIsSubscribed(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const result = await homeAPI.checkSubscription(trimmedEmail);
        setIsSubscribed(result.is_subscribed);
      } catch (error) {
        setIsSubscribed(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [email]);

  // Pre-fill email for logged-in users
  useEffect(() => {
    if (isAuthenticated && user?.email && !email) {
      setEmail(user.email);
    }
  }, [isAuthenticated, user?.email]);

  // Fetch skills from API, falling back to static JSON if empty or unavailable
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await homeAPI.getSkills();
        const skillsList = Array.isArray(data) ? data : data.results || [];
        if (skillsList.length > 0) {
          setSkills(skillsList);
          return;
        }
        throw new Error('No skills from API');
      } catch (error) {
        console.warn('Falling back to static skills:', error);
        try {
          const response = await fetch('/skills.json');
          if (!response.ok) throw new Error('Failed to load skills');
          const data = await response.json();
          setSkills(data);
        } catch (fallbackError) {
          console.error('Error fetching skills:', fallbackError);
        }
      }
    };

    fetchSkills();
  }, []);

  // Fetch projects and experiences from the portfolio API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectAPI.getAll();
        const projectsList = Array.isArray(data) ? data : data.results || [];
        if (projectsList.length > 0) {
          setProjects(projectsList);
          return;
        }
        throw new Error('No projects from API');
      } catch (error) {
        console.warn('Falling back to static projects:', error);
        try {
          const response = await fetch('/projects.json');
          if (!response.ok) throw new Error('Failed to load projects');
          const data = await response.json();
          setProjects(data);
        } catch (fallbackError) {
          console.error('Error fetching projects:', fallbackError);
        }
      }
    };

    const fetchExperiences = async () => {
      try {
        const data = await experienceAPI.getAll();
        const experiencesList = Array.isArray(data) ? data : data.results || [];
        if (experiencesList.length > 0) {
          setExperiences(experiencesList);
          return;
        }
        throw new Error('No experiences from API');
      } catch (error) {
        console.warn('Falling back to static experiences:', error);
        try {
          const response = await fetch('/experiences.json');
          if (!response.ok) throw new Error('Failed to load experiences');
          const data = await response.json();
          setExperiences(data);
        } catch (fallbackError) {
          console.error('Error fetching experiences:', fallbackError);
        }
      }
    };

    fetchProjects();
    fetchExperiences();
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      setContactStatus('error');
      return;
    }

    setContactLoading(true);
    try {
      await contactAPI.submit(contactForm);
      setContactStatus('success');
      setContactForm({ name: '', email: '', message: '' });
      setTimeout(() => setContactStatus(''), 3000);
    } catch (error) {
      console.error('Contact error:', error);
      setContactStatus('error');
      setTimeout(() => setContactStatus(''), 3000);
    } finally {
      setContactLoading(false);
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setNewsletterStatus('error');
      return;
    }

    setNewsletterLoading(true);
    try {
      if (isSubscribed) {
        await homeAPI.unsubscribeNewsletter(email);
        setIsSubscribed(false);
        setNewsletterStatus('success');
        setFirstName('');
        setTimeout(() => setNewsletterStatus(''), 3000);
      } else {
        await homeAPI.subscribeNewsletter(email, firstName);
        setIsSubscribed(true);
        setNewsletterStatus('success');
        setEmail('');
        setFirstName('');
        setTimeout(() => setNewsletterStatus(''), 3000);
      }
    } catch (error) {
      console.error('Newsletter error:', error);
      setNewsletterStatus('error');
      setTimeout(() => setNewsletterStatus(''), 3000);
    } finally {
      setNewsletterLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  const handleProjectClick = (project) => {
    navigate(`/projects/${project.id}`, { state: { project } });
  };

  const handleExperienceClick = (experience) => {
    navigate(`/experiences/${experience.id}`, { state: { experience } });
  };

  return (
    <div className="home-page">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-content">
          <Link to="/" className="logo">
            <span className="logo-icon"></span>
           Kala
          </Link>

          <button
            className="nav-hamburger"
            aria-label="Toggle navigation"
            onClick={() => setNavOpen(!navOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className={`nav-links ${navOpen ? 'nav-open' : ''}`}>
            <a href="#hero" className="nav-link" onClick={() => setNavOpen(false)}>Home</a>
            <a href="#about" className="nav-link" onClick={() => setNavOpen(false)}>About</a>
            <a href="#skills" className="nav-link" onClick={() => setNavOpen(false)}>Skills</a>
            <a href="#projects" className="nav-link" onClick={() => setNavOpen(false)}>Projects</a>
            <a href="#experience" className="nav-link" onClick={() => setNavOpen(false)}>Experience</a>
            <a href="#contact" className="nav-link" onClick={() => setNavOpen(false)}>Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="hero" style={{
        backgroundColor: hero?.background_color || '#ffffff',
        color: hero?.text_color || '#000000'
      }}>
        <div className="hero-container">
          <div className="hero-content">
            {heroLoading ? (
              <div className="loading-skeleton">
                <div className="skeleton-title"></div>
                <div className="skeleton-text"></div>
              </div>
            ) : (
              <>
                <h1 className="hero-title">
                  {hero?.title || "Hello, I'm Kala"} <br/>
                  <span className="gradient-text">
                    {hero?.subtitle || "Full-Stack Developer"}
                  </span>
                </h1>
                <p className="hero-subtitle">
                  {hero?.description || "I build modern, user-friendly web applications using React, Django, Python and modern web technologies."}
                </p>

                {hero?.logo && (
                  <div className="hero-logo">
                    <img src={hero.logo} alt="Hero Logo" />
                  </div>
                )}

                <div className="hero-buttons">
                  <Link to={hero?.primary_btn_link || "/register"} className="btn btn-primary">
                    {hero?.primary_btn_text || "Get Started Now"}
                  </Link>
                  <Link to={hero?.secondary_btn_link || "/login"} className="btn btn-secondary">
                    {hero?.secondary_btn_text || "Sign In"}
                  </Link>
                </div>

                <div className="hero-stats">
                  {hero?.stats && hero.stats.length > 0 ? (
                    hero.stats.map((stat, idx) => (
                      <div key={idx} className="stat-item">
                        <span className="stat-number">{stat.value}</span>
                        <span className="stat-label">{stat.label}</span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="stat-item">
                        <span className="stat-number">1000+</span>
                        <span className="stat-label">Active Users</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-number">5000+</span>
                        <span className="stat-label">Projects Shared</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-number">98%</span>
                        <span className="stat-label">User Satisfaction</span>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="hero-visual">
            <div className="hero-illustration">
              <div className="illustration-box box-1">
                <span>💼</span>
              </div>
              <div className="illustration-box box-2">
                <span>📊</span>
              </div>
              <div className="illustration-box box-3">
                <span>🎯</span>
              </div>
              <div className="illustration-box box-4">
                <span>✨</span>
              </div>
              <div className="floating-card card-1">
                <p>Beautiful Design</p>
              </div>
              <div className="floating-card card-2">
                <p>Easy to Use</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-indicator">
          <span>Scroll to explore</span>
          <div className="scroll-arrow">
            <span></span>
            <span></span>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="about-container">
          <h2 className="section-title">Why Choose Our Platform?</h2>
          <p className="section-subtitle">
            Everything you need to create a stunning portfolio in one place
          </p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3>Modern Design</h3>
              <p>Beautiful, responsive design that works on all devices</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔐</div>
              <h3>Secure</h3>
              <p>Your data is protected with JWT authentication</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Fast & Smooth</h3>
              <p>Lightning-fast loading with smooth animations</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Fully Responsive</h3>
              <p>Perfect display on desktop, tablet, and mobile</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Easy to Manage</h3>
              <p>Intuitive interface to manage your portfolio</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Ready to Share</h3>
              <p>Share your portfolio with anyone, anywhere</p>
            </div>
          </div>
        </div>
      </section>

      {/* My Skills Section */}
      <section id="skills" className="skills">
        <div className="skills-container">
          <h2 className="section-title">My Skills</h2>
          <p className="section-subtitle">
            Technologies and tools I work with every day
          </p>

          <div className="skills-grid">
            {skills.map((skill, idx) => (
              <div key={idx} className="skill-card" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="skill-header">
                  <SkillIcon
                    name={skill.name}
                    src={skill.iconUrl}
                    color={skill.color}
                  />
                  <h3 className="skill-name">{skill.name}</h3>
                  <span className="skill-level-text">{skill.level}%</span>
                </div>
                <div className="skill-progress">
                  <div
                    className="skill-progress-bar"
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
                <p className="skill-description">{skill.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="projects">
        <div className="projects-container">
          <h2 className="section-title">Projects</h2>
          <p className="section-subtitle">A selection of my recent work</p>

          {projects.length > 0 ? (
            <div className="projects-grid">
              {projects.map((project, idx) => (
                <div
                  key={project.id}
                  className="project-card clickable"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                  onClick={() => handleProjectClick(project)}
                >
                  {project.is_featured && (
                    <span className="featured-ribbon">⭐ Featured</span>
                  )}
                  <div className="project-body">
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-description">{project.description}</p>
                    {project.technologies && (
                      <div className="tech-badges">
                        {project.technologies.split(',').map((tech, i) => (
                          <span key={i} className="tech-badge">{tech.trim()}</span>
                        ))}
                      </div>
                    )}
                    <div className="project-links">
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-link primary"
                          onClick={(e) => e.stopPropagation()}
                        >
                          🔗 Live
                        </a>
                      )}
                      {project.github_link && (
                        <a
                          href={project.github_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-link secondary"
                          onClick={(e) => e.stopPropagation()}
                        >
                          💻 GitHub
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No projects yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="experience">
        <div className="experience-container">
          <h2 className="section-title">Experience</h2>
          <p className="section-subtitle">My professional journey</p>

          {experiences.length > 0 ? (
            <div className="experience-grid">
              {experiences.map((exp, idx) => (
                <div
                  key={exp.id}
                  className="experience-card clickable"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                  onClick={() => handleExperienceClick(exp)}
                >
                  {exp.is_current && (
                    <span className="current-ribbon">✨ Current</span>
                  )}
                  <h3 className="experience-title">{exp.title}</h3>
                  <p className="experience-company">{exp.company}</p>
                  <p className="experience-dates">
                    {formatDate(exp.start_date)} — {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                  </p>
                  {exp.description && (
                    <p className="experience-description">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No experiences yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="contact-container">
          <h2 className="section-title">Contact</h2>
          <p className="section-subtitle">Get in touch for opportunities or questions</p>

          <form onSubmit={handleContactSubmit} className="contact-form">
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={contactForm.name}
              onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
              disabled={contactLoading}
              className="contact-input"
            />
            <input
              type="email"
              name="email"
              placeholder="Your email"
              value={contactForm.email}
              onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
              disabled={contactLoading}
              className="contact-input"
            />
            <textarea
              name="message"
              placeholder="Your message"
              value={contactForm.message}
              onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
              disabled={contactLoading}
              rows="5"
              className="contact-textarea"
            ></textarea>
            <button
              type="submit"
              disabled={contactLoading}
              className="contact-btn"
            >
              {contactLoading ? 'Sending...' : 'Send Message'}
            </button>
          </form>

          {contactStatus === 'success' && (
            <div className="success-message">✓ Your message has been sent!</div>
          )}
          {contactStatus === 'error' && (
            <div className="error-message">⚠ Please fill in all fields correctly.</div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section id="newsletter" className="newsletter">
        <div className="newsletter-container">
          <div className="newsletter-content">
            <h2 className="newsletter-title">Stay Updated</h2>
            <p className="newsletter-subtitle">
              Get the latest tips and updates delivered to your inbox
            </p>

            <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="Your name (optional)"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={newsletterLoading}
                  className="newsletter-input"
                />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={newsletterLoading}
                  className="newsletter-input"
                />
                <button
                  type="submit"
                  disabled={newsletterLoading}
                  className={`newsletter-btn ${isSubscribed ? 'unsubscribe' : ''}`}
                >
                  {newsletterLoading ? (
                    <>
                      <span className="spinner"></span>
                      {isSubscribed ? 'Unsubscribing...' : 'Subscribing...'}
                    </>
                  ) : (
                    <>
                      {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
                      <span className="arrow">→</span>
                    </>
                  )}
                </button>
              </div>

              {newsletterStatus === 'success' && (
                <div className="success-message">
                  {isSubscribed
                    ? '✓ Thanks for subscribing! Check your email.'
                    : '✓ You have been unsubscribed.'}
                </div>
              )}
              {newsletterStatus === 'error' && (
                <div className="error-message">
                  ⚠ Please enter a valid email address.
                </div>
              )}
            </form>

            <p className="newsletter-note">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>

          <div className="newsletter-visual">
            <div className="newsletter-graphic">
              <div className="envelope">📧</div>
              <div className="email-icon">💌</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            {/* Brand */}
            <div className="footer-section">
              <h3 className="footer-title">
                <span className="footer-logo-icon">🎨</span>
                Portfolio
              </h3>
              <p className="footer-description">
                Create your stunning portfolio and showcase your work to the world.
              </p>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h4 className="footer-heading">Quick Links</h4>
              <ul className="footer-links">
                <li><a href="#hero">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#features">Features</a></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Sign Up</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div className="footer-section">
              <h4 className="footer-heading">Company</h4>
              <ul className="footer-links">
                <li><a href="#privacy">Privacy Policy</a></li>
                <li><a href="#terms">Terms of Service</a></li>
                <li><a href="#contact">Contact Us</a></li>
                <li><a href="#blog">Blog</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="footer-section">
              <h4 className="footer-heading">Contact</h4>
              <ul className="footer-links">
                <li>
                  <a href="mailto:support@portfolio.com">
                    📧 support@portfolio.com
                  </a>
                </li>
                <li>
                  <a href="tel:+1234567890">
                    📞 +1 (234) 567-890
                  </a>
                </li>
                <li>
                  📍 123 Portfolio St, Design City, DC 12345
                </li>
              </ul>
            </div>

            {/* Social Media */}
            <div className="footer-section">
              <h4 className="footer-heading">Follow Us</h4>
              <div className="social-links">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link" title="Twitter">
                  𝕏
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link" title="LinkedIn">
                  in
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link" title="GitHub">
                  ◇
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link" title="Facebook">
                  f
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link" title="Instagram">
                  📷
                </a>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom">
            <div className="footer-divider"></div>
            <p className="footer-copyright">
              © 2024 Portfolio Platform. All rights reserved. Made with ❤️ by the Portfolio Team
            </p>
            <div className="footer-badges">
              <span className="badge">Secure ✓</span>
              <span className="badge">Fast ⚡</span>
              <span className="badge">Responsive 📱</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
