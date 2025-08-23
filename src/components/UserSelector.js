import React, { useState } from 'react';

const UserSelector = ({ users, currentUser, onUserSelect, onCreateUser }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUserData, setNewUserData] = useState({ username: '', email: '' });
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    if (!newUserData.username || !newUserData.email) {
      setCreateError('Username and email are required');
      return;
    }

    setIsCreating(true);
    setCreateError('');

    try {
      const createdUser = await onCreateUser(newUserData);
      onUserSelect(createdUser); // Auto-select the new user
      setNewUserData({ username: '', email: '' });
      setShowCreateForm(false);
    } catch (error) {
      setCreateError(error.response?.data?.error || 'Failed to create user');
    } finally {
      setIsCreating(false);
    }
  };

  const predefinedUsers = [
    { username: 'alice', email: 'alice@insyd.com' },
    { username: 'bob', email: 'bob@insyd.com' },
    { username: 'charlie', email: 'charlie@insyd.com' }
  ];

  const createPredefinedUser = async (userData) => {
    try {
      const createdUser = await onCreateUser(userData);
      onUserSelect(createdUser);
    } catch (error) {
      console.error('Error creating predefined user:', error);
    }
  };

  return (
    <div className="user-selector">
      <h3>👤 Current User</h3>
      
      {users.length > 0 ? (
        <div className="user-selection">
          <label htmlFor="userSelect">Select User:</label>
          <select
            id="userSelect"
            value={currentUser?._id || ''}
            onChange={(e) => {
              const selectedUser = users.find(user => user._id === e.target.value);
              onUserSelect(selectedUser);
            }}
            className="user-select"
          >
            <option value="">Choose a user...</option>
            {users.map(user => (
              <option key={user._id} value={user._id}>
                {user.username} ({user.email})
              </option>
            ))}
          </select>
          
          {currentUser && (
            <div className="current-user-info">
              <div className="user-avatar">
                {currentUser.username.charAt(0).toUpperCase()}
              </div>
              <div className="user-details">
                <strong>{currentUser.username}</strong>
                <span>{currentUser.email}</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="no-users">
          <p>No users found. Create some users to get started!</p>
        </div>
      )}

      <div className="user-actions">
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="create-user-btn"
        >
          {showCreateForm ? '❌ Cancel' : '➕ Create New User'}
        </button>
      </div>

      {showCreateForm && (
        <div className="create-user-form">
          <h4>Create New User</h4>
          <form onSubmit={handleCreateUser}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Username (e.g., alice)"
                value={newUserData.username}
                onChange={(e) => setNewUserData({ ...newUserData, username: e.target.value })}
                className="form-control"
                required
              />
            </div>
            
            <div className="form-group">
              <input
                type="email"
                placeholder="Email (e.g., alice@insyd.com)"
                value={newUserData.email}
                onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                className="form-control"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isCreating}
              className={`submit-btn ${isCreating ? 'loading' : ''}`}
            >
              {isCreating ? 'Creating...' : 'Create User'}
            </button>
            
            {createError && (
              <div className="error-message">{createError}</div>
            )}
          </form>
        </div>
      )}

      {users.length === 0 && (
        <div className="quick-start">
          <h4>🚀 Quick Start</h4>
          <p>Create these sample users to test the notification system:</p>
          <div className="predefined-users">
            {predefinedUsers.map((userData, index) => (
              <button
                key={index}
                onClick={() => createPredefinedUser(userData)}
                className="predefined-user-btn"
              >
                Create {userData.username}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSelector;