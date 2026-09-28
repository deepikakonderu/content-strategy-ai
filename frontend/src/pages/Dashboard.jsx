import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Eye,
  TrendingUp,
  Award,
  Sparkles,
  PlusCircle,
  Search,
  Filter,
  RotateCcw,
  Layers,
  ArrowRight
} from 'lucide-react';
import * as api from '../services/api.js';
import {
  getTotalViews,
  getAverageEngagement,
  getTopTopic,
  getTopicBreakdown
} from '../utils/analytics.js';
import StatCard from '../components/StatCard.jsx';
import ContentCard from '../components/ContentCard.jsx';
import Button from '../components/Button.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Toast from '../components/Toast.jsx';

export default function Dashboard({ onUpdatePostCount }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('ALL');
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const navigate = useNavigate();

  // Load posts via service layer
  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await api.getPosts();
      setPosts(data);
      if (onUpdatePostCount) onUpdatePostCount(data.length);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setToastMessage('Could not load stored posts');
      setToastType('error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleDeletePost = async (id) => {
    if (!window.confirm('Remove this post from ContentMind memory?')) return;
    try {
      const updated = await api.deletePost(id);
      setPosts(updated);
      if (onUpdatePostCount) onUpdatePostCount(updated.length);
      setToastMessage('Post removed from memory.');
      setToastType('info');
    } catch (err) {
      console.error('Error deleting post:', err);
      setToastMessage('Failed to delete post.');
      setToastType('error');
    }
  };

  const handleResetData = async () => {
    if (!window.confirm('Reset memory back to the initial 8 demo posts?')) return;
    try {
      const reset = await api.resetPosts();
      setPosts(reset);
      setSelectedTopic('ALL');
      setSearchQuery('');
      if (onUpdatePostCount) onUpdatePostCount(reset.length);
      setToastMessage('Memory reset to demo dataset.');
      setToastType('success');
    } catch (err) {
      console.error('Error resetting data:', err);
    }
  };

  // Dynamic calculations from localStorage
  const totalPosts = posts.length;
  const totalViews = getTotalViews(posts);
  const avgEngagement = getAverageEngagement(posts);
  const topTopic = getTopTopic(posts);
  const topicBreakdown = getTopicBreakdown(posts);

  // Available topics for filtering
  const uniqueTopics = ['ALL', ...new Set(posts.map((p) => p.topic).filter(Boolean))];

  // Filtered posts
  const filteredPosts = posts.filter((post) => {
    const matchesTopic = selectedTopic === 'ALL' || post.topic === selectedTopic;
    const matchesSearch =
      !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.description && post.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      post.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.topic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTopic && matchesSearch;
  });

  return (
    <div className="page-container dashboard-page">
      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage('')}
        />
      )}

      {/* A. Welcome section */}
      <section className="welcome-hero">
        <div className="welcome-hero-content">
          <div className="welcome-tag">
            <span className="live-dot"></span>
            Memory-Powered Content Hub
          </div>
          <h1 className="welcome-title">Your Content Strategy</h1>
          <p className="welcome-subtitle">
            Turn your content history into your next great idea.
          </p>
        </div>

        {/* E. CTA Section */}
        <div className="welcome-hero-actions">
          <Button
            variant="primary"
            size="lg"
            icon={Sparkles}
            onClick={() => navigate('/strategy')}
            className="cta-strategy-btn"
          >
            Get Content Strategy
          </Button>

          <Button
            variant="secondary"
            size="lg"
            icon={PlusCircle}
            onClick={() => navigate('/add-content')}
          >
            Add Content
          </Button>
        </div>
      </section>

      {/* B. Statistics Cards */}
      <section className="stats-section" aria-label="Content Performance Statistics">
        <div className="stats-grid">
          <StatCard
            title="Total Posts"
            value={totalPosts}
            subtitle={totalPosts === 0 ? 'No posts indexed' : 'In memory database'}
            badgeText={`${totalPosts} Indexed`}
            icon={FileText}
            accentColor="primary"
          />

          <StatCard
            title="Total Views"
            value={totalViews.toLocaleString()}
            subtitle="Cumulative audience reach"
            badgeText={totalPosts > 0 ? `${Math.round(totalViews / (totalPosts || 1)).toLocaleString()} avg/post` : '0 avg'}
            icon={Eye}
            accentColor="emerald"
          />

          <StatCard
            title="Average Engagement"
            value={`${avgEngagement}%`}
            subtitle="Interactions relative to views"
            badgeText="Likes + Comments + Shares"
            icon={TrendingUp}
            accentColor="indigo"
          />

          <StatCard
            title="Top Performing Topic"
            value={topTopic}
            subtitle={
              topicBreakdown.length > 0
                ? `${topicBreakdown[0].totalViews.toLocaleString()} views generated`
                : 'Add posts to calculate'
            }
            badgeText="Highest Reach"
            icon={Award}
            accentColor="amber"
          />
        </div>
      </section>

      {/* D. Top Topics section */}
      {topicBreakdown.length > 0 && (
        <section className="top-topics-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Top Performing Topics</h2>
              <p className="section-subtitle">
                Performance patterns detected across your content history
              </p>
            </div>
            <span className="section-badge">
              {topicBreakdown.length} Topics Analyzed
            </span>
          </div>

          <div className="topics-grid">
            {topicBreakdown.slice(0, 4).map((t, idx) => {
              const maxViews = topicBreakdown[0]?.totalViews || 1;
              const percent = Math.min(100, Math.round((t.totalViews / maxViews) * 100));

              return (
                <div key={t.topic} className="topic-card">
                  <div className="topic-card-top">
                    <span className="topic-rank-badge">#{idx + 1}</span>
                    <span className="topic-name">{t.topic}</span>
                    <span className="topic-count">{t.postCount} post{t.postCount > 1 ? 's' : ''}</span>
                  </div>

                  <div className="topic-metrics-row">
                    <div className="topic-metric">
                      <span className="metric-muted">Views</span>
                      <strong>{t.totalViews.toLocaleString()}</strong>
                    </div>
                    <div className="topic-metric">
                      <span className="metric-muted">Avg Engagement</span>
                      <strong className="text-accent">{t.avgEngagement}%</strong>
                    </div>
                  </div>

                  <div className="topic-progress-bar-wrap">
                    <div
                      className="topic-progress-fill"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* C. Recent Content section */}
      <section className="recent-content-section">
        <div className="section-header content-header-row">
          <div>
            <h2 className="section-title">Recent Content</h2>
            <p className="section-subtitle">
              Memory entries used by the strategy agent ({filteredPosts.length} displayed)
            </p>
          </div>

          <div className="content-toolbar">
            {/* Search */}
            <div className="search-input-wrap">
              <Search size={15} className="search-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts..."
                className="search-input"
              />
            </div>

            {/* Filter by Topic */}
            {uniqueTopics.length > 2 && (
              <div className="topic-filter-wrap">
                <Filter size={14} className="filter-icon" />
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="filter-select"
                >
                  {uniqueTopics.map((topic) => (
                    <option key={topic} value={topic}>
                      {topic === 'ALL' ? 'All Topics' : topic}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Reset button */}
            <button
              onClick={handleResetData}
              className="btn-text-action"
              title="Reset memory to demo content"
            >
              <RotateCcw size={14} />
              <span>Reset Demo</span>
            </button>
          </div>
        </div>

        {/* Content list or Empty State */}
        {loading ? (
          <div className="loading-state-box">
            <div className="spinner"></div>
            <p>Accessing local content memory...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <EmptyState
            icon={Layers}
            title={posts.length === 0 ? "No Content in Memory" : "No Matching Posts"}
            description={
              posts.length === 0
                ? "Start adding your previous content to empower the strategy agent."
                : "No posts match your search or topic filter criteria."
            }
            actionText={posts.length === 0 ? "Add Your First Post" : "Clear Filter"}
            actionLink={posts.length === 0 ? "/add-content" : null}
            onAction={
              posts.length > 0
                ? () => {
                    setSelectedTopic('ALL');
                    setSearchQuery('');
                  }
                : null
            }
          />
        ) : (
          <div className="content-list-grid">
            {filteredPosts.map((post) => (
              <ContentCard
                key={post.id}
                post={post}
                onDelete={handleDeletePost}
              />
            ))}
          </div>
        )}
      </section>

      {/* Floating Bottom Navigation CTA banner */}
      <section className="strategy-cta-banner">
        <div className="cta-banner-content">
          <div className="cta-banner-icon">
            <Sparkles size={24} />
          </div>
          <div>
            <h3 className="cta-banner-title">Ready to plan your next piece of content?</h3>
            <p className="cta-banner-desc">
              ContentMind will run pattern matching against your {posts.length} stored post{posts.length === 1 ? '' : 's'}.
            </p>
          </div>
        </div>
        <Button
          variant="primary"
          size="lg"
          icon={ArrowRight}
          onClick={() => navigate('/strategy')}
        >
          Generate Recommendation
        </Button>
      </section>
    </div>
  );
}
