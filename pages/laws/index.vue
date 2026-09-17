<script setup lang="ts">
import { computed, ref } from 'vue'
import lawsData from '~/data/laws.json'
import DataSourceBadge from '~/components/data/SourceBadge.vue'
import DataLastVerified from '~/components/data/LastVerified.vue'
import { toSourceReference } from '~/utils/source'
import { LAW_TYPE_LABEL, LAW_TYPE_PLURAL, LAW_TYPE_BADGE } from '~/utils/law'
import { buildSeoHead } from '~/utils/seo'
import type { Law } from '~/types/civic'

// Auto-imports are Nuxt-only; the guard keeps this page mountable under plain Vitest.
if (typeof useHead === 'function') {
  useHead(buildSeoHead({
    title: 'Laws & Ordinances · Better Santa Rosa City',
    description: 'Ordinances, resolutions and executive orders of Santa Rosa City, Laguna, searchable by keyword, type and year, each linked to its cited source document.',
    path: '/laws'
  }))
}

const laws = lawsData as Law[]

const LAW_TYPES = Object.keys(LAW_TYPE_LABEL) as Law['type'][]

// Bonus: ?type=<type> deep-links a preselected filter (e.g. from a detail page).
const queryType = typeof useRoute === 'function' ? useRoute().query.type : null
const initialType: Law['type'] | '' =
  typeof queryType === 'string' && (LAW_TYPES as string[]).includes(queryType)
    ? (queryType as Law['type'])
    : ''

const keyword = ref('')
const selectedType = ref<Law['type'] | ''>(initialType)
const selectedYear = ref('')

// Dates have mixed granularity ("2018" vs "2018-08-13"); the year is the first
// 4-digit run wherever it appears.
function lawYear(date: string): string | null {
  return date.match(/\d{4}/)?.[0] ?? null
}

const yearOptions = [...new Set(
  laws.map(l => lawYear(l.date)).filter((y): y is string => y != null)
)].sort((a, b) => b.localeCompare(a))

// Year-only dates sort at Jan 1 of that year — ordering aid only, never displayed.
function lawTimestamp(date: string): number {
  const t = Date.parse(date.length === 4 ? `${date}-01-01` : date)
  return Number.isNaN(t) ? 0 : t
}

const sortedLaws = [...laws].sort((a, b) => lawTimestamp(b.date) - lawTimestamp(a.date))

const filteredLaws = computed(() => {
  const needle = keyword.value.trim().toLowerCase()
  return sortedLaws.filter(l =>
    (selectedType.value === '' || l.type === selectedType.value) &&
    (selectedYear.value === '' || lawYear(l.date) === selectedYear.value) &&
    (needle === '' || `${l.title} ${l.number} ${l.summary}`.toLowerCase().includes(needle))
  )
})

const hasActiveFilters = computed(() =>
  keyword.value.trim() !== '' || selectedType.value !== '' || selectedYear.value !== ''
)

function clearFilters() {
  keyword.value = ''
  selectedType.value = ''
  selectedYear.value = ''
}

function sourceTitle(law: Law): string {
  return toSourceReference(law.source).title
}

const lastVerified = laws.map(l => l.lastVerified).sort().at(-1)
</script>

