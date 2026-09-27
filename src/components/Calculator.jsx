import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { History as HistoryIcon } from 'lucide-react';
import Display from './Display';
import ButtonPanel from './ButtonPanel';
import HistoryPanel from './HistoryPanel';
import ThemeToggle from './ThemeToggle';
import { calculate, normalizeOperator } from '../utils/calculator';

/**
 * Main Calculator Container Component
 * Holds core state for current input, stored previous value, active operator,
 * calculation history, theme, and manages keyboard event listeners.
 */
const Calculator = () => {
  // --- State Variables ---
  const [displayValue, setDisplayValue] = useState('0');
  const [prevValue, setPrevValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [expression, setExpression] = useState('');
  const [error, setError] = useState(null);

  // History state with persistence in localStorage
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('neocalc_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Theme state: dark (default) or light
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('neocalc_theme');
      if (savedTheme) return savedTheme;
      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  // Save theme changes & update root element
  useEffect(() => {
    try {
      localStorage.setItem('neocalc_theme', theme);
    } catch (err) {
      console.warn('Could not save theme preference:', err);
    }
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Save calculation history changes
  useEffect(() => {
    try {
      localStorage.setItem('neocalc_history', JSON.stringify(history));
    } catch (err) {
      console.warn('Could not save calculation history:', err);
    }
  }, [history]);

  // Helper to add an item to the history list
  const addToHistory = useCallback((expr, res) => {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      expression: expr,
      result: res,
      time,
    };
    setHistory((prev) => [newEntry, ...prev.slice(0, 49)]); // Keep last 50 items
  }, []);

  // --- Input Handlers ---

  /**
   * Handle digit button clicks or numeric keypresses (0-9)
   */
  const handleDigit = useCallback((digit) => {
    if (error) {
      // Clear error on new digit
      setError(null);
      setDisplayValue(digit);
      setWaitingForOperand(false);
      setExpression('');
      return;
    }

    if (waitingForOperand) {
      setDisplayValue(digit);
      setWaitingForOperand(false);
    } else {
      // Prevent redundant leading zeros like '000'
      if (displayValue === '0') {
        setDisplayValue(digit);
      } else {
        // Enforce max length of 16 digits to prevent display overflow
        if (displayValue.replace(/[^0-9]/g, '').length < 16) {
          setDisplayValue((prev) => prev + digit);
        }
      }
    }
  }, [displayValue, waitingForOperand, error]);

  /**
   * Handle decimal point (.)
   */
  const handleDecimal = useCallback(() => {
    if (error) {
      setError(null);
      setDisplayValue('0.');
      setWaitingForOperand(false);
      setExpression('');
      return;
    }

    if (waitingForOperand) {
      setDisplayValue('0.');
      setWaitingForOperand(false);
      return;
    }

    // Ignore if current display value already includes a decimal point
    if (!displayValue.includes('.')) {
      setDisplayValue((prev) => prev + '.');
    }
  }, [displayValue, waitingForOperand, error]);

  /**
   * Handle operators (+, −, ×, ÷)
   * Supports chained operations like 5 + 3 × 2 =
   */
  const handleOperator = useCallback((nextOperator) => {
    const symbol = normalizeOperator(nextOperator);

    if (error) return;

    const inputValue = parseFloat(displayValue);

    // Case 1: An operator is already selected and user is waiting for the next operand.
    // Allow user to switch the operator (e.g. accidentally clicked + instead of ×).
    if (waitingForOperand && operator) {
      setOperator(symbol);
      setExpression(`${prevValue} ${symbol}`);
      return;
    }

    // Case 2: No previous value exists yet. Start the chain.
    if (prevValue === null) {
      setPrevValue(inputValue);
      setOperator(symbol);
      setWaitingForOperand(true);
      setExpression(`${inputValue} ${symbol}`);
      return;
    }

    // Case 3: Chained operation! Previous value and operator exist, and user entered another operator.
    // Calculate the intermediate result immediately.
    if (operator) {
      const calculation = calculate(prevValue, inputValue, operator);

      if (calculation.error) {
        setError(calculation.error);
        setPrevValue(null);
        setOperator(null);
        setWaitingForOperand(false);
        setExpression('');
        return;
      }

      const newResult = calculation.result;
      setDisplayValue(String(newResult));
      setPrevValue(newResult);
      setOperator(symbol);
      setWaitingForOperand(true);
      setExpression(`${newResult} ${symbol}`);
    }
  }, [displayValue, operator, prevValue, waitingForOperand, error]);

  /**
   * Handle equals (= / Enter)
   */
  const handleEquals = useCallback(() => {
    if (error) return;

    // If no previous value or operator, doing equals doesn't compute anything
    if (prevValue === null || !operator) {
      return;
    }

    const currentOperand = parseFloat(displayValue);
    const calculation = calculate(prevValue, currentOperand, operator);

    if (calculation.error) {
      setError(calculation.error);
      setPrevValue(null);
      setOperator(null);
      setWaitingForOperand(false);
      setExpression('');
      return;
    }

    const finalResult = calculation.result;
    const completedExpression = `${prevValue} ${operator} ${currentOperand} =`;

    // Add to calculation history
    addToHistory(completedExpression, finalResult);

    setDisplayValue(String(finalResult));
    setExpression(completedExpression);
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  }, [prevValue, operator, displayValue, error, addToHistory]);

  /**
   * Handle Clear / Reset (AC or C)
   */
  const handleClear = useCallback(() => {
    if (error) {
      setError(null);
      setDisplayValue('0');
      setPrevValue(null);
      setOperator(null);
      setWaitingForOperand(false);
      setExpression('');
      return;
    }

    // If user has typed digits in current step, clear current entry (C)
    // If already '0' or waiting, All Clear (AC)
    if (displayValue !== '0' && !waitingForOperand) {
      setDisplayValue('0');
    } else {
      setDisplayValue('0');
      setPrevValue(null);
      setOperator(null);
      setWaitingForOperand(false);
      setExpression('');
    }
  }, [displayValue, waitingForOperand, error]);

  /**
   * Handle Backspace / Delete last digit (⌫)
   */
  const handleBackspace = useCallback(() => {
    if (error) {
      setError(null);
      setDisplayValue('0');
      return;
    }

    if (waitingForOperand) {
      return;
    }

    // If single digit or negative single digit, reset to '0'
    if (
      displayValue.length === 1 ||
      (displayValue.length === 2 && displayValue.startsWith('-'))
    ) {
      setDisplayValue('0');
    } else {
      const trimmed = displayValue.slice(0, -1);
      setDisplayValue(trimmed === '' || trimmed === '-' ? '0' : trimmed);
    }
  }, [displayValue, waitingForOperand, error]);

  /**
   * Handle Sign Toggle (±)
   */
  const handleToggleSign = useCallback(() => {
    if (error || displayValue === '0') return;

    if (displayValue.startsWith('-')) {
      setDisplayValue(displayValue.slice(1));
    } else {
      setDisplayValue('-' + displayValue);
    }
  }, [displayValue, error]);

  /**
   * Handle Percentage (%)
   */
  const handlePercentage = useCallback(() => {
    if (error) return;

    const currentNum = parseFloat(displayValue);
    if (Number.isNaN(currentNum)) return;

    // If an operator and previous value exist (e.g. 200 + 10%), calculate 10% of 200
    if (prevValue !== null && operator) {
      const percentageValue = (prevValue * currentNum) / 100;
      setDisplayValue(String(percentageValue));
    } else {
      // Standalone percentage (e.g. 50% = 0.5)
      const result = currentNum / 100;
      setDisplayValue(String(result));
    }
  }, [displayValue, prevValue, operator, error]);

  /**
   * Recall a past calculation result from the History Panel
   */
  const handleSelectHistoryItem = useCallback((item) => {
    setDisplayValue(String(item.result));
    setExpression(`Ans = ${item.result}`);
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(true);
    setError(null);
  }, []);

  /**
   * Clear all history
   */
  const handleClearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  // --- Keyboard Event Listener ---
  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key } = event;

      // Digits 0-9
      if (/^[0-9]$/.test(key)) {
        event.preventDefault();
        handleDigit(key);
        return;
      }

      // Decimal point
      if (key === '.') {
        event.preventDefault();
        handleDecimal();
        return;
      }

      // Operators
      if (key === '+') {
        event.preventDefault();
        handleOperator('+');
        return;
      }
      if (key === '-') {
        event.preventDefault();
        handleOperator('−');
        return;
      }
      if (key === '*') {
        event.preventDefault();
        handleOperator('×');
        return;
      }
      if (key === '/') {
        event.preventDefault();
        handleOperator('÷');
        return;
      }

      // Percentage
      if (key === '%') {
        event.preventDefault();
        handlePercentage();
        return;
      }

      // Equals / Enter
      if (key === 'Enter' || key === '=') {
        event.preventDefault();
        handleEquals();
        return;
      }

      // Backspace
      if (key === 'Backspace') {
        event.preventDefault();
        handleBackspace();
        return;
      }

      // Clear / Escape
      if (key === 'Escape') {
        event.preventDefault();
        handleClear();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    handleDigit,
    handleDecimal,
    handleOperator,
    handleEquals,
    handleBackspace,
    handleClear,
    handlePercentage,
  ]);

  // Determine if clear button should be 'AC' (all clear) or 'C' (clear entry)
  const isClearAll = useMemo(() => {
    return displayValue === '0' || waitingForOperand || error !== null;
  }, [displayValue, waitingForOperand, error]);

  return (
    <div className="calculator-wrapper">
      {/* Top utility bar: History toggle, Brand, Theme Switcher */}
      <header className="calculator-header">
        <button
          type="button"
          className={`history-toggle-btn ${isHistoryOpen ? 'active' : ''}`}
          onClick={() => setIsHistoryOpen((prev) => !prev)}
          title="Toggle Calculation History"
          aria-label="Toggle history panel"
        >
          <HistoryIcon size={18} />
          <span className="history-btn-label">History</span>
          {history.length > 0 && (
            <span className="history-badge-dot" />
          )}
        </button>

        <div className="calculator-brand">
          <span className="brand-dot" />
          <span className="brand-title">NeoCalc</span>
        </div>

        <ThemeToggle
          theme={theme}
          onToggle={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
        />
      </header>

      {/* Main Glassmorphic Calculator Container */}
      <main className="calculator-container" role="region" aria-label="Calculator">
        {/* Dynamic Display Component */}
        <Display
          value={displayValue}
          expression={expression}
          error={error}
          isWaitingForOperand={waitingForOperand}
          activeOperator={operator}
        />

        {/* Interactive Button Grid Panel */}
        <ButtonPanel
          onDigit={handleDigit}
          onOperator={handleOperator}
          onDecimal={handleDecimal}
          onClear={handleClear}
          onBackspace={handleBackspace}
          onToggleSign={handleToggleSign}
          onPercentage={handlePercentage}
          onEquals={handleEquals}
          activeOperator={operator}
          isClearAll={isClearAll}
          disabled={error !== null}
        />
      </main>

      {/* Slide-out Calculation History Panel */}
      <HistoryPanel
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClearHistory={handleClearHistory}
        onSelectHistoryItem={handleSelectHistoryItem}
      />
    </div>
  );
};

export default Calculator;
