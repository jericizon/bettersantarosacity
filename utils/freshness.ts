// Shared freshness computation and pill styling for components/data/
// LastVerified.vue and DataFreshness.vue — one threshold set for the site.
export type FreshnessState = 'fresh' | 'needs-review' | 'outdated' | 'unknown'

export const FRESH_DAYS = 90
export const OUTDATED_DAYS = 365

// Date.parse is used instead of new Date(string) for consistent epoch math.
export function freshnessState(
  date: string | null | undefined,
  freshDays: number = FRESH_DAYS,
  outdatedDays: number = OUTDATED_DAYS
): FreshnessState {
  if (!date) return 'unknown'
  const ts = Date.parse(date)
  if (Number.isNaN(ts)) return 'unknown'
  const ageDays = (Date.now() - ts) / 86_400_000
  if (ageDays > outdatedDays) return 'outdated'
  if (ageDays > freshDays) return 'needs-review'
  return 'fresh'
}

export const FRESHNESS_LABELS: Record<FreshnessState, string> = {
  'fresh': 'Fresh',
  'needs-review': 'Needs review',
  'outdated': 'Outdated',
  'unknown': 'Unknown'
}

export const FRESHNESS_CLASSES: Record<FreshnessState, string> = {
  'fresh': 'bg-laguna-green/10 text-laguna-green border-laguna-green/20',
  'needs-review': 'bg-heritage-gold/20 text-charcoal border-heritage-gold/30',
  'outdated': 'bg-rose-accent/15 text-rose-accent-dark border-rose-accent/30',
  'unknown': 'bg-charcoal/10 text-charcoal/70 border-charcoal/20'
}
