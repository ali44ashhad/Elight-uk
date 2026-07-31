/** Parse a money input into a whole-pound integer, or null if empty/invalid.
 * @param {string | number | null | undefined} value
 * @returns {number | null}
 */
export function parseMoneyInput(value) {
  if (value == null || value === '') return null
  const cleaned = String(value).replace(/[^0-9.-]/g, '').trim()
  if (!cleaned) return null
  const n = Number(cleaned)
  if (!Number.isFinite(n)) return null
  return Math.round(n)
}

/** Format GBP whole pounds without float / locale rounding surprises.
 * @param {string | number | null | undefined} n
 * @returns {string}
 */
export function formatMoney(n) {
  if (n == null || n === '') return '—'
  const amount = Math.round(Number(n))
  if (!Number.isFinite(amount)) return '—'
  try {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  } catch {
    return `£${amount.toLocaleString('en-GB')}`
  }
}
