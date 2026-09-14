// Peso formatting for financial figures. Abbreviated values (₱6.251B) must
// always be paired with the exact figure — title attribute or adjacent text —
// so the full value is never silently rounded away.
const exactPeso = new Intl.NumberFormat('en-PH', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2
})

export function formatPeso(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `₱${(amount / 1_000_000_000).toFixed(3).replace(/\.?0+$/, '')}B`
  }
  if (amount >= 1_000_000) {
    return `₱${(amount / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  }
  return `₱${exactPeso.format(amount)}`
}

export function formatPesoFull(amount: number): string {
  return `₱${exactPeso.format(amount)}`
}
