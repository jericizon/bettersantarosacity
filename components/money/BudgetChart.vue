<script setup lang="ts">
import { ref, useId } from 'vue'
import type { BudgetCategory } from '~/types/civic'
import { useScrollReveal } from '~/composables/useScrollReveal'
import { formatPeso, formatPesoFull } from '~/utils/currency'

const props = withDefaults(defineProps<{
  categories: BudgetCategory[]
  fiscalYear?: number
}>(), {
  fiscalYear: undefined
})

const captionId = `budget-chart-${useId()}`

// Bars grow from zero once the chart scrolls into view (Spec §12). Reduced
// motion and browsers without IntersectionObserver jump to final values.
const barsRef = ref<HTMLElement | null>(null)
const { isVisible: barsVisible } = useScrollReveal(barsRef, { threshold: 0.2 })

const caption = props.fiscalYear != null
  ? `FY ${props.fiscalYear} — verified revenue by category`
  : 'Verified revenue by category'

function clampShare(percentage: number): number {
  return Math.min(100, Math.max(0, percentage))
}

// Percentages come from the dataset; trim long floats without hiding precision.
function formatShare(percentage: number): string {
  return Number.isInteger(percentage) ? `${percentage}%` : `${percentage.toFixed(1)}%`
}
</script>

<template>
  <figure :aria-labelledby="captionId" class="rounded-xl border border-charcoal/10 bg-white p-6 shadow-sm">
    <figcaption :id="captionId" class="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/70">
      {{ caption }}
    </figcaption>

    <!-- Visual bars are decorative — the table below is the textual equivalent. -->
    <ul ref="barsRef" aria-hidden="true" class="mt-5 space-y-4">
      <li v-for="(c, i) in categories" :key="c.name">
        <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <span class="text-sm font-medium text-charcoal">{{ c.name }}</span>
          <span class="text-sm font-semibold tabular-nums text-laguna-green">
            {{ formatPeso(c.amountPhp) }} · {{ formatShare(c.percentage) }}
          </span>
        </div>
        <div class="mt-1.5 h-3 w-full rounded-full bg-charcoal/10">
          <div
            class="h-3 rounded-full bg-laguna-green transition-all duration-700 ease-out motion-reduce:transition-none"
            :style="{
              width: barsVisible ? `${clampShare(c.percentage)}%` : '0%',
              transitionDelay: `${i * 75}ms`
            }"
          ></div>
        </div>
      </li>
    </ul>

    <table class="mt-5 w-full border-t border-charcoal/10 text-left text-sm">
      <caption class="sr-only">
        Textual summary of the chart above — each category with its amount in Philippine pesos and percentage share.
      </caption>
      <thead>
        <tr class="border-b border-charcoal/10 text-xs uppercase tracking-wide text-charcoal/70">
          <th scope="col" class="py-2 pr-3 font-semibold">Category</th>
          <th scope="col" class="py-2 pr-3 font-semibold">Amount (PHP)</th>
          <th scope="col" class="py-2 font-semibold">Percentage</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in categories" :key="`table-${c.name}`" class="border-b border-charcoal/5 align-top">
          <td class="py-2 pr-3 text-charcoal/80">{{ c.name }}</td>
          <td class="py-2 pr-3 font-medium whitespace-nowrap tabular-nums text-charcoal">
            <span :title="formatPesoFull(c.amountPhp)">{{ formatPeso(c.amountPhp) }}</span>
            <span class="block text-xs font-normal text-charcoal/70">{{ formatPesoFull(c.amountPhp) }}</span>
          </td>
          <td class="py-2 text-charcoal/80">{{ formatShare(c.percentage) }}</td>
        </tr>
      </tbody>
    </table>
  </figure>
</template>
