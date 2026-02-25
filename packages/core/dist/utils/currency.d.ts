/**
 * Convert an amount in cents to the display amount (e.g. dollars).
 * Example: 1550 → 15.5
 */
export declare function centsToAmount(cents: number): number;
/**
 * Convert a display amount (e.g. dollars) to cents.
 * Rounds to the nearest integer to avoid floating-point issues.
 * Example: 15.5 → 1550
 */
export declare function amountToCents(amount: number): number;
/**
 * Format a value in cents as a currency string.
 * Example: formatCurrencyFromCents(1550, 'USD') → '$15.50'
 */
export declare function formatCurrencyFromCents(cents: number, currency?: string): string;
//# sourceMappingURL=currency.d.ts.map