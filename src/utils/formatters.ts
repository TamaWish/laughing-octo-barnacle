/**
 * Formats a number with commas as thousands separators
 * @param num - The number to format
 * @returns The formatted string (e.g., 1000 -> "1,000")
 */
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Formats a number as currency with dollar sign and commas
 * @param amount - The monetary amount to format
 * @returns The formatted currency string (e.g., 1000 -> "$1,000")
 */
export const formatCurrency = (amount: number): string => {
  return `$${formatNumber(amount)}`;
};