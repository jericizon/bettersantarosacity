<script setup lang="ts">
import { computed } from 'vue'

type FreshnessState = 'fresh' | 'needs-review' | 'outdated' | 'unknown'

const props = withDefaults(defineProps<{
  date?: string | null
  showState?: boolean
  freshDays?: number
  outdatedDays?: number
}>(), {
  date: null,
  showState: true,
  freshDays: 90,
  outdatedDays: 365
})

// Date.parse is used instead of new Date(string) for consistent epoch math
const verifiedAt = computed<number | null>(() => {
  if (!props.date) return null
  const ts = Date.parse(props.date)
  return Number.isNaN(ts) ? null : ts
})

const state = computed<FreshnessState>(() => {
  if (verifiedAt.value === null) return 'unknown'
  const ageDays = (Date.now() - verifiedAt.value) / 86_400_000
  if (ageDays > props.outdatedDays) return 'outdated'
  if (ageDays > props.freshDays) return 'needs-review'
  return 'fresh'
})

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
  <span class="inline-flex items-center gap-1.5 text-xs text-charcoal/70">
    <span>
      Last verified
      <time v-if="date" :datetime="date" class="font-medium text-charcoal">{{ date }}</time>
      <span v-else class="font-medium text-charcoal/60">unknown</span>
    </span>
    <span
      v-if="showState"
      class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] font-medium"
      :class="stateClasses[state]"
    >
      <span class="inline-block w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true"></span>
      {{ stateLabel[state] }}
    </span>
  </span>
</template>
