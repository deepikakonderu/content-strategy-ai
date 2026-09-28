import React, { useState } from 'react';
import {
  Brain,
  CheckCircle2,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

/**
 * Visual section representing the Hindsight memory layer
 * used by the ContentMind strategy agent.
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
            <h3 className="memory-heading">
              MEMORY CONTEXT
            </h3>

            <p className="memory-status-text">
              Connected to Hindsight Memory Service
            </p>
          </div>

        </div>

        <div className="memory-badges">

          <span className="demo-memory-badge">
            <span className="live-pulse"></span>
            Hindsight Active
          </span>

          <span className="memory-counter-tag">
            {postCount} items indexed
          </span>

        </div>
      </div>


      <div className="memory-signals-list">

        <div className="memory-signal-item">
          <CheckCircle2 size={16} className="signal-check-icon" />
          <span>Previous content analyzed</span>
        </div>

        <div className="memory-signal-item">
          <CheckCircle2 size={16} className="signal-check-icon" />
          <span>Content performance stored in Hindsight</span>
        </div>

        <div className="memory-signal-item">
          <CheckCircle2 size={16} className="signal-check-icon" />
          <span>Historical patterns recalled</span>
        </div>

        <div className="memory-signal-item">
          <CheckCircle2 size={16} className="signal-check-icon" />
          <span>Content gaps identified by AI</span>
        </div>

      </div>


      <div className="memory-hindsight-notice">

        <div className="notice-content">

          <Info size={15} className="notice-icon" />

          <p>
            <strong>Hindsight Memory:</strong>{' '}
            Content performance is stored as long-term memory.
            The strategy agent recalls relevant historical context
            and uses it to generate personalized recommendations.
          </p>

        </div>


        <button
          onClick={() => setShowArchitecture(!showArchitecture)}
          className="architecture-toggle-btn"
          aria-expanded={showArchitecture}
        >
          <span>
            {showArchitecture
              ? 'Hide memory architecture'
              : 'View memory architecture'}
          </span>

          {showArchitecture
            ? <ChevronUp size={14} />
            : <ChevronDown size={14} />
          }

        </button>


        {showArchitecture && (

          <div className="architecture-blueprint">

            <div className="pipeline-step">
              <span className="step-num">1</span>
              <span className="step-title">
                Frontend Capture
              </span>
              <span className="step-desc">
                Content history entered in UI
              </span>
            </div>

            <div className="pipeline-arrow">
              →
            </div>


            <div className="pipeline-step">
              <span className="step-num">2</span>
              <span className="step-title">
                Backend API
              </span>
              <span className="step-desc">
                REST /api/posts & /api/strategy
              </span>
            </div>

            <div className="pipeline-arrow">
              →
            </div>


            <div className="pipeline-step pipeline-highlight">
              <span className="step-num">3</span>
              <span className="step-title">
                Hindsight Memory
              </span>
              <span className="step-desc">
                Long-term semantic storage and recall
              </span>
            </div>

            <div className="pipeline-arrow">
              →
            </div>


            <div className="pipeline-step">
              <span className="step-num">4</span>
              <span className="step-title">
                AI Strategy Agent
              </span>
              <span className="step-desc">
                Memory-aware recommendation synthesis
              </span>
            </div>

          </div>

        )}

      </div>

    </section>
  );
}