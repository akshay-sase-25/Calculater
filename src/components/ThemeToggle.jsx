import React from 'react';
import { Sun, Moon } from 'lucide-react';

/**
 * Theme toggle switch component for switching between dark and light themes.
 */
const ThemeToggle = ({ theme, onToggle }) => {
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className="theme-toggle-btn"
      onClick={onToggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className={`theme-toggle-indicator ${isDark ? 'is-dark' : 'is-light'}`}>
        {isDark ? <Moon size={16} /> : <Sun size={16} />}
      </div>
      <span className="theme-toggle-label">{isDark ? 'Dark' : 'Light'}</span>
    </button>
  );
};

export default React.memo(ThemeToggle);
