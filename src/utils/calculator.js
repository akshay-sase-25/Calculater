/**
 * Precision arithmetic helper to avoid floating point issues (e.g., 0.1 + 0.2 = 0.30000000000000004)
 */
export const roundToPrecision = (num, precision = 12) => {
  if (!Number.isFinite(num)) return num;
  return parseFloat(Number(num).toPrecision(precision));
};

/**
 * Standard calculation engine
 */
export const calculate = (prev, current, operator) => {
  const a = parseFloat(prev);
  const b = parseFloat(current);

  if (Number.isNaN(a) || Number.isNaN(b)) {
    return { error: 'Invalid calculation' };
  }

  let result;
  switch (operator) {
    case '+':
      result = a + b;
      break;
    case '-':
    case '−':
      result = a - b;
      break;
    case '*':
    case '×':
      result = a * b;
      break;
    case '/':
    case '÷':
      if (b === 0) {
        return { error: 'Cannot divide by 0' };
      }
      result = a / b;
      break;
    default:
      return { result: b };
  }

  // Handle precision rounding
  result = roundToPrecision(result);

  // Check if result is beyond safe display or finite
  if (!Number.isFinite(result)) {
    return { error: 'Overflow' };
  }

  return { result };
};

/**
 * Format a number or numeric string with localized thousand separators
 * while preserving pending decimal points like "12."
 */
export const formatDisplayNumber = (value) => {
  if (value === null || value === undefined) return '0';
  if (value === 'Error' || typeof value !== 'string') {
    return String(value);
  }

  // Check for scientific notation or error message
  if (value.includes('e') || value.includes('E') || isNaN(Number(value))) {
    return value;
  }

  const parts = value.split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1];

  // Format integer portion with commas
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  if (decimalPart !== undefined) {
    return `${formattedInteger}.${decimalPart}`;
  }

  return formattedInteger;
};

/**
 * Convert standard math operators to user-friendly symbols
 */
export const normalizeOperator = (op) => {
  switch (op) {
    case '/':
      return '÷';
    case '*':
      return '×';
    case '-':
      return '−';
    default:
      return op;
  }
};
