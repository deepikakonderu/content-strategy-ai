import React from 'react';

/**
 * Reusable Button component
 * Variants: primary, secondary, outline, danger, ghost
 * Sizes: sm, md, lg
 */
export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  icon: Icon = null,
  className = '',
  ...props
}) {
  const classes = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth ? 'btn-full' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      {...props}
    >
      {Icon && <Icon className="btn-icon" size={size === 'sm' ? 15 : size === 'lg' ? 20 : 17} />}
      <span>{children}</span>
    </button>
  );
}
