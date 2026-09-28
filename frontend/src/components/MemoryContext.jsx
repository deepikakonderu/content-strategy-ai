import React, { useState } from 'react';
import { Brain, CheckCircle2, Database, Info, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * Visual section representing the memory layer of the strategy agent
 * Highlights how ContentMind processes content history and prepares for Hindsight integration.
 */
export default function MemoryContext({ postCount = 0 }) {
  const [showArchitecture, setShowArchitecture] = useState(false);

  return (
    <section className="memory-context-card">
      <div className="memory-context-header">
        <div className="memory-title-wrap">
          <div className="memory-icon-bubble">
            <Brain size={18} />
          </div>
          <div>
            <h3 className="memory-heading">MEMORY CONTEXT</h3>
            <p className="memory-status-text">
              Currently using local content history
            </p>
          </div>
        </div>

        <div className="memory-badges">
          <span className="demo-memory-badge">
            <span className="live-pulse"></span>
            Demo Memory
          </span>
          <span className="memory-counter-tag">{postCount} items indexed</span>
        </div>
      </div>

      <div className="memory-signals-list">
        <div className="memory-signal-item">
          <CheckCircle2 size={16} className="signal-check-icon" />
          <span>Previous content analyzed</span>
        </div>
        <div className="memory-signal-item">
          <CheckCircle2 size={16} className="signal-check-icon" />
          <span>Content performance remembered</span>
        </div>
        <div className="memory-signal-item">
          <CheckCircle2 size={16} className="signal-check-icon" />
          <span>Successful topics identified</span>
        </div>
        <div className="memory-signal-item">
          <CheckCircle2 size={16} className="signal-check-icon" />
          <span>Content gaps identified</span>
        </div>
      </div>

      <div className="memory-hindsight-notice">
        <div className="notice-content">
          <Info size={15} className="notice-icon" />
          <p>
            <strong>Hackathon Note:</strong> This frontend demo simulates memory using browser <code>localStorage</code>.
            In the upcoming release, this agent will connect directly to the <strong>Hindsight Memory Service</strong> via backend API.
          </p>
        </div>

        <button
          onClick={() => setShowArchitecture(!showArchitecture)}
          className="architecture-toggle-btn"
          aria-expanded={showArchitecture}
        >
          <span>{showArchitecture ? 'Hide architecture blueprint' : 'View planned memory flow'}</span>
          {showArchitecture ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showArchitecture && (
          <div className="architecture-blueprint">
            <div className="pipeline-step">
              <span className="step-num">1</span>
              <span className="step-title">Frontend Capture</span>
              <span className="step-desc">Content history entered in UI</span>
            </div>
            <div className="pipeline-arrow">→</div>
            <div className="pipeline-step">
              <span className="step-num">2</span>
              <span className="step-title">Backend API</span>
              <span className="step-desc">REST /api/posts & /api/strategy</span>
            </div>
            <div className="pipeline-arrow">→</div>
            <div className="pipeline-step pipeline-highlight">
              <span className="step-num">3</span>
              <span className="step-title">Hindsight Memory</span>
              <span className="step-desc">Long-term semantic recall</span>
            </div>
            <div className="pipeline-arrow">→</div>
            <div className="pipeline-step">
              <span className="step-num">4</span>
              <span className="step-title">AI Strategy Agent</span>
              <span className="step-desc">Recommendation synthesis</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
