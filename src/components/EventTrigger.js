import React, { useState, useEffect } from 'react';

const EventTrigger = ({
  currentUser,
  users,
  targetUserPosts = [],
  onTargetUserChange,
  onTriggerEvent
}) => {
  const [selectedEventType, setSelectedEventType] = useState('like');
  const [selectedTargetUser, setSelectedTargetUser] = useState('');
  const [selectedEntityId, setSelectedEntityId] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [currentTargetUserPosts, setCurrentTargetUserPosts] = useState([]);

  const eventTypes = [
    { value: 'like', label: '👍 Like', description: 'Like someone\'s post', icon: '👍' },
    { value: 'comment', label: '💬 Comment', description: 'Comment on someone\'s post', icon: '💬' },
    { value: 'follow', label: '👥 Follow', description: 'Follow another user', icon: '👥' }
  ];

  const commentSuggestions = [
    "Amazing work! Love the attention to detail.",
    "This design is truly innovative and inspiring.",
    "Great use of sustainable materials!",
    "The lighting in this space is perfect.",
    "This would be perfect for urban development.",
    "Fantastic integration of modern and classic elements."
  ];

  // Clear target user posts when target user changes or component mounts
  useEffect(() => {
    if (selectedTargetUser) {
      // Filter posts to only show posts from the selected target user
      const filteredPosts = targetUserPosts.filter(post => 
        post.userId === selectedTargetUser
      );
      setCurrentTargetUserPosts(filteredPosts);
      console.log(`🔍 Filtered ${filteredPosts.length} posts for target user:`, selectedTargetUser);
    } else {
      setCurrentTargetUserPosts([]);
    }
  }, [selectedTargetUser, targetUserPosts]);

  // Clear posts when current user changes
  useEffect(() => {
    setSelectedTargetUser('');
    setSelectedEntityId('');
    setCurrentTargetUserPosts([]);
    setCommentText('');
    setFeedback('');
  }, [currentUser]);

  const handleTargetUserChange = async (e) => {
    const userId = e.target.value;
    setSelectedTargetUser(userId);
    setSelectedEntityId('');
    setFeedback('');
    setCurrentTargetUserPosts([]); // Clear posts immediately
    
    if (userId && (selectedEventType === 'like' || selectedEventType === 'comment')) {
      setLoadingPosts(true);
      try {
        // Call the parent function to load posts for this specific user
        await onTargetUserChange(userId);
      } catch (error) {
        console.error('Error loading target user posts:', error);
        setFeedback('❌ Error loading posts for selected user');
      } finally {
        setLoadingPosts(false);
      }
    }
  };

  const handleEventTypeChange = (e) => {
    setSelectedEventType(e.target.value);
    setSelectedEntityId('');
    setCommentText('');
    setFeedback('');
    
    // If switching to like or comment, reload posts for current target user
    if ((e.target.value === 'like' || e.target.value === 'comment') && selectedTargetUser) {
      handleTargetUserChange({ target: { value: selectedTargetUser } });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!selectedTargetUser) {
      setFeedback('❌ Please select a target user');
      return;
    }

    if (currentUser._id === selectedTargetUser) {
      setFeedback('❌ Cannot trigger event on yourself');
      return;
    }

    // For like and comment events, check if target user has posts
    if ((selectedEventType === 'like' || selectedEventType === 'comment')) {
      if (currentTargetUserPosts.length === 0) {
        const targetUser = users.find(u => u._id === selectedTargetUser);
        setFeedback(`❌ ${targetUser?.username || 'User'} hasn't created any posts yet. Ask them to create a post first!`);
        return;
      }

      if (!selectedEntityId) {
        setFeedback('❌ Please select a post');
        return;
      }

      // Verify the selected post actually belongs to the target user
      const selectedPost = currentTargetUserPosts.find(p => p._id === selectedEntityId);
      if (!selectedPost || selectedPost.userId !== selectedTargetUser) {
        setFeedback('❌ Invalid post selection. Please select a valid post.');
        return;
      }
    }

    if (selectedEventType === 'comment' && !commentText.trim()) {
      setFeedback('❌ Please enter a comment');
      return;
    }

    setIsLoading(true);
    setFeedback('');

    try {
      const eventData = {
        type: selectedEventType,
        sourceUserId: currentUser._id,
        targetUserId: selectedTargetUser,
        entityId: selectedEntityId,
        data: {}
      };

      switch (selectedEventType) {
        case 'like':
          eventData.data = {
            entityType: 'post',
            entityTitle: currentTargetUserPosts.find(p => p._id === selectedEntityId)?.title || 'a post'
          };
          break;
        case 'comment':
          eventData.data = {
            entityType: 'post',
            entityTitle: currentTargetUserPosts.find(p => p._id === selectedEntityId)?.title || 'a post',
            commentText: commentText.trim()
          };
          break;
        case 'follow':
          eventData.data = { entityType: 'user' };
          break;
        default:
          break;
      }

      await onTriggerEvent(eventData);

      const targetUser = users.find(u => u._id === selectedTargetUser);
      setFeedback(`✅ ${selectedEventType.charAt(0).toUpperCase() + selectedEventType.slice(1)} event triggered successfully for ${targetUser?.username}!`);
      
      // Reset form after successful submission
      if (selectedEventType === 'comment') {
        setCommentText('');
      }
      
      setTimeout(() => setFeedback(''), 4000);
    } catch (error) {
      console.error('Event trigger error:', error);
      setFeedback(`❌ Error: ${error.response?.data?.error || error.message || 'Something went wrong'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getOtherUsers = () => users.filter(user => user._id !== currentUser._id);

  const getCurrentEventType = () => eventTypes.find(type => type.value === selectedEventType);

  const formatPostTitle = (title) => {
    return title.length > 50 ? title.substring(0, 50) + '...' : title;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getSelectedTargetUserName = () => {
    const targetUser = users.find(u => u._id === selectedTargetUser);
    return targetUser?.username || 'Selected User';
  };

  return (
    <div className="event-trigger">
      <div className="section-header">
        <h3>🚀 Trigger Events</h3>
        <span className="current-event-type">{getCurrentEventType()?.icon}</span>
      </div>
      <p className="section-description">
        Simulate user interactions to test the notification system
      </p>

      <form onSubmit={handleSubmit} className="event-form">
        {/* Event Type Selection */}
        <div className="form-group">
          <label htmlFor="eventType">Event Type</label>
          <div className="event-type-selector">
            {eventTypes.map(type => (
              <label key={type.value} className={`event-type-option ${selectedEventType === type.value ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="eventType"
                  value={type.value}
                  checked={selectedEventType === type.value}
                  onChange={handleEventTypeChange}
                />
                <div className="event-type-content">
                  <span className="event-icon">{type.icon}</span>
                  <div className="event-info">
                    <strong>{type.label}</strong>
                    <small>{type.description}</small>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Target User Selection */}
        <div className="form-group">
          <label htmlFor="targetUser">Target User</label>
          <select
            id="targetUser"
            value={selectedTargetUser}
            onChange={handleTargetUserChange}
            className="form-control"
            required
          >
            <option value="">Select target user...</option>
            {getOtherUsers().map(user => (
              <option key={user._id} value={user._id}>
                {user.username} ({user.email})
              </option>
            ))}
          </select>
          {getOtherUsers().length === 0 && (
            <small className="form-help error">
              ⚠️ Create more users to trigger events between them
            </small>
          )}
        </div>

        {/* Post Selection (for like/comment events) */}
        {(selectedEventType === 'like' || selectedEventType === 'comment') && selectedTargetUser && (
          <div className="form-group">
            <label htmlFor="entityId">
              Select Post from {getSelectedTargetUserName()}'s Posts
            </label>
            {loadingPosts ? (
              <div className="loading-posts">
                <span className="spinner">⏳</span> Loading {getSelectedTargetUserName()}'s posts...
              </div>
            ) : (
              <>
                {currentTargetUserPosts.length > 0 ? (
                  <select
                    id="entityId"
                    value={selectedEntityId}
                    onChange={e => setSelectedEntityId(e.target.value)}
                    className="form-control"
                    required
                  >
                    <option value="">Choose a post from {getSelectedTargetUserName()}...</option>
                    {currentTargetUserPosts.map(post => (
                      <option key={post._id} value={post._id}>
                        📄 {formatPostTitle(post.title)} • {formatDate(post.createdAt)}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="no-posts-message">
                    <span className="warning-icon">⚠️</span>
                    <p>{getSelectedTargetUserName()} hasn't created any posts yet.</p>
                    <small>Ask {getSelectedTargetUserName()} to create a post first, then you can like or comment on it.</small>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Comment Text (for comment events) */}
        {selectedEventType === 'comment' && selectedEntityId && (
          <div className="form-group">
            <label htmlFor="commentText">Your Comment</label>
            <textarea
              id="commentText"
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="Write your comment..."
              className="form-control comment-textarea"
              rows="3"
              maxLength={200}
            />
            <div className="comment-actions">
              <span className="character-count">{commentText.length}/200</span>
              <div className="comment-suggestions">
                <label>Quick suggestions:</label>
                <div className="suggestion-buttons">
                  {commentSuggestions.slice(0, 3).map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCommentText(suggestion)}
                      className="suggestion-btn"
                      disabled={isLoading}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !selectedTargetUser || getOtherUsers().length === 0}
          className={`submit-btn event-submit-btn ${isLoading ? 'loading' : ''}`}
        >
          {isLoading ? (
            <>
              <span className="spinner">⏳</span>
              Triggering...
            </>
          ) : (
            <>
              {getCurrentEventType()?.icon} Trigger {selectedEventType.charAt(0).toUpperCase() + selectedEventType.slice(1)}
            </>
          )}
        </button>

        {/* Feedback */}
        {feedback && (
          <div className={`feedback ${feedback.includes('✅') ? 'success' : 'error'}`}>
            {feedback}
          </div>
        )}
      </form>

      {/* Event Examples */}
      <div className="event-examples">
        <h4>💡 How it works:</h4>
        <div className="examples-list">
          <div className="example-item">
            <span className="example-icon">👍</span>
            <div>
              <strong>Like:</strong> Notify user when someone likes their post
            </div>
          </div>
          <div className="example-item">
            <span className="example-icon">💬</span>
            <div>
              <strong>Comment:</strong> Send notification with your comment text
            </div>
          </div>
          <div className="example-item">
            <span className="example-icon">👥</span>
            <div>
              <strong>Follow:</strong> Alert user about new follower
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventTrigger;