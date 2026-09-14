<script setup lang="ts">
import { ref } from 'vue'
import { Search } from 'lucide-vue-next'
import cityData from '~/data/city.json'
import barangaysData from '~/data/barangays.json'
import budgetsData from '~/data/budgets.json'
import projectsData from '~/data/projects.json'
import lawsData from '~/data/laws.json'
import servicesData from '~/data/services.json'
import CivicTimeline from '~/components/civic/Timeline.vue'
import DataFreshness from '~/components/data/DataFreshness.vue'
import DataStatCard from '~/components/data/StatCard.vue'
import DataLastVerified from '~/components/data/LastVerified.vue'

// Auto-imports are Nuxt-only; guards keep this page mountable under plain Vitest.
if (typeof useHead === 'function') {
  useHead({
    title: 'Better Santa Rosa City — Public information about Santa Rosa, made easier to find'
  })
}

// --- Section 1: hero search -------------------------------------------------

const heroQuery = ref('')
const searchExamples = [
  { label: 'Search budgets', q: 'budgets' },
  { label: 'Search projects', q: 'projects' },
  { label: 'Search ordinances', q: 'ordinances' },
  { label: 'Search officials', q: 'officials' },
  { label: 'Search barangays', q: 'barangays' }
]

function onHeroSearch() {
  const q = heroQuery.value.trim()
  const target = q ? `/search?q=${encodeURIComponent(q)}` : '/search'
  if (typeof navigateTo === 'function') {
    void navigateTo(target)
  } else if (typeof window !== 'undefined') {
    window.location.assign(target)
  }
}

// --- Section 2: verified city facts ------------------------------------------

const lakeBarangayCount = barangaysData.filter(b => b.group === 'Laguna Lake').length

const cityStats = [
  {
    value: String(cityData.barangayCount),
    label: 'Barangays',
    source: 'City Government of Santa Rosa — About Us'
  },
  {
    value: `${cityData.landAreaHa.toLocaleString('en-US')} ha`,
    label: 'Land area',
    source: 'City Government of Santa Rosa — About Us'
  },
  {
    value: String(cityData.cityhoodYear),
    label: 'Cityhood',
    source: 'Republic Act No. 9264'
  },
  {
    value: String(lakeBarangayCount),
    label: 'Laguna Lake barangays',
    source: 'City Government of Santa Rosa — About Us'
  }
]

// --- Section 3: barangay groups ------------------------------------------------

const BARANGAY_GROUP_ORDER = ['Laguna Lake', 'Lowland Urban', 'Upper / Tagaytay'] as const

const barangayGroups = BARANGAY_GROUP_ORDER.map(group => ({
  name: group,
  barangays: barangaysData.filter(b => b.group === group)
}))

// --- Section 4: verified revenue figures ----------------------------------------

// budgets.json holds verified COA/BLGF revenue figures, not appropriations —
// surfaced to readers as "Verified city revenue", never as total budget.
const budgets = [...budgetsData].sort((a, b) => b.fiscalYear - a.fiscalYear)
const latestBudget = budgets.at(0)
const earlierBudgets = budgets.slice(1)

