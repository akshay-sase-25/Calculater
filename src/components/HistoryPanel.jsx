import React from 'react';
import { Trash2, Clock, X, RotateCcw } from 'lucide-react';
import { formatDisplayNumber } from '../utils/calculator';

/**
 * Slide-out or collapsible History Panel displaying past calculations.
 * Users can recall past results into current calculation or clear history.
 */
const HistoryPanel = ({
  isOpen,
  onClose,
  history = [],
  onClearHistory,
  onSelectHistoryItem,
}) => {
  if (!isOpen) return null;

  return (
    <div className="history-panel-overlay" onClick={onClose}>
      <aside
        className="history-panel"
        onClick={(e) => e.stopPropagation()}
        aria-label="Calculation history"
      >
        <div className="history-header">
          <div className="history-title-group">
            <Clock size={18} className="history-icon" />
            <h3 className="history-title">History</h3>
            {history.length > 0 && (
              <span className="history-badge">{history.length}</span>
            )}
          </div>
          <div className="history-actions">
            {history.length > 0 && (
              <button
                type="button"
                className="history-clear-btn"
                onClick={onClearHistory}
                title="Clear all history"
                aria-label="Clear history"
              >
                <Trash2 size={16} />
                <span>Clear</span>
              </button>
            )}
            <button
              type="button"
              className="history-close-btn"
              onClick={onClose}
              title="Close history"
              aria-label="Close history"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="history-content">
          {history.length === 0 ? (
            <div className="history-empty">
              <Clock size={40} className="history-empty-icon" />
              <p className="history-empty-text">No calculations yet</p>
              <span className="history-empty-sub">
                Completed calculations will appear here.
              </span>
            </div>
          ) : (
            <ul className="history-list">
              {history.map((item) => (
                <li
                  key={item.id}
                  className="history-item"
                  onClick={() => {
                    onSelectHistoryItem(item);
                    onClose();
                  }}
                  title="Click to load into calculator"
                >
                  <div className="history-item-top">
                    <span className="history-expression">{item.expression}</span>
                    <span className="history-time">{item.time}</span>
                  </div>
                  <div className="history-item-bottom">
                    <span className="history-result">
                      = {formatDisplayNumber(String(item.result))}
                    </span>
                    <span className="history-recall-hint">
                      <RotateCcw size={12} /> Recall
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
};

export default React.memo(HistoryPanel);
