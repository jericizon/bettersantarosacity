<script setup lang="ts">
import cityData from '~/data/city.json'
import barangaysData from '~/data/barangays.json'
import budgetsData from '~/data/budgets.json'
import projectsData from '~/data/projects.json'
import lawsData from '~/data/laws.json'
import servicesData from '~/data/services.json'
import officialsData from '~/data/officials.json'
import departmentsData from '~/data/departments.json'

// A dataset is only as current as its stalest record.
function oldestVerified(dates: (string | null | undefined)[]): string | null {
  const valid = dates.filter((d): d is string => !!d && !Number.isNaN(Date.parse(d)))
  if (!valid.length) return null
  return valid.reduce((oldest, d) => (Date.parse(d) < Date.parse(oldest) ? d : oldest))
}

const datasets = [
  { name: 'City profile & history', date: cityData.lastVerified },
  { name: 'Barangays', date: oldestVerified(barangaysData.map(b => b.lastVerified)) },
  { name: 'City finances (budgets)', date: oldestVerified(budgetsData.map(b => b.lastVerified)) },
  { name: 'Projects', date: oldestVerified(projectsData.map(p => p.lastVerified)) },
  { name: 'Laws & decisions', date: oldestVerified(lawsData.map(l => l.lastVerified)) },
  { name: 'Services directory', date: oldestVerified(servicesData.map(s => s.lastVerified)) },
  {
    name: 'Officials & departments',
    date: oldestVerified([
      ...officialsData.map(o => o.lastVerified),
      ...departmentsData.map(d => d.lastVerified)
    ])
  }
]

// Same thresholds and palette as components/data/LastVerified.vue.
type FreshnessState = 'fresh' | 'needs-review' | 'outdated' | 'unknown'

const FRESH_DAYS = 90
const OUTDATED_DAYS = 365

function stateFor(date: string | null): FreshnessState {
  if (!date) return 'unknown'
  const ts = Date.parse(date)
  if (Number.isNaN(ts)) return 'unknown'
  const ageDays = (Date.now() - ts) / 86_400_000
  if (ageDays > OUTDATED_DAYS) return 'outdated'
  if (ageDays > FRESH_DAYS) return 'needs-review'
  return 'fresh'
}

const stateLabel: Record<FreshnessState, string> = {
  'fresh': 'Fresh',
  'needs-review': 'Needs review',
  'outdated': 'Outdated',
  'unknown': 'Unknown'
}

const stateClasses: Record<FreshnessState, string> = {
  'fresh': 'bg-laguna-green/10 text-laguna-green border-laguna-green/20',
  'needs-review': 'bg-heritage-gold/20 text-charcoal border-heritage-gold/30',
  'outdated': 'bg-rose-accent/15 text-rose-accent border-rose-accent/30',
  'unknown': 'bg-charcoal/10 text-charcoal/70 border-charcoal/20'
}
</script>

<template>
  <dl class="divide-y divide-charcoal/10 rounded-lg border border-charcoal/10 bg-white shadow-sm">
    <div
      v-for="d in datasets"
      :key="d.name"
      class="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-3"
    >
      <dt class="text-sm font-medium text-charcoal">{{ d.name }}</dt>
      <dd class="flex items-center gap-2 text-xs text-charcoal/70">
        <span>
          Last checked
          <time v-if="d.date" :datetime="d.date" class="font-medium text-charcoal">{{ d.date }}</time>
          <span v-else class="font-medium text-charcoal/60">unknown</span>
        </span>
        <span
          class="inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-medium"
          :class="stateClasses[stateFor(d.date)]"
        >
          <span class="inline-block h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
          {{ stateLabel[stateFor(d.date)] }}
        </span>
      </dd>
    </div>
  </dl>
</template>
