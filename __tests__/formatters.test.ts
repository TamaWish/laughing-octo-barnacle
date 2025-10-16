import { formatNumber, formatCurrency } from '../src/utils/formatters';

describe('formatters', () => {
  describe('formatNumber', () => {
    test('formats numbers with commas', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1000000)).toBe('1,000,000');
      expect(formatNumber(1234567)).toBe('1,234,567');
    });

    test('handles small numbers without commas', () => {
      expect(formatNumber(100)).toBe('100');
      expect(formatNumber(999)).toBe('999');
      expect(formatNumber(0)).toBe('0');
    });

    test('handles negative numbers', () => {
      expect(formatNumber(-1000)).toBe('-1,000');
      expect(formatNumber(-1234567)).toBe('-1,234,567');
    });
  });

  describe('formatCurrency', () => {
    test('formats currency with dollar sign and commas', () => {
      expect(formatCurrency(1000)).toBe('$1,000');
      expect(formatCurrency(1000000)).toBe('$1,000,000');
      expect(formatCurrency(1234567)).toBe('$1,234,567');
    });

    test('handles small amounts', () => {
      expect(formatCurrency(100)).toBe('$100');
      expect(formatCurrency(0)).toBe('$0');
    });

    test('handles negative amounts', () => {
      expect(formatCurrency(-1000)).toBe('$-1,000');
    });
  });
});