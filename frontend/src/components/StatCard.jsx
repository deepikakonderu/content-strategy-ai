import React from 'react';

/**
 * Reusable StatCard component for dashboard metrics
 */
export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badgeText,
  accentColor = 'primary',
  className = ''
}) {
  return (
    <div className={`stat-card stat-accent-${accentColor} ${className}`}>
      <div className="stat-card-header">
        <span className="stat-card-title">{title}</span>
        {Icon && (
          <div className="stat-card-icon-wrap">
            <Icon size={19} />
          </div>
        )}
      </div>

      <div className="stat-card-body">
        <div className="stat-card-value">{value}</div>
        {(subtitle || badgeText) && (
          <div className="stat-card-footer">
            {badgeText && <span className="stat-card-badge">{badgeText}</span>}
            {subtitle && <span className="stat-card-subtitle">{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
