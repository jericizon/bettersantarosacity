<script setup lang="ts">
import budgetsData from '~/data/budgets.json'
import MoneyBudgetChart from '~/components/money/BudgetChart.vue'
import DataSourceBadge from '~/components/data/SourceBadge.vue'
import DataSourceCitation from '~/components/data/SourceCitation.vue'
import DataLastVerified from '~/components/data/LastVerified.vue'
import { toSourceReference } from '~/utils/source'
import { formatPeso, formatPesoFull } from '~/utils/currency'
import type { Budget } from '~/types/civic'

// Auto-imports are Nuxt-only; the guard keeps this page mountable under plain Vitest.
if (typeof useHead === 'function') {
  useHead({
    title: 'City Finances — Better Santa Rosa City',
    meta: [
      {
        name: 'description',
        content: 'Verified revenue and budget records of Santa Rosa City, Laguna — sourced from COA audit reports and BLGF statements, with coverage limits stated plainly.'
      }
    ]
  })
}

// budgets.json holds verified COA/BLGF revenue figures, not appropriations —
// surfaced to readers as "Verified city revenue", never as total budget.
const budgets = [...(budgetsData as Budget[])].sort((a, b) => b.fiscalYear - a.fiscalYear)
const latestBudget = budgets.at(0)
const earlierBudgets = budgets.slice(1)
const lastVerified = budgets.map(b => b.lastVerified).sort().at(-1)

// Each year's document URL falls back to the first URL embedded in the source string.
function sourceDocUrl(budget: Budget): string | undefined {
  return budget.documentUrl ?? toSourceReference(budget.source).url
}

const budgetSources = budgets.map(b => ({
  fiscalYear: b.fiscalYear,
  reference: toSourceReference(b.source),
  lastVerified: b.lastVerified
}))
</script>

