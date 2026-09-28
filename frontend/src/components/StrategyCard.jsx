import React, { useState } from 'react';
import { Sparkles, Copy, Check, Target, Lightbulb, HelpCircle, BarChart3, BookmarkCheck, ArrowUpRight } from 'lucide-react';

/**
 * Reusable StrategyCard component to display the generated recommendation
 */
export default function StrategyCard({ strategy, onCopyIdea }) {
  const [copied, setCopied] = useState(false);

  if (!strategy) return null;

  const handleCopy = () => {
    const textToCopy = `Topic: ${strategy.recommendedTopic}\nIdea: ${strategy.contentIdea}\nPlatform: ${strategy.targetPlatform || 'LinkedIn'}`;
    navigator.clipboard?.writeText?.(textToCopy);
    setCopied(true);
    if (onCopyIdea) onCopyIdea();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="strategy-card">
      <div className="strategy-card-header">
        <div className="strategy-pill-badge">
          <Sparkles size={14} />
          <span>Agent Recommendation</span>
        </div>
        <button
          onClick={handleCopy}
          className="strategy-copy-btn"
          title="Copy content idea to clipboard"
        >
          {copied ? <Check size={14} className="copied-icon" /> : <Copy size={14} />}
          <span>{copied ? 'Copied!' : 'Copy Idea'}</span>
        </button>
      </div>

      {/* RECOMMENDED TOPIC */}
      <div className="strategy-section">
        <span className="strategy-label">
          <Target size={14} /> RECOMMENDED TOPIC
        </span>
        <h2 className="strategy-topic-title">{strategy.recommendedTopic}</h2>
      </div>

      {/* CONTENT IDEA */}
      <div className="strategy-section strategy-idea-box">
        <span className="strategy-label">
          <Lightbulb size={14} /> CONTENT IDEA
        </span>
        <p className="strategy-idea-text">"{strategy.contentIdea}"</p>

        {(strategy.formatSuggestion || strategy.targetPlatform) && (
          <div className="strategy-meta-tags">
            {strategy.targetPlatform && (
              <span className="meta-tag platform-tag">
                Platform: <strong>{strategy.targetPlatform}</strong>
              </span>
            )}
            {strategy.formatSuggestion && (
              <span className="meta-tag format-tag">
                Format: <strong>{strategy.formatSuggestion}</strong>
              </span>
            )}
          </div>
        )}
      </div>

      {/* WHY THIS RECOMMENDATION? */}
      <div className="strategy-section">
        <span className="strategy-label">
          <HelpCircle size={14} /> WHY THIS RECOMMENDATION?
        </span>
        <p className="strategy-reasoning-text">{strategy.reasoning}</p>
      </div>

      {/* EVIDENCE */}
      {strategy.evidence && strategy.evidence.length > 0 && (
        <div className="strategy-section">
          <span className="strategy-label">
            <BarChart3 size={14} /> EVIDENCE FROM MEMORY
          </span>
          <ul className="strategy-evidence-list">
            {strategy.evidence.map((item, index) => (
              <li key={index} className="evidence-item">
                <span className="evidence-bullet">•</span>
                <span className="evidence-text">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* AUDIENCE INSIGHT & GAP */}
      {(strategy.audienceInsight || strategy.contentGap) && (
        <div className="strategy-insight-grid">
          {strategy.audienceInsight && (
            <div className="insight-card">
              <span className="insight-card-title">Audience Signal</span>
              <p className="insight-card-body">{strategy.audienceInsight}</p>
            </div>
          )}
          {strategy.contentGap && (
            <div className="insight-card">
              <span className="insight-card-title">Identified Content Gap</span>
              <p className="insight-card-body">{strategy.contentGap}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
