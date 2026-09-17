<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Search } from 'lucide-vue-next'
import officialsData from '~/data/officials.json'
import departmentsData from '~/data/departments.json'
import barangaysData from '~/data/barangays.json'
import projectsData from '~/data/projects.json'
import lawsData from '~/data/laws.json'
import budgetsData from '~/data/budgets.json'
import servicesData from '~/data/services.json'
import { buildSeoHead } from '~/utils/seo'
import { LAW_TYPE_LABEL } from '~/utils/law'
import type { Law } from '~/types/civic'

// Auto-imports are Nuxt-only; the guard keeps this page mountable under plain Vitest.
if (typeof useHead === 'function') {
  useHead(buildSeoHead({
    title: 'Search · Better Santa Rosa City',
    description: 'Search every dataset and page on Better Santa Rosa City: officials, barangays, projects, laws, budgets, services and public records.',
    path: '/search'
  }))
}

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'officials', label: 'Officials' },
  { id: 'barangays', label: 'Barangays' },
  { id: 'projects', label: 'Projects' },
  { id: 'laws', label: 'Laws' },
  { id: 'budget', label: 'Budget' },
  { id: 'services', label: 'Services' },
  { id: 'pages', label: 'Pages' }
] as const

type CategoryId = (typeof CATEGORIES)[number]['id']
type ResultCategory = Exclude<CategoryId, 'all'>

interface SearchResult {
  url: string
  title: string
  excerptHtml: string
  category: ResultCategory
}

// --- Fallback dataset search (used until the Pagefind index is built) ---

interface FallbackDoc {
  title: string
  description: string
  url: string
  type: ResultCategory
  searchText: string
}

function doc(title: string, description: string, url: string, type: ResultCategory): FallbackDoc {
  return { title, description, url, type, searchText: `${title} ${description}`.toLowerCase() }
}

const fallbackDocs: FallbackDoc[] = [
  ...officialsData.map(o =>
    doc(o.name, `${o.position}, ${o.office}. ${o.bio ?? ''}`, `/government#${o.id}`, 'officials')),
  ...departmentsData.map(d =>
    doc(d.name, d.responsibilities.join('; '), `/government#${d.id}`, 'officials')),
  ...barangaysData.map(b =>
    doc(`Barangay ${b.name}`, `${b.group}. ${b.description}`, `/barangays#${b.slug}`, 'barangays')),
  ...projectsData.map(p =>
    doc(p.name, `${p.category} · ${p.status}. ${p.description} Barangay: ${p.barangay}`, `/projects#${p.slug}`, 'projects')),
  ...(lawsData as Law[]).map(l =>
    doc(`${LAW_TYPE_LABEL[l.type] ?? 'Measure'} No. ${l.number} · ${l.title}`, l.summary, `/laws#${l.id}`, 'laws')),
  ...budgetsData.map(b =>
    doc(
      `Verified city revenue FY ${b.fiscalYear}`,
      `₱${b.totalBudgetPhp.toLocaleString('en-PH')} verified revenue (COA/BLGF). ${b.categories.map(c => c.name).join('; ')}`,
      '/money',
      'budget'
    )),
  ...servicesData.map(s =>
    doc(s.title, `${s.category}. ${s.description}`, `/services#${s.id}`, 'services')),
  doc('Explore Santa Rosa', 'City overview, profile, and civic timeline.', '/explore', 'pages'),
  doc('Money & Budget', 'City budget, revenue, and expenditure records.', '/money', 'pages'),
  doc('Open Data', 'Machine-readable civic datasets.', '/data', 'pages'),
  doc('Sources & Methodology', 'Source register and verification notes.', '/sources', 'pages'),
  doc('Methodology & Standards', 'How records are collected, verified, and corrected.', '/about/methodology', 'pages')
]

const ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, c => ESCAPE_MAP[c] ?? c)
}

// Excerpt window around the first match, escaped, with <mark> highlighting.
function buildExcerpt(text: string, needle: string): string {
  const idx = text.toLowerCase().indexOf(needle.toLowerCase())
  const start = idx === -1 ? 0 : Math.max(0, idx - 60)
  const end = idx === -1 ? Math.min(text.length, 160) : Math.min(text.length, idx + needle.length + 80)
  const prefix = start > 0 ? '…' : ''
  const suffix = end < text.length ? '…' : ''
  const slice = text.slice(start, end)
  if (idx === -1) return prefix + escapeHtml(slice) + suffix
  const hit = idx - start
  return (
    prefix +
    escapeHtml(slice.slice(0, hit)) +
    '<mark>' +
    escapeHtml(slice.slice(hit, hit + needle.length)) +
    '</mark>' +
    escapeHtml(slice.slice(hit + needle.length)) +
    suffix
  )
}

// --- Pagefind runtime (only exists after `pagefind --site .output/public`) ---

type IndexStatus = 'idle' | 'loading' | 'ready' | 'unavailable'

// Served by Pagefind after `pagefind --site .output/public`; absent in dev/SSR.
const PAGEFIND_MODULE_URL = '/pagefind/pagefind.js'