function formatPeso(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `₱${(amount / 1_000_000_000).toFixed(3).replace(/\.?0+$/, '')}B`
  }
  if (amount >= 1_000_000) {
    return `₱${(amount / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  }
  return `₱${amount.toLocaleString('en-US')}`
}

const BUDGET_SOURCE_TITLES: Record<number, string> = {
  2024: 'Commission on Audit — Annual Audit Report FY2024 · LGU Full Disclosure',
  2022: 'Commission on Audit — Annual Audit Report FY2022 (via Wikipedia)',
  2016: 'Bureau of Local Government Finance — Annual Regular Income (via PhilAtlas)'
}

function budgetSourceTitle(year: number, source: string): string {
  return BUDGET_SOURCE_TITLES[year] ?? source.split(' (')[0] ?? source
}

function firstSourceUrl(source: string): string | undefined {
  return source.match(/https?:\/\/[^\s);]+/)?.[0]
}

// --- Section 5: projects ---------------------------------------------------------

const featuredProjects = projectsData

const STATUS_CLASSES: Record<string, string> = {
  Planned: 'bg-heritage-gold/20 text-charcoal border-heritage-gold/40',
  Ongoing: 'bg-laguna-blue/15 text-laguna-blue border-laguna-blue/30',
  Completed: 'bg-laguna-green/10 text-laguna-green border-laguna-green/20',
  Cancelled: 'bg-rose-accent/15 text-rose-accent border-rose-accent/30',
  Unknown: 'bg-charcoal/10 text-charcoal/70 border-charcoal/20'
}

// --- Section 6: laws ---------------------------------------------------------------

const LAW_TYPE_LABEL: Record<string, string> = {
  ordinance: 'Ordinance',
  resolution: 'Resolution',
  executive_order: 'Executive Order'
}

function lawTimestamp(date: string): number {
  const t = Date.parse(date.length === 4 ? `${date}-01-01` : date)
  return Number.isNaN(t) ? 0 : t
}

const recentLaws = [...lawsData]
  .sort((a, b) => lawTimestamp(b.date) - lawTimestamp(a.date))
  .slice(0, 3)

// --- Section 7: services -------------------------------------------------------------

const SERVICE_CATEGORY_ORDER = [
  'Business',
  'Taxes',
  'Permits',
  'Civil Registry',
  'Health',
  'Social Services',
  "Citizen's Charter",
  'Online Services'
] as const

const serviceCategories = SERVICE_CATEGORY_ORDER.map(name => {
  const items = servicesData.filter(s => s.category === name)
  return {
    name,
    items,
    officialUrl: items.at(0)?.officialUrl ?? 'https://santarosacity.gov.ph'
  }
})
</script>

<template>
  <div data-pagefind-filter="type:pages" class="flex flex-col gap-16 md:gap-24">
    <!-- 1 — Hero -->
    <section aria-labelledby="hero-heading" class="pt-2 md:pt-6">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-rose-accent">
        Santa Rosa City, Laguna
      </p>
      <h1
        id="hero-heading"
        class="mt-3 max-w-3xl font-serif text-4xl font-bold leading-tight tracking-tight text-laguna-green sm:text-5xl"
      >
        Public information about Santa Rosa, made easier to find.
      </h1>
      <p class="mt-4 max-w-2xl text-base leading-relaxed text-charcoal/75 sm:text-lg">
        Explore the people, projects, budgets, laws, services and public records of Santa Rosa City.
      </p>

      <form role="search" class="mt-8 max-w-2xl" @submit.prevent="onHeroSearch">
        <div class="relative">
          <label for="hero-search-input" class="sr-only">Search Santa Rosa public records</label>
          <Search
            :size="20"
            aria-hidden="true"
            class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/50"
          />
          <input
            id="hero-search-input"
            v-model="heroQuery"
            type="search"
            name="q"
            autocomplete="off"
            placeholder="Search Santa Rosa..."
            class="w-full rounded-xl border-2 border-charcoal/15 bg-white py-4 pl-12 pr-28 text-base text-charcoal shadow-sm placeholder:text-charcoal/50 focus:border-laguna-green focus:outline-none focus:ring-2 focus:ring-laguna-green/30"
          />
          <button
            type="submit"
            class="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-laguna-green px-4 py-2.5 text-sm font-semibold text-parchment transition hover:bg-laguna-green/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-laguna-green"
          >
            Search
          </button>
        </div>
      </form>

      <ul class="mt-4 flex flex-wrap gap-2" aria-label="Example searches">
        <li v-for="ex in searchExamples" :key="ex.q">
          <NuxtLink
            :to="`/search?q=${ex.q}`"
            class="inline-flex items-center rounded-full border border-charcoal/15 bg-white px-3 py-1.5 text-xs font-medium text-charcoal/70 transition hover:border-laguna-green hover:text-laguna-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
          >
            {{ ex.label }}
          </NuxtLink>
        </li>
      </ul>

      <p class="mt-6 flex items-center gap-2 text-xs text-charcoal/60">
        <span class="inline-block h-1.5 w-1.5 rounded-full bg-laguna-green" aria-hidden="true" />
        Independent community project • Sources linked to original documents
      </p>
    </section>

    <!-- 2 — Santa Rosa Today -->
    <section aria-labelledby="today-heading">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="today-heading" class="font-serif text-3xl font-bold tracking-tight text-laguna-green">
            Santa Rosa Today
          </h2>
          <p class="mt-1 text-sm text-charcoal/70">Verified facts about the city — every figure carries a source.</p>
        </div>
        <NuxtLink
          to="/explore"
          class="rounded-sm text-sm font-semibold text-laguna-green underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
        >
          View city profile →
        </NuxtLink>
      </div>
      <div class="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <DataStatCard
          v-for="stat in cityStats"
          :key="stat.label"
          :value="stat.value"
          :label="stat.label"
          :source="stat.source"
        />
      </div>
    </section>

    <!-- 3 — Explore Santa Rosa -->
    <section aria-labelledby="explore-heading">
      <h2 id="explore-heading" class="font-serif text-3xl font-bold tracking-tight text-laguna-green">
        Explore Santa Rosa
      </h2>
      <p class="mt-1 font-serif text-lg italic text-charcoal/70">18 barangays. One city. Many stories.</p>

      <div class="mt-6 grid gap-4 md:grid-cols-3">
        <div
          v-for="group in barangayGroups"
          :key="group.name"
          class="rounded-lg border border-charcoal/10 bg-white p-5 shadow-sm"
        >
          <div class="flex items-baseline justify-between gap-2">
            <h3 class="font-serif text-lg font-bold text-charcoal">{{ group.name }}</h3>
            <span class="text-xs font-medium text-charcoal/50">
              {{ group.barangays.length }} barangay{{ group.barangays.length === 1 ? '' : 's' }}
            </span>
          </div>
          <ul class="mt-3 flex flex-wrap gap-1.5">
            <li v-for="b in group.barangays" :key="b.slug">
              <NuxtLink
                :to="`/barangays#${b.slug}`"
                class="inline-block rounded-full border border-charcoal/15 bg-parchment px-2.5 py-1 text-xs font-medium text-charcoal/80 transition hover:border-laguna-green hover:text-laguna-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
              >
                {{ b.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
      <p class="mt-3 text-xs text-charcoal/60">
        An interactive barangay map will be added once authoritative GIS boundary data is available.
      </p>
      <NuxtLink
        to="/barangays"
        class="mt-4 inline-block rounded-sm text-sm font-semibold text-laguna-green underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
      >
        Browse all 18 barangays →
      </NuxtLink>
    </section>

    <!-- 4 — Where Does the City's Money Go? -->
    <section aria-labelledby="money-heading">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="money-heading" class="font-serif text-3xl font-bold tracking-tight text-laguna-green">
            Where Does the City's Money Go?
          </h2>
          <p class="mt-1 text-sm text-charcoal/70">
            Only figures backed by audit reports and official disclosures are shown.
          </p>
        </div>
        <NuxtLink
          to="/money"
          class="rounded-sm text-sm font-semibold text-laguna-green underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
        >
          Explore city finances →
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
          <p class="mt-1 text-sm font-medium text-charcoal">Verified city revenue (COA/BLGF)</p>
          <p class="mt-4 text-sm leading-relaxed text-charcoal/70">
            {{ latestBudget.categories.at(0)?.name }}
          </p>
          <div class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-charcoal/10 pt-3 text-xs text-charcoal/60">
            <span>Source: {{ budgetSourceTitle(latestBudget.fiscalYear, latestBudget.source) }}</span>
            <a
              v-if="latestBudget.documentUrl ?? firstSourceUrl(latestBudget.source)"
              :href="latestBudget.documentUrl ?? firstSourceUrl(latestBudget.source)"
              target="_blank"
              rel="noopener noreferrer"
              class="font-medium text-rose-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green rounded-sm"
            >View source ↗</a>
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
            <p class="mt-1 font-serif text-xl font-bold text-laguna-green">{{ formatPeso(b.totalBudgetPhp) }}</p>
            <p class="mt-1 text-[11px] leading-snug text-charcoal/60">
              Verified revenue — {{ budgetSourceTitle(b.fiscalYear, b.source) }}
            </p>
          </li>
        </ul>
      </div>
    </section>

    <!-- 5 — Building the City -->
    <section aria-labelledby="projects-heading">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="projects-heading" class="font-serif text-3xl font-bold tracking-tight text-laguna-green">
            Building the City
          </h2>
          <p class="mt-1 text-sm text-charcoal/70">Projects tracked against official and reported records.</p>
        </div>
        <NuxtLink
          to="/projects"
          class="rounded-sm text-sm font-semibold text-laguna-green underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
        >
          Explore projects →
        </NuxtLink>
      </div>

      <div class="mt-6 grid gap-4 md:grid-cols-3">
        <article
          v-for="p in featuredProjects"
          :key="p.id"
          class="flex flex-col rounded-lg border border-charcoal/10 bg-white p-5 shadow-sm"
        >
          <div class="flex flex-wrap items-center gap-2">
            <span
              class="inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
              :class="STATUS_CLASSES[p.status] ?? STATUS_CLASSES['Unknown']"
            >{{ p.status }}</span>
            <span class="text-[11px] font-medium uppercase tracking-wide text-charcoal/50">{{ p.category }}</span>
          </div>
          <h3 class="mt-3 font-serif text-lg font-bold leading-snug text-charcoal">{{ p.name }}</h3>
          <p class="mt-1 text-xs text-charcoal/60">
            {{ p.barangay }}<template v-if="p.location"> · {{ p.location }}</template>
          </p>
          <p class="mt-3 text-sm font-medium text-charcoal">
            <template v-if="p.budgetPhp != null">{{ formatPeso(p.budgetPhp) }} reported</template>
            <template v-else>Cost not disclosed in sources reviewed</template>
          </p>
          <div class="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4 text-[11px] text-charcoal/50">
            <span v-if="p.sources.at(0)">Source: {{ p.sources.at(0)?.split(' (')[0] }}</span>
            <DataLastVerified :date="p.lastVerified" :show-state="false" />
          </div>
        </article>
      </div>
    </section>

    <!-- 6 & 7 — Laws then Services in DOM (spec §9.1); mobile renders Services first (spec §33) -->
    <div class="flex flex-col gap-16 md:gap-24">
      <section aria-labelledby="laws-heading" class="order-2 md:order-1">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="laws-heading" class="font-serif text-3xl font-bold tracking-tight text-laguna-green">
              Laws &amp; Decisions
            </h2>
            <p class="mt-1 text-sm text-charcoal/70">
              Ordinances, resolutions and executive orders — searchable and source-linked.
            </p>
          </div>
          <NuxtLink
            to="/laws"
            class="rounded-sm text-sm font-semibold text-laguna-green underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
          >
            Find a city ordinance →
          </NuxtLink>
        </div>

        <ul class="mt-6 space-y-3">
          <li
            v-for="law in recentLaws"
            :key="law.id"
            class="rounded-lg border border-charcoal/10 bg-white p-4 shadow-sm"
          >
            <div class="flex flex-wrap items-center gap-2">
              <span class="rounded bg-laguna-green/10 px-2 py-0.5 text-[11px] font-semibold text-laguna-green">
                {{ LAW_TYPE_LABEL[law.type] ?? 'Measure' }} No. {{ law.number }}
              </span>
              <time :datetime="law.date" class="text-xs text-charcoal/50">{{ law.date }}</time>
            </div>
            <h3 class="mt-2 font-serif text-base font-bold leading-snug text-charcoal">{{ law.title }}</h3>
            <div class="mt-2 flex flex-wrap items-center justify-between gap-2">
              <a
                v-if="law.documentUrl"
                :href="law.documentUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-xs font-medium text-rose-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green rounded-sm"
              >Read the document ↗</a>
              <span v-else class="text-xs text-charcoal/50">Document copy pending</span>
              <DataLastVerified :date="law.lastVerified" :show-state="false" />
            </div>
          </li>
        </ul>
      </section>

      <section aria-labelledby="services-heading" class="order-1 md:order-2">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="services-heading" class="font-serif text-3xl font-bold tracking-tight text-laguna-green">
              Services
            </h2>
            <p class="mt-1 text-sm text-charcoal/70">
              Shortcuts to official city services — linked out, never duplicated here.
            </p>
          </div>
          <NuxtLink
            to="/services"
            class="rounded-sm text-sm font-semibold text-laguna-green underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
          >
            Browse the services directory →
          </NuxtLink>
        </div>

        <div class="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <div
            v-for="cat in serviceCategories"
            :key="cat.name"
            class="flex flex-col rounded-lg border border-charcoal/10 bg-white p-4 shadow-sm"
          >
            <h3 class="font-serif text-base font-bold text-charcoal">{{ cat.name }}</h3>
            <ul v-if="cat.items.length" class="mt-2 space-y-1 text-xs leading-snug text-charcoal/60">
              <li v-for="s in cat.items.slice(0, 2)" :key="s.id">{{ s.title }}</li>
            </ul>
            <p v-else class="mt-2 text-xs leading-snug text-charcoal/60">
              Service standards and transaction steps published by the city.
            </p>
            <div class="mt-auto pt-3">
              <p class="border-t border-charcoal/10 pt-2 text-[10px] font-semibold uppercase tracking-wide text-laguna-green">
                Official government service
              </p>
              <a
                :href="cat.officialUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="mt-1 inline-block text-xs font-medium text-rose-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green rounded-sm"
              >Official page ↗</a>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- 8 — From Bukol to Modern Santa Rosa -->
    <section aria-labelledby="history-heading">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="history-heading" class="font-serif text-3xl font-bold tracking-tight text-laguna-green">
            From Bukol to Modern Santa Rosa
          </h2>
          <p class="mt-1 text-sm text-charcoal/70">
            From a lakeside barrio of Biñan to Luzon's richest city outside Metro Manila.
          </p>
        </div>
        <NuxtLink
          to="/explore"
          class="rounded-sm text-sm font-semibold text-laguna-green underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
        >
          Discover Santa Rosa's history →
        </NuxtLink>
      </div>
      <CivicTimeline :items="cityData.timeline" class="mt-8" />
    </section>

    <!-- 9 — Data Freshness -->
    <section aria-labelledby="freshness-heading">
      <h2 id="freshness-heading" class="font-serif text-3xl font-bold tracking-tight text-laguna-green">
        Data Freshness
      </h2>
      <p class="mt-1 max-w-2xl text-sm text-charcoal/70">
        Every dataset is verified against its own sources on its own schedule — no single date applies to the whole site.
      </p>
      <DataFreshness class="mt-6" />
      <NuxtLink
        to="/sources"
        class="mt-4 inline-block rounded-sm text-sm font-semibold text-laguna-green underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
      >
        See the full source registry →
      </NuxtLink>
    </section>

    <!-- 10 — About -->
    <section aria-labelledby="about-heading" class="rounded-2xl border border-charcoal/10 bg-white p-6 shadow-sm sm:p-10">
      <h2 id="about-heading" class="font-serif text-2xl font-bold tracking-tight text-laguna-green">
        About this project
      </h2>
      <p class="mt-3 max-w-3xl text-sm leading-relaxed text-charcoal/80 sm:text-base">
        Better Santa Rosa is an independent, community-maintained public-information project.
        It is not affiliated with or operated by the City Government of Santa Rosa.
      </p>
      <ul class="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
        <li>
          <NuxtLink to="/sources" class="text-laguna-green underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green rounded-sm">
            Methodology &amp; sources →
          </NuxtLink>
        </li>
        <li>
          <a
            href="https://github.com/bettersantarosa"
            target="_blank"
            rel="noopener noreferrer"
            class="text-laguna-green underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green rounded-sm"
          >Contribute ↗</a>
        </li>
        <li>
          <a
            href="https://santarosacity.gov.ph"
            target="_blank"
            rel="noopener noreferrer"
            class="text-laguna-green underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green rounded-sm"
          >Official city website ↗</a>
        </li>
      </ul>
    </section>
  </div>
</template>
