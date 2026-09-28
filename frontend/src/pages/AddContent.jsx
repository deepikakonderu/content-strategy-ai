import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlusCircle, ArrowLeft, CheckCircle2, AlertCircle, Sparkles, FileText } from 'lucide-react';
import * as api from '../services/api.js';
import Button from '../components/Button.jsx';
import Toast from '../components/Toast.jsx';

export default function AddContent({ onPostAdded }) {
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    topic: '',
    platform: 'LinkedIn',
    date: new Date().toISOString().split('T')[0],
    views: '',
    likes: '',
    comments: '',
    shares: ''
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Handle inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear specific error on change
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  // Validation
  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Content Title is required.';
    }

    if (!formData.topic.trim()) {
      newErrors.topic = 'Topic is required.';
    }

    if (!formData.platform.trim()) {
      newErrors.platform = 'Platform is required.';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required.';
    }

    // Validate non-negative numbers
    const numFields = ['views', 'likes', 'comments', 'shares'];
    numFields.forEach((field) => {
      const val = formData[field];
      if (val !== '' && val !== null && val !== undefined) {
        const num = Number(val);
        if (isNaN(num)) {
          newErrors[field] = 'Must be a valid number.';
        } else if (num < 0) {
          newErrors[field] = 'Value must be 0 or greater.';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitting(true);

    try {
      const newPostPayload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        topic: formData.topic.trim(),
        platform: formData.platform,
        date: formData.date,
        views: Number(formData.views) || 0,
        likes: Number(formData.likes) || 0,
        comments: Number(formData.comments) || 0,
        shares: Number(formData.shares) || 0
      };

      await api.addPost(newPostPayload);

      if (onPostAdded) {
        onPostAdded();
      }

      setToastMessage('Content saved to memory! Redirecting...');

      // Redirect to Dashboard
      setTimeout(() => {
        navigate('/');
      }, 700);
    } catch (err) {
      console.error('Failed to save post:', err);
      setErrors({ form: 'An unexpected error occurred while saving to memory.' });
      setSubmitting(false);
    }
  };

  // Quick Demo Prefill helper for hackathon testers
  const handleQuickPrefill = (type) => {
    if (type === 'agent') {
      setFormData({
        title: 'Deep Research Agents in Production: 3 Hard Lessons',
        description: 'Case study examining tool timeout recovery and prompt caching for autonomous research bots.',
        topic: 'AI Agents',
        platform: 'LinkedIn',
        date: new Date().toISOString().split('T')[0],
        views: '16500',
        likes: '1240',
        comments: '195',
        shares: '140'
      });
    } else {
      setFormData({
        title: 'Modern Frontend Architecture Patterns',
        description: 'How state isolation and memory layers improve app scalability.',
        topic: 'Frontend Development',
        platform: 'Blog',
        date: new Date().toISOString().split('T')[0],
        views: '8200',
        likes: '450',
        comments: '60',
        shares: '35'
      });
    }
    setErrors({});
  };

  return (
    <div className="page-container add-content-page">
      {toastMessage && (
        <Toast message={toastMessage} type="success" onClose={() => setToastMessage('')} />
      )}

      {/* Top back navigation */}
      <div className="back-nav-bar">
        <Link to="/" className="back-link">
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>

        {/* Quick fill demo button */}
        <div className="quick-fill-group">
          <span className="quick-fill-label">Demo Prefill:</span>
          <button
            type="button"
            onClick={() => handleQuickPrefill('agent')}
            className="quick-fill-btn"
          >
            + AI Agent Post
          </button>
          <button
            type="button"
            onClick={() => handleQuickPrefill('frontend')}
            className="quick-fill-btn"
          >
            + Frontend Post
          </button>
        </div>
      </div>

      <div className="form-card-container">
        {/* Form Header */}
        <div className="form-card-header">
          <div className="form-icon-bubble">
            <PlusCircle size={22} />
          </div>
          <div>
            <h1 className="form-title">Add Previous Content</h1>
            <p className="form-subtitle">
              Give ContentMind some context about your content history.
            </p>
          </div>
        </div>

        {/* Global Error Banner if any */}
        {errors.form && (
          <div className="form-error-banner">
            <AlertCircle size={16} />
            <span>{errors.form}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="content-form" noValidate>
          {/* Content Title */}
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Content Title <span className="required-star">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. 5 AI Tools Developers Should Know"
              className={`form-input ${errors.title ? 'input-error' : ''}`}
              required
            />
            {errors.title && <span className="field-error-msg">{errors.title}</span>}
          </div>

          {/* Content Description */}
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Content Description <span className="optional-tag">(Optional)</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Brief summary of the post context, key takeaway, or hook used..."
              className="form-textarea"
            />
          </div>

          {/* Row 2: Topic & Platform */}
          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="topic" className="form-label">
                Topic <span className="required-star">*</span>
              </label>
              <input
                type="text"
                id="topic"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                placeholder="e.g. AI Agents, Machine Learning, Productivity"
                className={`form-input ${errors.topic ? 'input-error' : ''}`}
                required
              />
              {errors.topic && <span className="field-error-msg">{errors.topic}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="platform" className="form-label">
                Platform <span className="required-star">*</span>
              </label>
              <select
                id="platform"
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                className={`form-select ${errors.platform ? 'input-error' : ''}`}
                required
              >
                <option value="LinkedIn">LinkedIn</option>
                <option value="Instagram">Instagram</option>
                <option value="YouTube">YouTube</option>
                <option value="Twitter/X">Twitter/X</option>
                <option value="Blog">Blog</option>
                <option value="Other">Other</option>
              </select>
              {errors.platform && <span className="field-error-msg">{errors.platform}</span>}
            </div>
          </div>

          {/* Row 3: Date */}
          <div className="form-group">
            <label htmlFor="date" className="form-label">
              Publication Date <span className="required-star">*</span>
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`form-input ${errors.date ? 'input-error' : ''}`}
              required
            />
            {errors.date && <span className="field-error-msg">{errors.date}</span>}
          </div>

          {/* Performance Metrics Section */}
          <div className="form-section-divider">
            <span className="divider-label">Performance Metrics (&ge; 0)</span>
          </div>

          <div className="form-metrics-row-4">
            <div className="form-group">
              <label htmlFor="views" className="form-label">Views</label>
              <input
                type="number"
                id="views"
                name="views"
                min="0"
                value={formData.views}
                onChange={handleChange}
                placeholder="0"
                className={`form-input ${errors.views ? 'input-error' : ''}`}
              />
              {errors.views && <span className="field-error-msg">{errors.views}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="likes" className="form-label">Likes</label>
              <input
                type="number"
                id="likes"
                name="likes"
                min="0"
                value={formData.likes}
                onChange={handleChange}
                placeholder="0"
                className={`form-input ${errors.likes ? 'input-error' : ''}`}
              />
              {errors.likes && <span className="field-error-msg">{errors.likes}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="comments" className="form-label">Comments</label>
              <input
                type="number"
                id="comments"
                name="comments"
                min="0"
                value={formData.comments}
                onChange={handleChange}
                placeholder="0"
                className={`form-input ${errors.comments ? 'input-error' : ''}`}
              />
              {errors.comments && <span className="field-error-msg">{errors.comments}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="shares" className="form-label">Shares</label>
              <input
                type="number"
                id="shares"
                name="shares"
                min="0"
                value={formData.shares}
                onChange={handleChange}
                placeholder="0"
                className={`form-input ${errors.shares ? 'input-error' : ''}`}
              />
              {errors.shares && <span className="field-error-msg">{errors.shares}</span>}
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-action-buttons">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/')}
              disabled={submitting}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon={PlusCircle}
              disabled={submitting}
              className="save-content-btn"
            >
              {submitting ? 'Saving to Memory...' : 'Save to ContentMind'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
