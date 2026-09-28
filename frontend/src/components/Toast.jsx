import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose, duration = 3500 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const getIcon = () => {
    switch (type) {
      case 'error':
        return <AlertCircle size={18} className="toast-icon-error" />;
      case 'info':
        return <Info size={18} className="toast-icon-info" />;
      case 'success':
      default:
        return <CheckCircle2 size={18} className="toast-icon-success" />;
    }
  };

  return (
    <div className={`toast-container toast-${type}`} role="alert">
      <div className="toast-content">
        {getIcon()}
        <span className="toast-text">{message}</span>
      </div>
      {onClose && (
        <button onClick={onClose} className="toast-close-btn" aria-label="Dismiss toast">
          <X size={15} />
        </button>
      )}
    </div>
  );
}
