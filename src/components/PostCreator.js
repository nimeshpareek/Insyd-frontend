import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const PostCreator = ({ currentUser, onPostCreated }) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [userPosts, setUserPosts] = useState([]);
  const [showAllPosts, setShowAllPosts] = useState(false);

  const sampleTitles = [
    "Sustainable Architecture Design for Urban Spaces",
    "Modern Minimalist House Design Concept",
    "Green Building Materials and Techniques",
    "Smart Home Integration in Contemporary Design",
    "Historic Building Restoration Project",
    "Eco-Friendly Office Complex Design"
  ];

  useEffect(() => {
    if (currentUser) {
      loadUserPosts();
    }
  }, [currentUser]);

  const loadUserPosts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/posts?userId=${currentUser._id}`);
      setUserPosts(response.data);
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setFeedback('❌ Post title is required');
      return;
    }

    setLoading(true);
    setFeedback('');

    try {
      await axios.post(`${API_BASE_URL}/api/posts`, {
        userId: currentUser._id,
        title: title.trim()
      });
      
      setTitle('');
      setFeedback('✅ Post created successfully!');
      await loadUserPosts();
      
      if (onPostCreated) {
        onPostCreated();
      }
      
      // Clear feedback after 3 seconds
      setTimeout(() => setFeedback(''), 3000);
    } catch (error) {
      console.error('Error creating post:', error);
      setFeedback('❌ Error creating post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSampleTitle = (sampleTitle) => {
    setTitle(sampleTitle);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="post-creator">
      <div className="section-header">
        <h3>📝 Create New Post</h3>
        <span className="post-count">{userPosts.length} posts</span>
      </div>
      <p className="section-description">
        Share your architectural insights and designs with the community
      </p>
      
      <form onSubmit={handleCreatePost} className="post-form">
        <div className="form-group">
          <label htmlFor="postTitle">Post Title</label>
          <textarea
            id="postTitle"
            placeholder="Enter your post title... (e.g., Sustainable Architecture Design for Urban Spaces)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            className="post-title-input"
            rows={2}
            maxLength={100}
          />
          <div className="character-count">
            {title.length}/100 characters
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            disabled={loading || !title.trim()}
            className="create-post-btn"
          >
            {loading ? (
              <>
                <span className="spinner">⏳</span>
                Creating...
              </>
            ) : (
              <>
                📝 Create Post
              </>
            )}
          </button>
        </div>

        {feedback && (
          <div className={`feedback ${feedback.includes('✅') ? 'success' : 'error'}`}>
            {feedback}
          </div>
        )}
      </form>

      {/* Sample Titles */}
      <div className="sample-titles">
        <h4>💡 Need inspiration? Try these:</h4>
        <div className="sample-titles-grid">
          {sampleTitles.slice(0, 3).map((sampleTitle, index) => (
            <button
              key={index}
              onClick={() => handleSampleTitle(sampleTitle)}
              className="sample-title-btn"
              disabled={loading}
            >
              {sampleTitle}
            </button>
          ))}
        </div>
      </div>

      {/* User's Posts */}
      {userPosts.length > 0 && (
        <div className="user-posts-section">
          <div className="posts-header">
            <h4>📚 Your Posts ({userPosts.length})</h4>
            {userPosts.length > 3 && (
              <button
                onClick={() => setShowAllPosts(!showAllPosts)}
                className="toggle-posts-btn"
              >
                {showAllPosts ? 'Show Less' : 'Show All'}
              </button>
            )}
          </div>
          
          <div className="posts-list">
            {(showAllPosts ? userPosts : userPosts.slice(0, 3)).map((post) => (
              <div key={post._id} className="post-item">
                <div className="post-content">
                  <h5>{post.title}</h5>
                  <span className="post-date">{formatDate(post.createdAt)}</span>
                </div>
                <div className="post-icon">📄</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {userPosts.length === 0 && !loading && (
        <div className="no-posts-state">
          <span className="empty-icon">📝</span>
          <p>No posts yet. Create your first post to start sharing!</p>
        </div>
      )}
    </div>
  );
};

export default PostCreator;