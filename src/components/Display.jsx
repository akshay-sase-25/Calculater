import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { formatDisplayNumber } from '../utils/calculator';

/**
 * Display component showing current calculation expression, result value,
 * and copy-to-clipboard functionality with dynamic text scaling.
 */
const Display = ({
  value,
  expression,
  error,
  isWaitingForOperand,
  activeOperator,
}) => {
  const [copied, setCopied] = useState(false);

  // Copy current display value to clipboard
  const handleCopy = async () => {
    if (!value || error) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Determine dynamic font scaling based on text length
  const getFontSizeClass = (text) => {
    const len = String(text).length;
    if (len > 16) return 'display-text-xs';
    if (len > 12) return 'display-text-sm';
    if (len > 9) return 'display-text-md';
    return 'display-text-lg';
  };

  const formattedDisplay = error ? error : formatDisplayNumber(value);
  const fontSizeClass = getFontSizeClass(formattedDisplay);

  return (
    <div className={`calc-display ${error ? 'display-error' : ''}`}>
      {/* Upper expression / breadcrumbs line */}
      <div className="display-expression-row">
        <span className="display-expression" title={expression}>
          {expression || '\u00A0'}
        </span>
        {activeOperator && isWaitingForOperand && (
          <span className="display-active-operator-badge">
            {activeOperator}
          </span>
        )}
      </div>

      {/* Main value / result row */}
      <div className="display-main-row">
        <div
          id="calculator-display-value"
          className={`display-value ${fontSizeClass}`}
          title={value}
        >
          {formattedDisplay}
        </div>

        {/* Copy button */}
        {!error && (
          <button
            type="button"
            className="copy-btn"
            onClick={handleCopy}
            title="Copy value to clipboard"
            aria-label="Copy display value"
          >
            {copied ? (
              <span className="copy-feedback">
                <Check size={14} className="copy-icon-copied" /> Copied
              </span>
            ) : (
              <Copy size={16} className="copy-icon" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default React.memo(Display);