const indexStatus = ref<IndexStatus>('idle')
const facetCounts = ref<Record<string, number>>({})
const allResults = ref<SearchResult[]>([])
const searching = ref(false)

let pagefindPromise: Promise<PagefindModule | null> | null = null

function ensurePagefind(): Promise<PagefindModule | null> {
  if (!pagefindPromise) {
    indexStatus.value = 'loading'
    pagefindPromise = (async () => {
      try {
        const pf = (await import(/* @vite-ignore */ PAGEFIND_MODULE_URL)) as PagefindModule
        await pf.init()
        return pf
      } catch {
        return null
      }
    })().then((pf) => {
      indexStatus.value = pf ? 'ready' : 'unavailable'
      return pf
    })
  }
  return pagefindPromise
}

function categoryFromResult(data: PagefindResultData): ResultCategory {
  const tagged = data.filters?.type?.[0]
  if (tagged && CATEGORIES.some(c => c.id === tagged)) return tagged as ResultCategory
  const url = data.url
  if (url.includes('government')) return 'officials'
  if (url.includes('barangay')) return 'barangays'
  if (url.includes('project')) return 'projects'
  if (url.includes('law')) return 'laws'
  if (url.includes('money') || url.includes('budget')) return 'budget'
  if (url.includes('service')) return 'services'
  return 'pages'
}

// --- State & search orchestration ---

const route = useRoute()
const router = useRouter()

function routeQuery(): string {
  const q = route.query.q
  return typeof q === 'string' ? q : ''
}

const query = ref(routeQuery())
const activeCategory = ref<CategoryId>('all')
const inputEl = ref<HTMLInputElement | null>(null)

const visibleResults = computed<SearchResult[]>(() =>
  activeCategory.value === 'all'
    ? allResults.value
    : allResults.value.filter(r => r.category === activeCategory.value)
)

const statusText = computed(() => {
  const q = query.value.trim()
  if (!q) return ''
  const n = visibleResults.value.length
  const scope = activeCategory.value === 'all' ? '' : ` in ${categoryLabel(activeCategory.value)}`
  return `${n} result${n === 1 ? '' : 's'}${scope} for “${q}”`
})

function categoryLabel(id: string): string {
  return CATEGORIES.find(c => c.id === id)?.label ?? 'Pages'
}

interface PagefindOutcome {
  results: SearchResult[]
  facets: Record<string, number>
}

async function runPagefindSearch(q: string): Promise<PagefindOutcome | null> {
  const pf = await ensurePagefind()
  if (!pf) return null
  // Always run the unfiltered query so facet counts and in-page
  // category filtering stay consistent from a single result set.
  const res = await pf.search(q)
  const datas = await Promise.all(res.results.slice(0, 100).map(r => r.data()))
  return {
    facets: res.filters?.type ?? {},
    results: datas.map(d => ({
      url: d.url,
      title: d.meta?.title ?? d.url,
      excerptHtml: d.excerpt,
      category: categoryFromResult(d)
    }))
  }
}

function runFallbackSearch(q: string) {
  const needle = q.toLowerCase()
  const matched = fallbackDocs
    .filter(d => d.searchText.includes(needle))
    .sort((a, b) => Number(b.title.toLowerCase().includes(needle)) - Number(a.title.toLowerCase().includes(needle)))
  const counts: Record<string, number> = {}
  for (const d of matched) counts[d.type] = (counts[d.type] ?? 0) + 1
  facetCounts.value = counts
  allResults.value = matched.map(d => ({
    url: d.url,
    title: d.title,
    excerptHtml: buildExcerpt(d.description || d.title, q),
    category: d.type
  }))
}

// Overlapping searches resolve out of order; only the latest may apply results.
let searchSeq = 0

async function executeSearch() {
  const seq = ++searchSeq
  const q = query.value.trim()
  if (!q) {
    allResults.value = []
    facetCounts.value = {}
    searching.value = false
    return
  }
  searching.value = true
  try {
    let outcome: PagefindOutcome | null = null
    try {
      outcome = await runPagefindSearch(q)
    } catch {
      // Corrupt index or failed fragment fetch — degrade to dataset results.
      indexStatus.value = 'unavailable'
    }
    if (seq !== searchSeq) return
    if (outcome) {
      facetCounts.value = outcome.facets
      allResults.value = outcome.results
    } else {
      runFallbackSearch(q)
    }
  } finally {
    if (seq === searchSeq) searching.value = false
  }
}

function onSubmit() {
  const q = query.value.trim()
  void router.replace({ path: '/search', query: q ? { q } : {} })
  void executeSearch()
}

watch(
  () => route.query.q,
  (q) => {
    const next = typeof q === 'string' ? q : ''
    if (next !== query.value) query.value = next
  }
)

let debounce: ReturnType<typeof setTimeout> | undefined
watch(query, () => {
  clearTimeout(debounce)
  debounce = setTimeout(() => void executeSearch(), 180)
})

onMounted(() => {
  void ensurePagefind().then(() => executeSearch())
  if (!query.value) inputEl.value?.focus()
})

