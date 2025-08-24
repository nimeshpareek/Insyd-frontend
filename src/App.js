import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import NotificationList from './components/NotificationList';
import EventTrigger from './components/EventTrigger';
import UserSelector from './components/UserSelector';
import PostCreator from './components/PostCreator';
import CreateUserModal from './components/CreateUserModal';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [socket, setSocket] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [targetUserPosts, setTargetUserPosts] = useState([]);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(API_BASE_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('✅ Connected to server');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from server');
      setIsConnected(false);
    });

    newSocket.on('new_notification', (notification) => {
      console.log('🔔 New notification received:', notification);
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Show browser notification if permission granted
      if (Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.content,
          icon: '/favicon.ico'
        });
      }
    });

    return () => newSocket.close();
  }, []);

  // Load users on component mount
  useEffect(() => {
    loadUsers();
    requestNotificationPermission();
  }, []);

  // Load notifications when user changes
  useEffect(() => {
    if (currentUser) {
      loadNotifications();
      loadUnreadCount();
      loadUserPosts(currentUser._id);
      
      // Identify user to socket
      if (socket) {
        socket.emit('identify', currentUser._id);
      }
    }
  }, [currentUser, socket]);

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const loadUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users`);
      setUsers(response.data);
      
      // Auto-select first user if available and no current user
      if (response.data.length > 0 && !currentUser) {
        setCurrentUser(response.data[0]);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const loadNotifications = async () => {
    if (!currentUser) return;

    try {
      const response = await axios.get(`${API_BASE_URL}/api/notifications/${currentUser._id}`);
      setNotifications(response.data);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setError('Failed to load notifications');
    }
  };

  const loadUnreadCount = async () => {
    if (!currentUser) return;

    try {
      const response = await axios.get(`${API_BASE_URL}/api/notifications/${currentUser._id}/count`);
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const loadUserPosts = async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/posts?userId=${userId}`);
      setUserPosts(response.data);
    } catch (error) {
      console.error('Error loading posts:', error);
      setUserPosts([]);
    }
  };

  const loadTargetUserPosts = async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/posts?userId=${userId}`);
      setTargetUserPosts(response.data);
    } catch (error) {
      console.error('Error loading target user posts:', error);
      setTargetUserPosts([]);
    }
  };

  const createUser = async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/users`, userData);
      setUsers(prev => [...prev, response.data]);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

  const triggerEvent = async (eventData) => {
    try {
      await axios.post(`${API_BASE_URL}/api/events`, eventData);
      console.log('✅ Event triggered successfully');
    } catch (error) {
      console.error('Error triggering event:', error);
      throw error;
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/notifications/${notificationId}/read`);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId || notif._id === notificationId
            ? { ...notif, status: 'read' }
            : notif
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const clearAllNotifications = async () => {
    if (!currentUser) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/notifications/clear/${currentUser._id}`);
      setNotifications([]);
      setUnreadCount(0);
      console.log('✅ All notifications cleared');
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  const handlePostCreated = () => {
    if (currentUser) {
      loadUserPosts(currentUser._id);
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      const newUser = await createUser(userData);
      setCurrentUser(newUser);
      setShowCreateUserModal(false);
      return newUser;
    } catch (error) {
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="spinner">⏳</div>
          <p>Loading Insyd Notification System...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="error">
          <h2>⚠️ Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>🔄 Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🏗️ Insyd Notification System</h1>
          <div className="header-actions">
            <button 
              onClick={() => setShowCreateUserModal(true)}
              className="create-user-header-btn"
            >
              ➕ Create New User
            </button>
            <div className="connection-status">
              <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
                {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="sidebar">
          <div className="user-section">
            <UserSelector
              users={users}
              currentUser={currentUser}
              onUserSelect={setCurrentUser}
            />
          </div>

          {currentUser && (
            <div className="post-creator-section">
              <PostCreator 
                currentUser={currentUser} 
                onPostCreated={handlePostCreated} 
              />
            </div>
          )}

          {currentUser && (
            <div className="event-section">
              <EventTrigger
                currentUser={currentUser}
                users={users}
                targetUserPosts={targetUserPosts}
                onTriggerEvent={triggerEvent}
                onTargetUserChange={loadTargetUserPosts}
              />
            </div>
          )}
        </div>

        <div className="main-content">
          {currentUser ? (
            <>
              <div className="notifications-header">
                <h2>
                  🔔 Notifications for {currentUser.username}
                  {unreadCount > 0 && (
                    <span className="unread-badge">{unreadCount}</span>
                  )}
                </h2>
                <div className="notification-actions">
                  <button onClick={loadNotifications} className="refresh-btn">
                    🔄 Refresh
                  </button>
                  <button onClick={clearAllNotifications} className="clear-btn">
                    🗑️ Clear All
                  </button>
                </div>
              </div>

              <NotificationList
                notifications={notifications}
                onMarkAsRead={markNotificationAsRead}
              />
            </>
          ) : (
            <div className="welcome-message">
              <h2>🎉 Welcome to Insyd Notification System</h2>
              <p>Select an existing user or create a new one to get started with notifications.</p>
              <div className="welcome-actions">
                <button 
                  onClick={() => setShowCreateUserModal(true)}
                  className="welcome-create-btn"
                >
                  ➕ Create Your First User
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Create User Modal */}
      {showCreateUserModal && (
        <CreateUserModal
          onClose={() => setShowCreateUserModal(false)}
          onCreateUser={handleCreateUser}
        />
      )}

      <footer className="app-footer">
        <p>Insyd Notification System POC - Built with React & Node.js | Connected Users: {users.length}</p>
      </footer>
    </div>
  );
}

export default App;