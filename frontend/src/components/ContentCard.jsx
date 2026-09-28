import React from 'react';
import { Eye, Heart, MessageSquare, Share2, Calendar, Trash2, Globe } from 'lucide-react';
import { calculateEngagement } from '../utils/analytics.js';

/**
 * Reusable ContentCard component representing an individual post in memory
 */
export default function ContentCard({ post, onDelete }) {
  if (!post) return null;

  const engagement = calculateEngagement(post);

  // Format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getPlatformClass = (platform = '') => {
    const p = platform.toLowerCase();
    if (p.includes('linkedin')) return 'platform-linkedin';
    if (p.includes('instagram')) return 'platform-instagram';
    if (p.includes('youtube')) return 'platform-youtube';
    if (p.includes('twitter') || p.includes('x')) return 'platform-twitter';
    if (p.includes('blog')) return 'platform-blog';
    return 'platform-other';
  };

  return (
    <article className="content-card">
      <div className="content-card-top">
        <div className="content-badges">
          <span className={`platform-badge ${getPlatformClass(post.platform)}`}>
            {post.platform}
          </span>
          <span className="topic-badge">{post.topic}</span>
        </div>

        <div className="content-card-actions">
          <span className="content-date">
            <Calendar size={13} />
            {formatDate(post.date)}
          </span>
          {onDelete && (
            <button
              onClick={() => onDelete(post.id)}
              className="content-delete-btn"
              title="Remove from memory"
              aria-label={`Delete ${post.title}`}
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>

      <h3 className="content-title">{post.title}</h3>

      {post.description && (
        <p className="content-description">{post.description}</p>
      )}

      <div className="content-metrics-grid">
        <div className="metric-box">
          <span className="metric-label">
            <Eye size={13} /> Views
          </span>
          <span className="metric-val">{(Number(post.views) || 0).toLocaleString()}</span>
        </div>

        <div className="metric-box">
          <span className="metric-label">
            <Heart size={13} /> Likes
          </span>
          <span className="metric-val">{(Number(post.likes) || 0).toLocaleString()}</span>
        </div>

        <div className="metric-box">
          <span className="metric-label">
            <MessageSquare size={13} /> Comments
          </span>
          <span className="metric-val">{(Number(post.comments) || 0).toLocaleString()}</span>
        </div>

        <div className="metric-box">
          <span className="metric-label">
            <Share2 size={13} /> Shares
          </span>
          <span className="metric-val">{(Number(post.shares) || 0).toLocaleString()}</span>
        </div>

        <div className="metric-box metric-box-highlight">
          <span className="metric-label">Engagement</span>
          <span className="metric-val engagement-val">{engagement}%</span>
        </div>
      </div>
    </article>
  );
}
