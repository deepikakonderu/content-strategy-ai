import React from 'react';
import { Layers, PlusCircle } from 'lucide-react';
import Button from './Button.jsx';
import { Link } from 'react-router-dom';

/**
 * Reusable EmptyState component
 */
export default function EmptyState({
  icon: Icon = Layers,
  title = 'No content found',
  description = 'You have not added any previous content posts yet.',
  actionText = 'Add Your First Post',
  actionLink = '/add-content',
  onAction = null,
  secondaryAction = null
}) {
  return (
    <div className="empty-state-box">
      <div className="empty-state-icon-wrap">
        <Icon size={32} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      <div className="empty-state-actions">
        {actionLink ? (
          <Link to={actionLink}>
            <Button variant="primary" icon={PlusCircle}>
              {actionText}
            </Button>
          </Link>
        ) : onAction ? (
          <Button variant="primary" onClick={onAction}>
            {actionText}
          </Button>
        ) : null}

        {secondaryAction}
      </div>
    </div>
  );
}
