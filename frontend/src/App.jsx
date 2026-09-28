import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AddContent from './pages/AddContent.jsx';
import Strategy from './pages/Strategy.jsx';

import { getPosts } from './utils/storage.js';

export default function App() {
  const [postCount, setPostCount] = useState(0);

  // Sync post count on mount
  useEffect(() => {
    try {
      const posts = getPosts();
      setPostCount(posts.length);
    } catch (e) {
      console.error('Error initializing post count:', e);
    }
  }, []);

  const refreshPostCount = (count) => {
    if (typeof count === 'number') {
      setPostCount(count);
    } else {
      const posts = getPosts();
      setPostCount(posts.length);
    }
  };

  return (
    <Router>
      <div className="app-shell">

        <Navbar postCount={postCount} />

        <main className="app-main-content">
          <Routes>

            <Route
              path="/"
              element={
                <Dashboard
                  onUpdatePostCount={refreshPostCount}
                />
              }
            />

            <Route
              path="/add-content"
              element={
                <AddContent
                  onPostAdded={refreshPostCount}
                />
              }
            />

            <Route
              path="/strategy"
              element={
                <Strategy
                  onUpdatePostCount={refreshPostCount}
                />
              }
            />

            {/* Catch-all fallback */}
            <Route
              path="*"
              element={
                <Dashboard
                  onUpdatePostCount={refreshPostCount}
                />
              }
            />

          </Routes>
        </main>

        <footer className="app-footer">
          <div className="footer-inner">

            <div className="footer-brand">
              <span className="footer-title">
                CONTENTMIND
              </span>

              <span className="footer-dot">
                •
              </span>

              <span className="footer-tagline">
                Memory-Powered Content Strategy
              </span>
            </div>

            <p className="footer-desc">
              Powered by Hindsight long-term memory and an AI content strategy agent.
            </p>

          </div>
        </footer>

      </div>
    </Router>
  );
}