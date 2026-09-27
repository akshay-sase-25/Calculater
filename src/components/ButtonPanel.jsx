import React from 'react';
import { Delete } from 'lucide-react';
import Button from './Button';

/**
 * ButtonPanel renders the clean grid layout for numbers, operators, and action controls.
 */
const ButtonPanel = ({
  onDigit,
  onOperator,
  onDecimal,
  onClear,
  onBackspace,
  onToggleSign,
  onPercentage,
  onEquals,
  activeOperator,
  isClearAll = true,
  disabled = false,
}) => {
  return (
    <div className="calc-button-panel">
      {/* Row 1: Clear, Backspace, Percentage, Division */}
      <Button
        id="btn-clear"
        label={isClearAll ? 'AC' : 'C'}
        type="action"
        onClick={onClear}
        keyboardHint="Esc"
        ariaLabel={isClearAll ? 'All Clear' : 'Clear entry'}
      />
      <Button
        id="btn-backspace"
        label="⌫"
        icon={<Delete size={20} />}
        type="action"
        onClick={onBackspace}
        keyboardHint="⌫"
        ariaLabel="Delete last digit"
        disabled={disabled}
      />
      <Button
        id="btn-percent"
        label="%"
        type="action"
        onClick={onPercentage}
        keyboardHint="%"
        ariaLabel="Percentage"
        disabled={disabled}
      />
      <Button
        id="btn-divide"
        label="÷"
        type="operator"
        active={activeOperator === '÷'}
        onClick={() => onOperator('÷')}
        keyboardHint="/"
        ariaLabel="Divide"
      />

      {/* Row 2: 7, 8, 9, Multiplication */}
      <Button
        id="btn-7"
        label="7"
        type="number"
        onClick={() => onDigit('7')}
        keyboardHint="7"
      />
      <Button
        id="btn-8"
        label="8"
        type="number"
        onClick={() => onDigit('8')}
        keyboardHint="8"
      />
      <Button
        id="btn-9"
        label="9"
        type="number"
        onClick={() => onDigit('9')}
        keyboardHint="9"
      />
      <Button
        id="btn-multiply"
        label="×"
        type="operator"
        active={activeOperator === '×'}
        onClick={() => onOperator('×')}
        keyboardHint="*"
        ariaLabel="Multiply"
      />

      {/* Row 3: 4, 5, 6, Subtraction */}
      <Button
        id="btn-4"
        label="4"
        type="number"
        onClick={() => onDigit('4')}
        keyboardHint="4"
      />
      <Button
        id="btn-5"
        label="5"
        type="number"
        onClick={() => onDigit('5')}
        keyboardHint="5"
      />
      <Button
        id="btn-6"
        label="6"
        type="number"
        onClick={() => onDigit('6')}
        keyboardHint="6"
      />
      <Button
        id="btn-subtract"
        label="−"
        type="operator"
        active={activeOperator === '−' || activeOperator === '-'}
        onClick={() => onOperator('−')}
        keyboardHint="-"
        ariaLabel="Subtract"
      />

      {/* Row 4: 1, 2, 3, Addition */}
      <Button
        id="btn-1"
        label="1"
        type="number"
        onClick={() => onDigit('1')}
        keyboardHint="1"
      />
      <Button
        id="btn-2"
        label="2"
        type="number"
        onClick={() => onDigit('2')}
        keyboardHint="2"
      />
      <Button
        id="btn-3"
        label="3"
        type="number"
        onClick={() => onDigit('3')}
        keyboardHint="3"
      />
      <Button
        id="btn-add"
        label="+"
        type="operator"
        active={activeOperator === '+'}
        onClick={() => onOperator('+')}
        keyboardHint="+"
        ariaLabel="Add"
      />

      {/* Row 5: Sign Toggle, 0, Decimal, Equals */}
      <Button
        id="btn-toggle-sign"
        label="±"
        type="number"
        onClick={onToggleSign}
        ariaLabel="Toggle positive or negative sign"
        disabled={disabled}
      />
      <Button
        id="btn-0"
        label="0"
        type="number"
        onClick={() => onDigit('0')}
        keyboardHint="0"
      />
      <Button
        id="btn-decimal"
        label="."
        type="number"
        onClick={onDecimal}
        keyboardHint="."
        ariaLabel="Decimal point"
        disabled={disabled}
      />
      <Button
        id="btn-equals"
        label="="
        type="equals"
        onClick={onEquals}
        keyboardHint="↵"
        ariaLabel="Calculate result"
      />
    </div>
  );
};

export default React.memo(ButtonPanel);
