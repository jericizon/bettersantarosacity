<script setup lang="ts">
import { computed } from 'vue'
import {
  freshnessState,
  FRESH_DAYS,
  OUTDATED_DAYS,
  FRESHNESS_CLASSES as stateClasses,
  FRESHNESS_LABELS as stateLabel
} from '~/utils/freshness'

const props = withDefaults(defineProps<{
  date?: string | null
  showState?: boolean
  freshDays?: number
  outdatedDays?: number
}>(), {
  date: null,
  showState: true,
  freshDays: FRESH_DAYS,
  outdatedDays: OUTDATED_DAYS
})

const state = computed(() => freshnessState(props.date, props.freshDays, props.outdatedDays))
</script>

<template>
  <span class="inline-flex items-center gap-1.5 text-xs text-charcoal/70">
    <span>
      Last verified
      <time v-if="date" :datetime="date" class="font-medium text-charcoal">{{ date }}</time>
      <span v-else class="font-medium text-charcoal/70">unknown</span>
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
