import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Brain, LayoutDashboard, PlusCircle, Sparkles, Menu, X } from 'lucide-react';

export default function Navbar({ postCount = 0 }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Brand / Logo */}
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <div className="navbar-logo-icon">
            <Brain size={22} />
          </div>
          <div className="navbar-brand-text">
            <span className="navbar-title">CONTENTMIND</span>
            <span className="navbar-subtitle">Memory-Powered Content Strategy</span>
          </div>
        </Link>

        {/* Mobile menu toggle */}
        <button
          className="navbar-mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Navigation links */}
        <nav className={`navbar-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={closeMenu}
          >
            <LayoutDashboard size={17} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/add-content"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={closeMenu}
          >
            <PlusCircle size={17} />
            <span>Add Content</span>
          </NavLink>

          <NavLink
            to="/strategy"
            className={({ isActive }) => `nav-link nav-link-highlight ${isActive ? 'active' : ''}`}
            onClick={closeMenu}
          >
            <Sparkles size={17} />
            <span>Strategy</span>
          </NavLink>

          {/* Memory Status Badge */}
          <div className="navbar-memory-badge">
            <span className="memory-indicator-dot"></span>
            <span className="memory-badge-label">Demo Memory</span>
            <span className="memory-badge-count">{postCount} posts</span>
          </div>
        </nav>
      </div>
    </header>
  );
}