onBeforeUnmount(() => clearTimeout(debounce))
</script>

<template>
  <div data-pagefind-filter="type:pages" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
    <header class="space-y-2">
      <h1 class="font-serif text-3xl font-bold text-laguna-green tracking-tight">Search</h1>
      <p class="text-sm text-charcoal/70 max-w-2xl">
        Search officials, barangays, projects, ordinances, budget records, and services for Santa Rosa, Laguna.
      </p>
    </header>

    <form role="search" class="flex gap-2" @submit.prevent="onSubmit">
      <div class="relative flex-grow">
        <label for="search-page-input" class="sr-only">Search Santa Rosa public records</label>
        <Search
          :size="16"
          aria-hidden="true"
          class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/50"
        />
        <input
          id="search-page-input"
          ref="inputEl"
          v-model="query"
          type="search"
          name="q"
          autocomplete="off"
          placeholder="Search Santa Rosa..."
          class="w-full rounded-md border border-charcoal/20 bg-white py-2.5 pl-10 pr-3 text-sm text-charcoal placeholder:text-charcoal/70 focus:border-laguna-green focus:outline-none focus:ring-2 focus:ring-laguna-green/30"
        />
      </div>
      <button
        type="submit"
        class="rounded-md bg-laguna-green px-4 py-2.5 text-sm font-medium text-parchment transition hover:bg-laguna-green/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-laguna-green"
      >
        Search
      </button>
    </form>

    <div role="group" aria-label="Filter results by content type" class="flex flex-wrap gap-2">
      <button
        v-for="c in CATEGORIES"
        :key="c.id"
        type="button"
        :aria-pressed="activeCategory === c.id"
        @click="activeCategory = c.id"
        class="rounded-full border px-3 py-1 text-xs font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
        :class="activeCategory === c.id
          ? 'border-laguna-green bg-laguna-green text-parchment'
          : 'border-charcoal/20 bg-white text-charcoal/70 hover:border-laguna-green hover:text-laguna-green'"
      >
        {{ c.label }}<template v-if="c.id !== 'all' && facetCounts[c.id]"> ({{ facetCounts[c.id] }})</template>
      </button>
    </div>

    <p v-if="statusText" role="status" aria-live="polite" class="text-sm text-charcoal/70">
      {{ statusText }}<template v-if="searching"> · searching…</template>
    </p>

    <div
      v-if="indexStatus === 'unavailable'"
      class="rounded-md border border-heritage-gold/40 bg-heritage-gold/10 p-4 text-sm text-charcoal"
      role="note"
    >
      <p class="font-medium">Full-text search index unavailable · showing basic results from the civic datasets.</p>
      <p class="mt-1 text-charcoal/70">
        Run <code class="rounded bg-parchment px-1">pnpm run generate &amp;&amp; pnpm run index:search</code>
        to enable Pagefind-powered search across every page.
      </p>
    </div>

    <ul v-if="visibleResults.length" role="list" class="space-y-4">
      <li
        v-for="r in visibleResults"
        :key="`${r.url}::${r.title}`"
        class="rounded-lg border border-charcoal/10 bg-white p-4 shadow-sm"
      >
        <div class="flex flex-wrap items-baseline gap-2">
          <a
            :href="r.url"
            class="font-serif text-lg font-bold text-laguna-green underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green rounded-sm"
          >{{ r.title }}</a>
          <span class="rounded bg-charcoal/10 px-2 py-0.5 text-[11px] font-medium text-charcoal/70">
            {{ categoryLabel(r.category) }}
          </span>
        </div>
        <!-- Pagefind emits escaped excerpts with <mark> tags; fallback excerpts are escaped before markup -->
        <p
          class="mt-1 text-sm text-charcoal/80 [&_mark]:rounded-sm [&_mark]:bg-heritage-gold/40 [&_mark]:px-0.5 [&_mark]:font-semibold [&_mark]:text-charcoal"
          v-html="r.excerptHtml"
        />
        <p class="mt-1 text-[11px] text-charcoal/80">{{ r.url }}</p>
      </li>
    </ul>

    <div
      v-else-if="query.trim() && !searching"
      class="rounded-md border border-charcoal/10 bg-white p-6 text-center text-sm text-charcoal/70"
    >
      <p class="font-medium text-charcoal">No results for “{{ query.trim() }}”</p>
      <p class="mt-1">Try different keywords, check spelling, or broaden the category filter above.</p>
    </div>

    <div v-else-if="!query.trim()" class="rounded-md border border-charcoal/10 bg-white p-6 text-center text-sm text-charcoal/70">
      <p>Type a name, barangay, ordinance number, project, or service to begin.</p>
      <p class="mt-1">Tip: press <kbd class="rounded bg-parchment px-1.5 py-0.5 text-[10px] text-charcoal/80">⌘K</kbd> / <kbd class="rounded bg-parchment px-1.5 py-0.5 text-[10px] text-charcoal/80">Ctrl+K</kbd> anywhere to jump to search.</p>
    </div>
  </div>
</template>
