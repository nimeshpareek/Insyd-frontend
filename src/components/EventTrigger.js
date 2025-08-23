import React, { useState } from 'react';

const EventTrigger = ({
  currentUser,
  users,
  userPosts = [],
  onTargetUserChange,
  onTriggerEvent
}) => {
  const [selectedEventType, setSelectedEventType] = useState('like');
  const [selectedTargetUser, setSelectedTargetUser] = useState('');
  const [selectedEntityId, setSelectedEntityId] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  const eventTypes = [
    { value: 'like', label: '👍 Like', description: 'Like someone\'s post' },
    { value: 'comment', label: '💬 Comment', description: 'Comment on someone\'s post' },
    { value: 'follow', label: '👥 Follow', description: 'Follow another user' }
  ];

  const handleTargetUserChange = (e) => {
    setSelectedTargetUser(e.target.value);
    setSelectedEntityId('');
    if (onTargetUserChange) {
      onTargetUserChange(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTargetUser) {
      setFeedback('Please select a target user');
      return;
    }

    if (currentUser._id === selectedTargetUser) {
      setFeedback('Cannot trigger event on yourself');
      return;
    }

    if ((selectedEventType === 'like' || selectedEventType === 'comment') && userPosts.length === 0) {
      setFeedback('No post has been created for this user');
      return;
    }

    if ((selectedEventType === 'like' || selectedEventType === 'comment') && !selectedEntityId) {
      setFeedback('Please select a post');
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
            entityTitle: userPosts.find(p => p._id === selectedEntityId)?.title || ''
          };
          break;
        case 'comment':
          eventData.data = {
            entityType: 'post',
            entityTitle: userPosts.find(p => p._id === selectedEntityId)?.title || '',
            commentText: commentText || 'Great work!'
          };
          break;
        case 'follow':
          eventData.data = { entityType: 'user' };
          break;
        default:
          break;
      }

      await onTriggerEvent(eventData);

      setFeedback(`✅ ${selectedEventType} event triggered successfully!`);
      setCommentText('');
      setSelectedEntityId('');
      setTimeout(() => setFeedback(''), 3000);
    } catch (error) {
      setFeedback(`❌ Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getOtherUsers = () => users.filter(user => user._id !== currentUser._id);

  return (
    <div className="event-trigger">
      <h3>🚀 Trigger Events</h3>
      <form onSubmit={handleSubmit} className="event-form">
        <div className="form-group">
          <label htmlFor="eventType">Event Type</label>
          <select
            id="eventType"
            value={selectedEventType}
            onChange={e => setSelectedEventType(e.target.value)}
            className="form-control"
          >
            {eventTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

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
        </div>

        {(selectedEventType === 'like' || selectedEventType === 'comment') && (
          <div className="form-group">
            <label htmlFor="entityId">Select Post</label>
            <select
              id="entityId"
              value={selectedEntityId}
              onChange={e => setSelectedEntityId(e.target.value)}
              className="form-control"
              disabled={userPosts.length === 0}
            >
              <option value="">Select a post...</option>
              {userPosts.map(post => (
                <option key={post._id} value={post._id}>
                  {post.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedEventType === 'comment' && (
          <div className="form-group">
            <label htmlFor="commentText">Comment Text</label>
            <textarea
              id="commentText"
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="This is an amazing design! Love the sustainability aspects."
              className="form-control"
              rows="3"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !selectedTargetUser}
          className={`submit-btn ${isLoading ? 'loading' : ''}`}
        >
          {isLoading ? 'Triggering...' : `🚀 Trigger ${selectedEventType.charAt(0).toUpperCase() + selectedEventType.slice(1)}`}
        </button>

        {feedback && (
          <div className={`feedback ${feedback.includes('✅') ? 'success' : 'error'}`}>
            {feedback}
          </div>
        )}
      </form>
    </div>
  );
};

export default EventTrigger;