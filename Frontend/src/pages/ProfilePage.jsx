import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/ProfilePage.css';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, updateProfile, changePassword } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState('');

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || '');
      setLastName(user.last_name || '');
      setEmail(user.email || '');
      setPreview(user.profile?.profile_picture_url || user.profile?.profile_picture || '');
    }
  }, [user]);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfilePicture(file);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('first_name', firstName);
      formData.append('last_name', lastName);
      formData.append('email', email);
      if (profilePicture) {
        formData.append('profile_picture', profilePicture);
      }

      await updateProfile(formData);
      setMessage('Profile updated successfully.');
      setProfilePicture(null);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await changePassword(oldPassword, newPassword, confirmPassword);
      setMessage('Password changed successfully.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || 'Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  const getPictureSrc = () => {
    if (preview && preview.startsWith('blob:')) return preview;
    if (preview) return preview;
    return '';
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <h1 className="profile-title">My Profile</h1>
          <p className="profile-subtitle">Manage your personal information</p>
        </div>

        {(message || error) && (
          <div className={`profile-alert ${error ? 'error' : 'success'}`}>
            {error || message}
          </div>
        )}

        <form onSubmit={handleProfileSubmit} className="profile-form">
          <div className="profile-picture-section">
            <div className="picture-preview">
              {getPictureSrc() ? (
                <img src={getPictureSrc()} alt="Profile" />
              ) : (
                <span>{(firstName[0] || '')}{(lastName[0] || '')}</span>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handlePictureChange}
              className="picture-input"
              hidden
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="picture-btn"
            >
              {profilePicture ? 'Change Picture' : 'Upload Picture'}
            </button>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="profile-btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>

        <div className="profile-divider"></div>

        <h2 className="section-title">Change Password</h2>

        <form onSubmit={handlePasswordSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="oldPassword">Current Password</label>
            <input
              type="password"
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>

          <button
            type="submit"
            className="profile-btn-secondary"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Change Password'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => navigate('/admin')}
          className="back-link"
        >
          Back to Admin
        </button>
      </div>
    </div>
  );
}
