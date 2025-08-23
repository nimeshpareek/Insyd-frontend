import React from 'react';

const NotificationList = ({ notifications, onMarkAsRead }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like': return '👍';
      case 'comment': return '💬';
      case 'follow': return '👥';
      case 'post': return '📝';
      default: return '🔔';
    }
  };

  const handleNotificationClick = (notification) => {
    if (notification.status === 'unread') {
      onMarkAsRead(notification._id || notification.id);
    }
  };

  if (notifications.length === 0) {
    return (
      <div className="notifications-empty">
        <div className="empty-state">
          <span className="empty-icon">🔔</span>
          <h3>No notifications yet</h3>
          <p>When someone interacts with your content, you'll see notifications here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-list">
      {notifications.map((notification) => (
        <div
          key={notification._id || notification.id}
          className={`notification-item ${notification.status || 'unread'}`}
          onClick={() => handleNotificationClick(notification)}
        >
          <div className="notification-icon">
            {getNotificationIcon(notification.type)}
          </div>
          
          <div className="notification-content">
            <div className="notification-header">
              <h4 className="notification-title">
                {notification.title}
                {(notification.status === 'unread') && (
                  <span className="unread-dot">•</span>
                )}
              </h4>
              <span className="notification-time">
                {formatTime(notification.createdAt)}
              </span>
            </div>
            
            <p className="notification-text">
              {notification.content}
            </p>
            
            {notification.sourceUser && (
              <div className="notification-source">
                <span className="source-username">
                  @{notification.sourceUser.username}
                </span>
              </div>
            )}
          </div>
          
          <div className="notification-actions">
            {notification.status === 'unread' && (
              <button
                className="mark-read-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAsRead(notification._id || notification.id);
                }}
                title="Mark as read"
              >
                ✓
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationList;