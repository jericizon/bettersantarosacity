<script setup lang="ts">
import { computed, ref } from 'vue'
import budgetsData from '~/data/budgets.json'
import MoneyBudgetChart from '~/components/money/BudgetChart.vue'
import DataSourceBadge from '~/components/data/SourceBadge.vue'
import DataSourceCitation from '~/components/data/SourceCitation.vue'
import DataLastVerified from '~/components/data/LastVerified.vue'
import { toSourceReference } from '~/utils/source'
import { formatPeso, formatPesoFull } from '~/utils/currency'
import { buildSeoHead } from '~/utils/seo'
import type { Budget } from '~/types/civic'

// Auto-imports are Nuxt-only; the guard keeps this page mountable under plain Vitest.
if (typeof useHead === 'function') {
  useHead(buildSeoHead({
    title: 'Annual Budget Breakdown — Better Santa Rosa City',
    description: 'Fiscal-year breakdown of Santa Rosa City\'s verified revenue records from COA audit reports and BLGF statements, with source documents and methodology notes.',
    path: '/money/budget'
  }))
}

// budgets.json holds verified COA/BLGF revenue figures, not appropriations —
// surfaced to readers as "Verified city revenue", never as total budget.
const budgets = [...(budgetsData as Budget[])].sort((a, b) => b.fiscalYear - a.fiscalYear)
const selectedYear = ref<number | undefined>(budgets.at(0)?.fiscalYear)

const selectedBudget = computed<Budget | undefined>(() =>
  budgets.find(b => b.fiscalYear === selectedYear.value) ?? budgets.at(0)
)
const selectedSource = computed(() =>
  selectedBudget.value ? toSourceReference(selectedBudget.value.source) : undefined
)
// Document URL falls back to the first URL embedded in the source string.
const selectedDocUrl = computed(() =>
  selectedBudget.value?.documentUrl ?? selectedSource.value?.url
)

const lastVerified = budgets.map(b => b.lastVerified).sort().at(-1)
</script>

<template>
  <div data-pagefind-filter="type:budget" class="flex flex-col gap-12">
    <header class="max-w-3xl space-y-3">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-rose-accent-dark">
        City Finances · Santa Rosa City, Laguna
      </p>
      <h1 class="font-serif text-3xl font-bold tracking-tight text-laguna-green sm:text-4xl">
        Annual Budget Breakdown
      </h1>
      <div class="flex flex-wrap items-center gap-2">
        <DataSourceBadge type="official" />
      </div>
      <p class="text-sm leading-relaxed text-charcoal/70 sm:text-base">
        Verified revenue figures by fiscal year, drawn from Commission on Audit
        reports and Bureau of Local Government Finance statements. Appropriation-level
        spending detail was unavailable in the sources reviewed — figures below are
        labeled as the revenue totals they are.
      </p>
      <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
        <DataLastVerified v-if="lastVerified" :date="lastVerified" :show-state="false" />
        <NuxtLink
          to="/money"
          class="rounded-sm text-sm font-semibold text-laguna-green underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
        >
          ← City finances overview
        </NuxtLink>
      </div>
    </header>

    <!-- Fiscal-year explorer -->
    <section aria-labelledby="explorer-heading">
      <div class="flex flex-wrap items-end justify-between gap-4 border-b border-charcoal/10 pb-2">
        <h2 id="explorer-heading" class="font-serif text-2xl font-bold tracking-tight text-laguna-green">
          Fiscal-Year Record
        </h2>
        <div v-if="budgets.length > 1" class="flex items-center gap-2">
          <label for="budget-fy-select" class="text-sm font-medium text-charcoal/70">
            Fiscal year
          </label>
          <select
            id="budget-fy-select"
            v-model.number="selectedYear"
            class="rounded-md border border-charcoal/20 bg-white py-1.5 px-2 text-sm text-charcoal focus:border-laguna-green focus:outline-none focus:ring-2 focus:ring-laguna-green/30"
          >
            <option v-for="b in budgets" :key="b.fiscalYear" :value="b.fiscalYear">
              FY {{ b.fiscalYear }}
            </option>
          </select>
        </div>
      </div>

      <div v-if="selectedBudget" aria-live="polite" class="mt-6 space-y-6">
        <div class="rounded-xl border border-charcoal/10 bg-white p-6 shadow-sm">
          <p class="text-xs font-semibold uppercase tracking-wider text-charcoal/70">
            FY {{ selectedBudget.fiscalYear }}
          </p>
          <p class="mt-2 font-serif text-4xl font-bold tracking-tight text-laguna-green sm:text-5xl">
            {{ formatPeso(selectedBudget.totalBudgetPhp) }}
          </p>
          <p class="mt-1 text-sm font-medium text-charcoal">
            Verified city revenue (COA/BLGF) — {{ formatPesoFull(selectedBudget.totalBudgetPhp) }}
          </p>
        </div>

        <MoneyBudgetChart
          :categories="selectedBudget.categories"
          :fiscal-year="selectedBudget.fiscalYear"
        />

        <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-charcoal/70">
          <DataSourceCitation
            v-if="selectedSource"
            :source="selectedSource"
            :verified-date="selectedBudget.lastVerified"
          />
          <a
            v-if="selectedDocUrl"
            :href="selectedDocUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="font-medium text-rose-accent-dark hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green rounded-sm"
          >View source document ↗</a>
          <DataLastVerified :date="selectedBudget.lastVerified" />
        </div>
      </div>
    </section>

    <!-- Methodology & coverage -->
    <section
      aria-labelledby="methodology-heading"
      class="rounded-xl border border-heritage-gold/30 bg-heritage-gold/10 p-6"
    >
      <h2 id="methodology-heading" class="font-serif text-xl font-bold tracking-tight text-charcoal">
        Methodology &amp; coverage
      </h2>
      <div class="mt-3 max-w-3xl space-y-3 text-sm leading-relaxed text-charcoal/75">
        <p>
          Figures are verified city revenue — income reported in COA Annual Audit
          Reports and BLGF statements — not appropriation budgets. No authoritative
          line-item spending breakdown was available in the sources reviewed, so the
          category rows above reproduce each record's source-labeled revenue line
          verbatim rather than a constructed expenditure split.
        </p>
        <p>
          Coverage reflects selected publicly available records and is not
          necessarily complete; gaps between fiscal years simply mark years without
          a verified figure in our sources. Records are presented without political
          characterization — spending is not labeled wasteful, corrupt, or
          suspicious, and only what the cited documents support is shown.
        </p>
      </div>
    </section>
  </div>
</template>
