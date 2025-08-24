import React from 'react';

const UserSelector = ({ users, currentUser, onUserSelect }) => {
  const getAvatarEmoji = (username) => {
    const avatars = {
      'alice': '👩‍💼',
      'bob': '👨‍🎨', 
      'charlie': '👨‍🔧',
      'diana': '👩‍🏫',
      'evan': '👨‍💻'
    };
    return avatars[username.toLowerCase()] || '👤';
  };

  return (
    <div className="user-selector">
      <h3>👤 Current User</h3>
      
      {users.length > 0 ? (
        <div className="user-selection">
          <label htmlFor="userSelect">Select Active User:</label>
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
                {getAvatarEmoji(currentUser.username)}
              </div>
              <div className="user-details">
                <strong>{currentUser.username}</strong>
                <span>{currentUser.email}</span>
                <small>Joined {new Date(currentUser.createdAt).toLocaleDateString()}</small>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="no-users-state">
          <div className="empty-icon">👥</div>
          <h4>No Users Found</h4>
          <p>Create your first user to start using the notification system.</p>
        </div>
      )}

      {users.length > 0 && (
        <div className="user-stats">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">{users.length}</span>
              <span className="stat-label">Total Users</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{currentUser ? '1' : '0'}</span>
              <span className="stat-label">Active User</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSelector;