/**
 * Format a number as Colombian peso: $1.234.000
 */
export function formatCOP(amount: number): string {
  return '$' + Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

/**
 * Live-format a raw digit string as COP while typing.
 * Strips non-digits and applies dot separators.
 * e.g. "1234567" → "1.234.567"
 */
export function formatInputCOP(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (!digits) return ''
  return parseInt(digits, 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

/**
 * Parse a formatted COP input string back to a number.
 * e.g. "1.234.567" → 1234567
 */
export function parseInputCOP(formatted: string): number {
  return parseInt(formatted.replace(/\./g, '') || '0', 10)
}

/**
 * Format a percentage with one decimal: 68%
 */
export function formatPct(value: number): string {
  return Math.round(value) + '%'
}