<template>
  <div data-pagefind-filter="type:budget" class="flex flex-col gap-12">
    <header class="max-w-3xl space-y-3">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-rose-accent">
        Santa Rosa City, Laguna
      </p>
      <h1 class="font-serif text-3xl font-bold tracking-tight text-laguna-green sm:text-4xl">
        City Finances
      </h1>
      <div class="flex flex-wrap items-center gap-2">
        <DataSourceBadge type="official" />
      </div>
      <p class="text-sm leading-relaxed text-charcoal/70 sm:text-base">
        What the city earns and what public records say about how money moves.
        Every figure below is a <span class="font-medium">verified revenue total</span>
        drawn from audit reports and finance bureau statements — each carries its
        source and verification date.
      </p>
      <DataLastVerified v-if="lastVerified" :date="lastVerified" :show-state="false" />
    </header>

    <!-- Methodology note — prominent because the coverage limit defines the page. -->
    <section
      aria-labelledby="methodology-heading"
      class="rounded-xl border border-heritage-gold/30 bg-heritage-gold/10 p-6"
    >
      <h2 id="methodology-heading" class="font-serif text-xl font-bold tracking-tight text-charcoal">
        How to read these figures
      </h2>
      <div class="mt-3 max-w-3xl space-y-3 text-sm leading-relaxed text-charcoal/75">
        <p>
          The totals on this page are <span class="font-medium">verified city
          revenue</span> — income reported in Commission on Audit (COA) Annual Audit
          Reports and Bureau of Local Government Finance (BLGF) statements. They are
          <span class="font-medium">not appropriation budgets</span>: no authoritative
          line-item spending breakdown was available in the sources reviewed, so none
          is presented here.
        </p>
        <p>
          Figures cover selected publicly available records and are not necessarily
          complete. When a verified appropriation or expenditure dataset becomes
          available it will be added. Records are presented without political
          characterization — only what the cited documents support.
        </p>
      </div>
    </section>

    <!-- Annual Budget & verified revenue -->
    <section aria-labelledby="annual-budget-heading">
      <div class="flex flex-wrap items-end justify-between gap-4 border-b border-charcoal/10 pb-2">
        <div>
          <h2 id="annual-budget-heading" class="font-serif text-2xl font-bold tracking-tight text-laguna-green">
            Annual Budget &amp; Verified Revenue
          </h2>
          <p class="mt-1 text-sm text-charcoal/70">
            The annual figures that could be verified — labeled as the revenue totals they are.
          </p>
        </div>
        <NuxtLink
          to="/money/budget"
          class="rounded-sm text-sm font-semibold text-laguna-green underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
        >
          Fiscal-year breakdown →
        </NuxtLink>
      </div>

      <div v-if="latestBudget" class="mt-6 grid gap-4 lg:grid-cols-3">
        <div class="rounded-xl border border-charcoal/10 bg-white p-6 shadow-sm lg:col-span-2">
          <p class="text-xs font-semibold uppercase tracking-wider text-charcoal/50">
            FY {{ latestBudget.fiscalYear }}
          </p>
          <p class="mt-2 font-serif text-4xl font-bold tracking-tight text-laguna-green sm:text-5xl">
            {{ formatPeso(latestBudget.totalBudgetPhp) }}
          </p>
          <p class="mt-1 text-sm font-medium text-charcoal">
            Verified city revenue (COA/BLGF) — {{ formatPesoFull(latestBudget.totalBudgetPhp) }}
          </p>
          <p class="mt-4 text-sm leading-relaxed text-charcoal/70">
            {{ latestBudget.categories.at(0)?.name }}
          </p>
          <div class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-charcoal/10 pt-3 text-xs text-charcoal/60">
            <a
              v-if="sourceDocUrl(latestBudget)"
              :href="sourceDocUrl(latestBudget)"
              target="_blank"
              rel="noopener noreferrer"
              class="font-medium text-rose-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green rounded-sm"
            >View source document ↗</a>
            <DataLastVerified :date="latestBudget.lastVerified" />
          </div>
        </div>

        <ul class="space-y-3">
          <li
            v-for="b in earlierBudgets"
            :key="b.fiscalYear"
            class="rounded-lg border border-charcoal/10 bg-white p-4 shadow-sm"
          >
            <div class="flex items-baseline justify-between gap-2">
              <p class="text-xs font-semibold uppercase tracking-wider text-charcoal/50">FY {{ b.fiscalYear }}</p>
              <DataLastVerified :date="b.lastVerified" :show-state="false" />
            </div>
            <p class="mt-1 font-serif text-xl font-bold text-laguna-green">
              <span :title="formatPesoFull(b.totalBudgetPhp)">{{ formatPeso(b.totalBudgetPhp) }}</span>
            </p>
            <p class="mt-1 text-[11px] leading-snug text-charcoal/60">
              Verified city revenue (COA/BLGF) — {{ toSourceReference(b.source).title }}
            </p>
          </li>
        </ul>
      </div>
    </section>

    <!-- Expenditure Categories — honest coverage of what the records contain -->
    <section aria-labelledby="categories-heading">
      <h2 id="categories-heading" class="font-serif text-2xl font-bold tracking-tight text-laguna-green">
        Expenditure Categories
      </h2>
      <p class="mt-2 max-w-3xl text-sm leading-relaxed text-charcoal/70">
        Appropriation-level expenditure categories were unavailable in the sources
        reviewed. What can be verified is each fiscal year's total revenue, shown
        below as the single category its source reports.
      </p>
      <MoneyBudgetChart
        v-if="latestBudget"
        :categories="latestBudget.categories"
        :fiscal-year="latestBudget.fiscalYear"
        class="mt-6"
      />
    </section>

    <!-- Sources & verification -->
    <section
      aria-labelledby="money-sources-heading"
      class="rounded-2xl border border-charcoal/10 bg-white p-6 shadow-sm"
    >
      <h2 id="money-sources-heading" class="font-serif text-2xl font-bold tracking-tight text-laguna-green">
        Sources &amp; verification
      </h2>
      <p class="mt-3 max-w-3xl text-sm leading-relaxed text-charcoal/80">
        Each fiscal year above traces to the audit report or finance bureau
        statement named in its record.
      </p>
      <ul class="mt-5 flex flex-wrap gap-2">
        <li v-for="s in budgetSources" :key="s.fiscalYear">
          <DataSourceCitation :source="s.reference" :verified-date="s.lastVerified" />
        </li>
      </ul>
      <div class="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
        <DataLastVerified v-if="lastVerified" :date="lastVerified" />
        <NuxtLink
          to="/sources"
          class="rounded-sm text-sm font-semibold text-laguna-green underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
        >
          See the full source registry →
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
