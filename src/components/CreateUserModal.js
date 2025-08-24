import React, { useState } from 'react';

const CreateUserModal = ({ onClose, onCreateUser }) => {
  const [formData, setFormData] = useState({ username: '', email: '' });
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const predefinedUsers = [
    { username: 'alice', email: 'alice@insyd.com', avatar: '👩‍💼' },
    { username: 'bob', email: 'bob@insyd.com', avatar: '👨‍🎨' },
    { username: 'charlie', email: 'charlie@insyd.com', avatar: '👨‍🔧' },
    { username: 'diana', email: 'diana@insyd.com', avatar: '👩‍🏫' },
    { username: 'evan', email: 'evan@insyd.com', avatar: '👨‍💻' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.email) {
      setError('Username and email are required');
      return;
    }

    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }

    setIsCreating(true);
    setError('');

    try {
      await onCreateUser(formData);
      setFormData({ username: '', email: '' });
      onClose();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create user');
    } finally {
      setIsCreating(false);
    }
  };

  const handlePredefinedUser = async (userData) => {
    setIsCreating(true);
    setError('');

    try {
      await onCreateUser(userData);
      onClose();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create user');
      setIsCreating(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content create-user-modal">
        <div className="modal-header">
          <h2>👤 Create New User</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        <div className="modal-body">
          {/* Quick Start Section */}
          <div className="quick-start-section">
            <h3>🚀 Quick Start</h3>
            <p>Choose from predefined users to get started quickly:</p>
            <div className="predefined-users-grid">
              {predefinedUsers.map((user, index) => (
                <button
                  key={index}
                  onClick={() => handlePredefinedUser(user)}
                  disabled={isCreating}
                  className="predefined-user-card"
                >
                  <span className="user-avatar-large">{user.avatar}</span>
                  <div className="user-info">
                    <strong>{user.username}</strong>
                    <span>{user.email}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="divider">
            <span>OR</span>
          </div>

          {/* Custom User Form */}
          <div className="custom-user-section">
            <h3>✏️ Create Custom User</h3>
            <form onSubmit={handleSubmit} className="create-user-form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  placeholder="e.g., john_doe"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="form-control"
                  disabled={isCreating}
                  minLength={3}
                />
                <small className="form-help">At least 3 characters, no spaces</small>
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  placeholder="e.g., john@insyd.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-control"
                  disabled={isCreating}
                />
                <small className="form-help">Valid email address required</small>
              </div>
              
              {error && (
                <div className="error-message">
                  ⚠️ {error}
                </div>
              )}
              
              <div className="form-actions">
                <button
                  type="button"
                  onClick={onClose}
                  className="cancel-btn"
                  disabled={isCreating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || !formData.username || !formData.email}
                  className="submit-btn"
                >
                  {isCreating ? (
                    <>
                      <span className="spinner">⏳</span>
                      Creating...
                    </>
                  ) : (
                    <>
                      ➕ Create User
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUserModal;