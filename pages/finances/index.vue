<script setup lang="ts">
import budgetsData from '~/data/budgets.json'
import MoneyBudgetChart from '~/components/money/BudgetChart.vue'
import DataSourceBadge from '~/components/data/SourceBadge.vue'
import DataLastVerified from '~/components/data/LastVerified.vue'
import { toSourceReference } from '~/utils/source'
import { formatPeso, formatPesoFull } from '~/utils/currency'
import { buildSeoHead } from '~/utils/seo'
import type { Budget } from '~/types/civic'

if (typeof useHead === 'function') {
  useHead(buildSeoHead({
    title: 'City Finances · Better Santa Rosa City',
    description: 'Verified revenue and fiscal records of Santa Rosa City, Laguna, sourced from COA audit reports and BLGF statements.',
    path: '/finances'
  }))
}

const budgets = [...(budgetsData as Budget[])].sort((a, b) => b.fiscalYear - a.fiscalYear)
const latestBudget = budgets.at(0)
const lastVerified = budgets.map(b => b.lastVerified).sort().at(-1)

// BudgetChart renders a per-year trend from `years`: one entry per verified record.
const revenueYears = budgets.map(b => ({ fiscalYear: b.fiscalYear, amountPhp: b.totalBudgetPhp }))

// Chart caption lists the covered fiscal years, derived low → high.
const coveredFiscalYears = budgets
  .map(b => `FY${b.fiscalYear}`)
  .sort()
  .join(', ')

function sourceDocUrl(budget: Budget): string | undefined {
  return budget.documentUrl ?? toSourceReference(budget.source).url
}
</script>

<template>
  <div data-pagefind-filter="type:budget" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-12">
    <header class="max-w-3xl space-y-3">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-rose-accent-dark">
        Santa Rosa City, Laguna
      </p>
      <h1 class="font-serif text-3xl font-bold tracking-tight text-laguna-green sm:text-4xl">
        City Finances
      </h1>
      <div class="flex flex-wrap items-center gap-2">
        <DataSourceBadge type="official" organization="COA / BLGF" />
      </div>
      <p class="text-sm leading-relaxed text-charcoal/70 sm:text-base">
        What the city earns and what public records say about municipal income.
        Every figure below is a <span class="font-medium">verified revenue total</span>
        drawn from Commission on Audit reports and BLGF statements.
      </p>

      <!-- Crucial Disclaimer -->
      <div class="p-4 rounded-lg bg-parchment border border-charcoal/10 text-xs text-charcoal/80 space-y-1">
        <p class="font-bold text-laguna-green">Fiscal Definition Note:</p>
        <p>Revenue is not the same as the city's appropriation budget or total expenditure. Revenue represents actual municipal receipts from local taxes, fees, and national tax allotments.</p>
      </div>

      <DataLastVerified v-if="lastVerified" :date="lastVerified" :show-state="false" />
    </header>

    <!-- Latest verified revenue hero -->
    <section v-if="latestBudget" aria-labelledby="latest-revenue-heading" class="rounded-xl border border-charcoal/10 bg-white p-6 sm:p-8 shadow-sm space-y-4">
      <p id="latest-revenue-heading" class="text-xs font-bold uppercase tracking-wider text-rose-accent-dark">
        FY{{ latestBudget.fiscalYear }} Verified City Revenue
      </p>
      <div class="flex flex-wrap items-baseline gap-3">
        <span class="font-serif text-4xl sm:text-5xl font-bold text-laguna-green">
          {{ formatPeso(latestBudget.totalBudgetPhp) }}
        </span>
        <span class="font-mono text-xs sm:text-sm text-charcoal/60">
          ({{ formatPesoFull(latestBudget.totalBudgetPhp) }})
        </span>
      </div>
      <p class="text-xs sm:text-sm text-charcoal/70 max-w-2xl">
        {{ latestBudget.categories[0]?.name }}
      </p>
      <div class="pt-2">
        <DataSourceBadge type="primary" :organization="toSourceReference(latestBudget.source).title" :url="sourceDocUrl(latestBudget)" />
      </div>
    </section>

    <!-- Bar Chart for Revenue Growth -->
    <section aria-labelledby="revenue-trends-heading" class="rounded-xl border border-charcoal/10 bg-white p-6 sm:p-8 shadow-sm space-y-6">
      <div class="space-y-1">
        <h2 id="revenue-trends-heading" class="font-serif text-2xl font-bold text-charcoal">Historical Revenue Trends</h2>
        <p class="text-xs sm:text-sm text-charcoal/60">
          Verified annual revenue milestones ({{ coveredFiscalYears }}). Plotted as distinct years.
        </p>
      </div>
      <MoneyBudgetChart :years="revenueYears" />
    </section>

    <!-- All verified records table -->
    <section aria-labelledby="all-records-heading" class="space-y-4">
      <h2 id="all-records-heading" class="font-serif text-2xl font-bold text-charcoal">All Verified Annual Records</h2>
      <div class="overflow-x-auto rounded-lg border border-charcoal/10 bg-white shadow-sm">
        <table class="min-w-full divide-y divide-charcoal/10 text-left text-sm">
          <thead class="bg-parchment/60 font-semibold text-charcoal">
            <tr>
              <th scope="col" class="px-4 py-3">Fiscal Year</th>
              <th scope="col" class="px-4 py-3">Verified Revenue</th>
              <th scope="col" class="px-4 py-3">Source & Verification</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-charcoal/10">
            <tr v-for="b in budgets" :key="b.fiscalYear" class="hover:bg-charcoal/5">
              <td class="px-4 py-3 font-mono font-bold text-laguna-green">FY{{ b.fiscalYear }}</td>
              <td class="px-4 py-3 font-mono font-semibold">{{ formatPeso(b.totalBudgetPhp) }}</td>
              <td class="px-4 py-3 text-xs text-charcoal/70">
                <DataSourceBadge type="primary" :organization="toSourceReference(b.source).title" :date="b.lastVerified" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
