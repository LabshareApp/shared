/**
 * Convert an amount in cents to the display amount (e.g. dollars).
 * Example: 1550 → 15.5
 */
export function centsToAmount(cents: number): number {
  return cents / 100;
}

/**
 * Convert a display amount (e.g. dollars) to cents.
 * Rounds to the nearest integer to avoid floating-point issues.
 * Example: 15.5 → 1550
 */
export function amountToCents(amount: number): number {
  return Math.round(amount * 100);
}

/**
 * Format a value in cents as a currency string.
 * Example: formatCurrencyFromCents(1550, 'USD') → '$15.50'
 */
export function formatCurrencyFromCents(
  cents: number,
  currency: string = 'USD'
): string {
  const amount = cents / 100;
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    // Fallback if Intl or currency code is unsupported
    return `${currency} ${amount.toFixed(2)}`;
  }
}