<template>
  <div data-pagefind-filter="type:laws" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-12">
    <header class="max-w-3xl space-y-3">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-rose-accent-dark">
        Santa Rosa City, Laguna
      </p>
      <h1 class="font-serif text-3xl font-bold tracking-tight text-laguna-green sm:text-4xl">
        Laws &amp; Ordinances
      </h1>
      <div class="flex flex-wrap items-center gap-2">
        <DataSourceBadge type="secondary" />
      </div>
      <p class="text-sm leading-relaxed text-charcoal/70 sm:text-base">
        Ordinances, resolutions and executive orders of the City of Santa Rosa,
        each traced to a cited document copy. Summaries are neutral Better Santa
        Rosa summaries. Always check the linked document for the official text.
      </p>
      <DataLastVerified v-if="lastVerified" :date="lastVerified" :show-state="false" />
    </header>

    <!-- Filter bar — client-side over the embedded dataset -->
    <section aria-labelledby="filters-heading">
      <h2 id="filters-heading" class="font-serif text-2xl font-bold tracking-tight text-laguna-green">
        Search &amp; filter
      </h2>
      <form class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" @submit.prevent>
        <div>
          <label for="filter-keyword" class="text-xs font-semibold uppercase tracking-wide text-charcoal/70">
            Keyword or number
          </label>
          <input
            id="filter-keyword"
            v-model="keyword"
            type="search"
            autocomplete="off"
            placeholder="e.g. zoning, 2112, heritage…"
            class="mt-1 w-full rounded-md border border-charcoal/20 bg-white py-2 px-3 text-sm text-charcoal placeholder:text-charcoal/70 focus:border-laguna-green focus:outline-none focus:ring-2 focus:ring-laguna-green/30"
          />
        </div>
        <div>
          <label for="filter-type" class="text-xs font-semibold uppercase tracking-wide text-charcoal/70">
            Type
          </label>
          <select
            id="filter-type"
            v-model="selectedType"
            class="mt-1 w-full rounded-md border border-charcoal/20 bg-white py-2 px-3 text-sm text-charcoal focus:border-laguna-green focus:outline-none focus:ring-2 focus:ring-laguna-green/30"
          >
            <option value="">All types</option>
            <option v-for="t in LAW_TYPES" :key="t" :value="t">{{ LAW_TYPE_PLURAL[t] }}</option>
          </select>
        </div>
        <div>
          <label for="filter-year" class="text-xs font-semibold uppercase tracking-wide text-charcoal/70">
            Year
          </label>
          <select
            id="filter-year"
            v-model="selectedYear"
            class="mt-1 w-full rounded-md border border-charcoal/20 bg-white py-2 px-3 text-sm text-charcoal focus:border-laguna-green focus:outline-none focus:ring-2 focus:ring-laguna-green/30"
          >
            <option value="">All years</option>
            <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>
      </form>
    </section>

    <!-- Results -->
    <section aria-labelledby="results-heading">
      <div class="flex flex-wrap items-baseline justify-between gap-2 border-b border-charcoal/10 pb-2">
        <h2 id="results-heading" class="font-serif text-2xl font-bold tracking-tight text-laguna-green">
          Measures
        </h2>
        <span class="text-xs font-medium text-charcoal/70" role="status" aria-live="polite">
          {{ filteredLaws.length }} of {{ laws.length }} measure{{ laws.length === 1 ? '' : 's' }}
        </span>
      </div>

      <ul v-if="filteredLaws.length" class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="law in filteredLaws" :key="law.id">
          <!-- id=law.id is a forward contract: /laws#<id> anchors from search and
               external links resolve to this card. scroll-mt keeps it clear of
               the sticky header. -->
          <article
            :id="law.id"
            class="relative flex h-full flex-col rounded-lg border border-charcoal/10 bg-white p-5 shadow-sm scroll-mt-24 transition hover:border-laguna-green/40"
          >
            <div class="flex flex-wrap items-center gap-2">
              <span
                class="inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                :class="LAW_TYPE_BADGE[law.type]"
              >{{ LAW_TYPE_LABEL[law.type] }} No. {{ law.number }}</span>
              <!-- Dates render exactly as recorded — year-only values stay year-only -->
              <time :datetime="law.date" class="text-[11px] text-charcoal/80">{{ law.date }}</time>
            </div>

            <h3 class="mt-3 font-serif text-lg font-bold leading-snug text-charcoal">
              <NuxtLink
                :to="`/laws/${law.id}`"
                class="rounded-sm transition after:absolute after:inset-0 after:content-[''] hover:text-laguna-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
              >{{ law.title }}</NuxtLink>
            </h3>

            <p class="mt-3 text-sm leading-relaxed text-charcoal/70 line-clamp-3">{{ law.summary }}</p>

            <div class="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4 text-[11px] text-charcoal/80">
              <span>Source: {{ sourceTitle(law) }}</span>
              <span class="font-semibold text-laguna-green" aria-hidden="true">View measure →</span>
            </div>
          </article>
        </li>
      </ul>
      <div
        v-else
        class="mt-6 rounded-md border border-charcoal/10 bg-white p-6 text-center text-sm text-charcoal/70"
      >
        <p>No measures match the selected filters.</p>
        <button
          v-if="hasActiveFilters"
          type="button"
          class="mt-3 rounded-sm text-sm font-semibold text-laguna-green underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
          @click="clearFilters"
        >
          Clear filters
        </button>
      </div>
    </section>

    <p class="text-xs text-charcoal/70">
      This directory lists selected issuances verified against the cited sources.
      It is not a complete record of all city legislation.
    </p>
  </div>
</template>
