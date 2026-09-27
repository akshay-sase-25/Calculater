import React from 'react';

/**
 * Reusable Button component for the calculator.
 * Supports numbers, operators, action keys, and equals with distinct visual themes and tactile animations.
 *
 * @param {Object} props
 * @param {string|React.ReactNode} props.label - Display text or component
 * @param {React.ReactNode} [props.icon] - Optional icon component
 * @param {'number'|'operator'|'action'|'equals'} [props.type='number'] - Button classification
 * @param {() => void} props.onClick - Click event handler
 * @param {boolean} [props.active=false] - Whether the button is actively highlighted (e.g. selected operator)
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {string} [props.id] - Unique DOM id
 * @param {string} [props.ariaLabel] - Accessibility label
 * @param {string} [props.keyboardHint] - Optional small badge showing hotkey
 * @param {boolean} [props.disabled=false] - Disabled state
 */
const Button = ({
  label,
  icon,
  type = 'number',
  onClick,
  active = false,
  className = '',
  id,
  ariaLabel,
  keyboardHint,
  disabled = false,
}) => {
  const handleClick = (e) => {
    // Blur to avoid lingering focus ring on click while keeping keyboard accessible
    e.currentTarget.blur();
    if (!disabled && onClick) {
      onClick();
    }
  };

  const buttonClasses = [
    'calc-btn',
    `btn-${type}`,
    active ? 'btn-active' : '',
    disabled ? 'btn-disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      id={id || `btn-${String(label).toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
      type="button"
      className={buttonClasses}
      onClick={handleClick}
      aria-label={ariaLabel || (typeof label === 'string' ? label : undefined)}
      disabled={disabled}
    >
      <span className="btn-content">
        {icon ? <span className="btn-icon">{icon}</span> : label}
      </span>
      {keyboardHint && <span className="btn-hint">{keyboardHint}</span>}
    </button>
  );
};

export default React.memo(Button);
