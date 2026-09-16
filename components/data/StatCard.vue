<script setup lang="ts">
import CountUp from '~/components/civic/CountUp.vue'

withDefaults(defineProps<{
  value: string | number
  label: string
  source?: string
  note?: string
  numericValue?: number
  suffix?: string
  variant?: 'card' | 'open'
}>(), {
  variant: 'open'
})
</script>

<template>
  <div
    :class="[
      variant === 'card'
        ? 'rounded-xl border border-charcoal/10 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-laguna-green/30'
        : 'stat-card-open flex flex-col justify-between py-4 pr-4 transition-all duration-300'
    ]"
  >
    <div>
      <p class="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-laguna-green tracking-tight leading-none">
        <CountUp
          v-if="numericValue !== undefined"
          :end="numericValue"
          :suffix="suffix || ''"
        />
        <template v-else>{{ value }}</template>
      </p>
      <p class="mt-3 text-sm sm:text-base font-semibold uppercase tracking-wider text-charcoal/80">
        {{ label }}
      </p>
      <p v-if="note" class="mt-1 text-xs text-charcoal/70">
        {{ note }}
      </p>
    </div>
    <p v-if="source" class="mt-4 border-t border-charcoal/10 pt-2 text-[11px] text-charcoal/70">
      Source: <span class="font-medium">{{ source }}</span>
    </p>
  </div>
</template>
