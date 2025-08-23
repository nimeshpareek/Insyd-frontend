import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const PostCreator = ({ currentUser, onPostCreated }) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!title) {
      setFeedback('Post title is required');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/posts`, {
        userId: currentUser._id,
        title
      });
      setTitle('');
      setFeedback('✅ Post created!');
      if (onPostCreated) onPostCreated();
    } catch (error) {
      setFeedback('❌ Error creating post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleCreatePost} className="create-post-form">
      <input
        type="text"
        placeholder="Enter post title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        disabled={loading}
      />
      <button type="submit" disabled={loading || !title}>
        {loading ? 'Creating...' : 'Create Post'}
      </button>
      {feedback && <div className="feedback">{feedback}</div>}
    </form>
  );
};

export default PostCreator;