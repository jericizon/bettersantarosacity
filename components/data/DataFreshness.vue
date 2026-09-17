<script setup lang="ts">
import cityData from '~/data/city.json'
import barangaysData from '~/data/barangays.json'
import budgetsData from '~/data/budgets.json'
import projectsData from '~/data/projects.json'
import lawsData from '~/data/laws.json'
import servicesData from '~/data/services.json'
import officialsData from '~/data/officials.json'
import departmentsData from '~/data/departments.json'
import placesData from '~/data/places.json'
import updatesData from '~/data/updates.json'

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
  },
  { name: 'Places & landmarks', date: oldestVerified(placesData.map(p => p.lastVerified)) },
  { name: 'City updates', date: oldestVerified(updatesData.map(u => u.lastVerified)) }
]

// Thresholds and palette are shared with LastVerified.vue via utils/freshness.
import {
  freshnessState as stateFor,
  FRESHNESS_CLASSES as stateClasses,
  FRESHNESS_LABELS as stateLabel
} from '~/utils/freshness'
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
          Last verified by Better Santa Rosa:
          <time v-if="d.date" :datetime="d.date" class="font-medium text-charcoal">{{ d.date }}</time>
          <span v-else class="font-medium text-charcoal/70">unknown</span>
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
