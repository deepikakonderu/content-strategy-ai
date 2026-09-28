import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Brain,
  PlusCircle,
  Lightbulb,
  Layers
} from 'lucide-react';
import * as api from '../services/api.js';
import Button from '../components/Button.jsx';
import StrategyCard from '../components/StrategyCard.jsx';
import MemoryContext from '../components/MemoryContext.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Toast from '../components/Toast.jsx';

export default function Strategy({ onUpdatePostCount }) {
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [strategy, setStrategy] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [hasGeneratedOnce, setHasGeneratedOnce] = useState(false);

  // Load existing posts from backend
  const fetchPosts = async () => {
    setLoadingPosts(true);

    try {
      const data = await api.getPosts();
      setPosts(data);

      if (onUpdatePostCount) {
        onUpdatePostCount(data.length);
      }
    } catch (err) {
      console.error('Failed to load posts for strategy:', err);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Generate strategy using Hindsight memories + AI agent
  const handleGenerateStrategy = async () => {
    if (posts.length === 0) {
      setToastMessage('Add at least one post before generating strategy.');
      return;
    }

    setAnalyzing(true);
    setAnalysisStep(1);

    // Step 1: recall memory
    setTimeout(() => {
      setAnalysisStep(2);
    }, 350);

    // Step 2: detect patterns
    setTimeout(() => {
      setAnalysisStep(3);
    }, 700);

    // Step 3: generate recommendation
    setTimeout(async () => {
      try {
        const result = await api.generateStrategy();

        setStrategy(result);
        setHasGeneratedOnce(true);
        setToastMessage(
          'Strategy recommendation synthesized from Hindsight memory!'
        );
      } catch (err) {
        console.error('Error generating strategy:', err);
        setToastMessage('Could not generate strategy.');
      } finally {
        setAnalyzing(false);
        setAnalysisStep(0);
      }
    }, 1100);
  };

  return (
    <div className="page-container strategy-page">

      {toastMessage && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setToastMessage('')}
        />
      )}

      {/* Page Header */}
      <section className="strategy-header">
        <div className="strategy-header-bubble">
          <Brain size={22} />
        </div>

        <h1 className="strategy-page-title">
          Content Strategist
        </h1>

        <p className="strategy-page-subtitle">
          Ask what your content history says you should create next.
        </p>
      </section>

      {/* Main Trigger Card */}
      <section className="strategy-prompt-card">
        <div className="prompt-card-inner">

          <div className="prompt-card-question-box">
            <span className="prompt-badge">
              Agent Prompt
            </span>

            <h2 className="prompt-big-question">
              "What should I post next?"
            </h2>

            <p className="prompt-explanation">
              ContentMind will recall your previous content from Hindsight
              and use AI to identify patterns and recommend what to create next.
            </p>
          </div>

          <div className="prompt-action-wrap">

            <Button
              variant="primary"
              size="lg"
              icon={Sparkles}
              onClick={handleGenerateStrategy}
              disabled={analyzing || posts.length === 0}
              className="generate-strategy-btn"
            >
              {analyzing
                ? 'Analyzing Memory...'
                : hasGeneratedOnce
                ? 'Regenerate Strategy'
                : 'Generate Strategy'}
            </Button>

            <span className="prompt-stats-hint">
              Based on {posts.length} post{posts.length === 1 ? '' : 's'} in memory
            </span>

          </div>
        </div>

        {/* Dynamic Analysis Progress */}
        {analyzing && (
          <div className="analysis-progress-strip">

            <div className="analysis-indicator-row">

              <span
                className={`progress-pill ${
                  analysisStep >= 1 ? 'active' : ''
                }`}
              >
                <span className="pill-dot"></span>
                1. Reading Hindsight memory ({posts.length} entries)
              </span>

              <span
                className={`progress-pill ${
                  analysisStep >= 2 ? 'active' : ''
                }`}
              >
                <span className="pill-dot"></span>
                2. Detecting engagement patterns
              </span>

              <span
                className={`progress-pill ${
                  analysisStep >= 3 ? 'active' : ''
                }`}
              >
                <span className="pill-dot"></span>
                3. Synthesizing next strategy
              </span>

            </div>

            <div className="analysis-loading-bar">
              <div
                className="loading-bar-fill"
                style={{
                  width: `${(analysisStep / 3) * 100}%`
                }}
              ></div>
            </div>

          </div>
        )}
      </section>

      {/* Memory + Recommendation */}
      <div className="strategy-content-layout">

        {/* Memory Context */}
        <aside className="strategy-sidebar">

          <MemoryContext postCount={posts.length} />

          <div className="memory-quick-stats">

            <h4 className="quick-stats-title">
              Memory Signals
            </h4>

            <div className="quick-stats-row">
              <span className="quick-stat-label">
                Stored Posts
              </span>

              <span className="quick-stat-val">
                {posts.length}
              </span>
            </div>

            <div className="quick-stats-row">
              <span className="quick-stat-label">
                Total Views Analyzed
              </span>

              <span className="quick-stat-val">
                {posts
                  .reduce(
                    (s, p) => s + (Number(p.views) || 0),
                    0
                  )
                  .toLocaleString()}
              </span>
            </div>

            <div className="quick-stats-row">
              <span className="quick-stat-label">
                Storage Target
              </span>

              <span className="quick-stat-val">
                Hindsight Memory
              </span>
            </div>

            <div className="quick-stats-row">
              <span className="quick-stat-label">
                Memory Provider
              </span>

              <span className="quick-stat-val text-accent">
                Active
              </span>
            </div>

            <div className="sidebar-action-wrap">

              <Link
                to="/add-content"
                className="sidebar-link-btn"
              >
                <PlusCircle size={14} />
                <span>Add more historical posts</span>
              </Link>

            </div>

          </div>
        </aside>

        {/* Strategy Recommendation */}
        <main className="strategy-main-area">

          {posts.length === 0 ? (

            <EmptyState
              icon={Layers}
              title="No content in memory"
              description="To receive personalized recommendations, add your previous posts with their performance metrics."
              actionText="Add Previous Content"
              actionLink="/add-content"
            />

          ) : strategy ? (

            <StrategyCard
              strategy={strategy}
              onCopyIdea={() =>
                setToastMessage(
                  'Content idea copied to clipboard!'
                )
              }
            />

          ) : (

            <div className="strategy-placeholder-card">

              <div className="placeholder-icon-wrap">
                <Lightbulb size={36} />
              </div>

              <h3 className="placeholder-title">
                Ready for Your Strategy Recommendation
              </h3>

              <p className="placeholder-desc">
                Click <strong>"Generate Strategy"</strong> above
                to trigger the ContentMind agent.
                It will recall Hindsight memories and correlate
                views, likes, comments, and topics across your{' '}
                {posts.length} stored posts to recommend what
                content you should produce next.
              </p>

              <div className="placeholder-features-preview">

                <div className="preview-chip">
                  ✓ Topic Recommendation
                </div>

                <div className="preview-chip">
                  ✓ Concrete Headline Idea
                </div>

                <div className="preview-chip">
                  ✓ AI Reasoning
                </div>

                <div className="preview-chip">
                  ✓ Historical Evidence
                </div>

              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
}