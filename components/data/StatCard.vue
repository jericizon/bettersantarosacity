<script setup lang="ts">
import CountUp from '~/components/civic/CountUp.vue'

const props = defineProps<{
  value: string | number
  label: string
  source?: string
  note?: string
  numericValue?: number
  suffix?: string
}>()
</script>

<template>
  <div class="rounded-xl border border-charcoal/10 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-laguna-green/30">
    <p class="font-serif text-3xl sm:text-4xl font-bold text-laguna-green tracking-tight">
      <CountUp
        v-if="numericValue !== undefined"
        :end="numericValue"
        :suffix="suffix || ''"
      />
      <template v-else>{{ value }}</template>
    </p>
    <p class="mt-2 text-sm font-semibold uppercase tracking-wider text-charcoal/80">{{ label }}</p>
    <p v-if="note" class="mt-1 text-xs text-charcoal/70">{{ note }}</p>
    <p v-if="source" class="mt-4 border-t border-charcoal/10 pt-2 text-[11px] text-charcoal/75">
      Source: <span class="font-medium">{{ source }}</span>
    </p>
  </div>
</template>
