<script setup lang="ts">
import { onMounted, ref } from 'vue'
import cityData from '~/data/city.json'
import barangaysData from '~/data/barangays.json'
import budgetsData from '~/data/budgets.json'
import projectsData from '~/data/projects.json'
import lawsData from '~/data/laws.json'
import servicesData from '~/data/services.json'
import mediaData from '~/data/media.json'
import CivicTimeline from '~/components/civic/Timeline.vue'
import CivicHeroSearch from '~/components/civic/HeroSearch.vue'
import CivicMapExplorer from '~/components/civic/MapExplorer.vue'
import CivicCollage from '~/components/civic/Collage.vue'
import CivicRoseMotif from '~/components/civic/RoseMotif.vue'
import MediaCivicImage from '~/components/media/CivicImage.vue'
import DataFreshness from '~/components/data/DataFreshness.vue'
import DataStatCard from '~/components/data/StatCard.vue'
import DataLastVerified from '~/components/data/LastVerified.vue'
import ProjectsProjectCard from '~/components/projects/ProjectCard.vue'
import { useScrollReveal } from '~/composables/useScrollReveal'
import { buildSeoHead, SITE_URL } from '~/utils/seo'
import { formatPeso } from '~/utils/currency'
import { toSourceReference } from '~/utils/source'
import { LAW_TYPE_LABEL } from '~/utils/law'
import type { Law, MediaItem, Project } from '~/types/civic'

// Auto-imports are Nuxt-only; guards keep this page mountable under plain Vitest.
// The Organization schema describes this project — independent and community
// maintained — never the City Government (spec §28).
if (typeof useHead === 'function') {
  useHead(buildSeoHead({
    title: 'Better Santa Rosa City — Public Information Portal',
    description:
      'Independent, community-maintained public information portal for Santa Rosa City, Laguna — barangays, budgets, projects, laws, services and sources, each linked to official records.',
    path: '/',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Better Santa Rosa City',
        url: SITE_URL,
        logo: `${SITE_URL}/icon.png`,
        description:
          'Independent, community-maintained public information project for Santa Rosa City, Laguna. Not affiliated with the City Government of Santa Rosa.'
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Better Santa Rosa City',
        url: SITE_URL,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${SITE_URL}/search?q={search_term_string}`
          },
          'query-input': 'required name=search_term_string'
        }
      }
    ]
  }))
}

// --- Section 1: hero ---------------------------------------------------------

// media.json is validated against MediaItemSchema by media-schema.spec.ts;
// the JSON import widens `category` to string, so assert the type once here.
const media = mediaData as MediaItem[]
// The Santa Rosa Arch is the city's signature welcome landmark (spec §7).
const heroImage = media.find(m => m.id === 'santa-rosa-arch') ?? media[0]!

const searchExamples = [
  { label: 'Search budgets', q: 'budgets' },
  { label: 'Search projects', q: 'projects' },
  { label: 'Search ordinances', q: 'ordinances' },
  { label: 'Search officials', q: 'officials' },
  { label: 'Search barangays', q: 'barangays' }
]

// --- Section 2: verified city facts ------------------------------------------

const lakeBarangayCount = barangaysData.filter(b => b.group === 'Laguna Lake').length

// numericValue drives the CountUp reveal in StatCard (spec §10). Cityhood stays
// a static value — a year rendered through toLocaleString would show "2,004".
const cityStats: { value: string; label: string; source: string; numericValue?: number; suffix?: string }[] = [
  {
    value: String(cityData.barangayCount),
    numericValue: cityData.barangayCount,
    label: 'Barangays',
    source: 'City Government of Santa Rosa — About Us'
  },
  {
    value: `${cityData.landAreaHa.toLocaleString('en-US')} ha`,
    numericValue: cityData.landAreaHa,
    suffix: ' ha',
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
    numericValue: lakeBarangayCount,
    label: 'Laguna Lake barangays',
    source: 'City Government of Santa Rosa — About Us'
  }
]

// --- Section 4: verified revenue figures ----------------------------------------

// budgets.json holds verified COA/BLGF revenue figures, not appropriations —
// surfaced to readers as "Verified city revenue", never as total budget.
const budgets = [...budgetsData].sort((a, b) => b.fiscalYear - a.fiscalYear)
const latestBudget = budgets.at(0)
const earlierBudgets = budgets.slice(1)

const BUDGET_SOURCE_TITLES: Record<number, string> = {
  2024: 'Commission on Audit — Annual Audit Report FY2024 · LGU Full Disclosure',
  2022: 'Commission on Audit — Annual Audit Report FY2022 (via Wikipedia)',
  2016: 'Bureau of Local Government Finance — Annual Regular Income (via PhilAtlas)'
}

function budgetSourceTitle(year: number, source: string): string {
  return BUDGET_SOURCE_TITLES[year] ?? toSourceReference(source).title
}

// Each year's document URL falls back to the first URL embedded in the source string.
const latestDocUrl = latestBudget?.documentUrl ?? (latestBudget ? toSourceReference(latestBudget.source).url : undefined)

// --- Section 5: projects ---------------------------------------------------------

const featuredProjects = projectsData as Project[]

// --- Section 6: laws ---------------------------------------------------------------

function lawTimestamp(date: string): number {
  const t = Date.parse(date.length === 4 ? `${date}-01-01` : date)
  return Number.isNaN(t) ? 0 : t
}

const recentLaws = [...(lawsData as Law[])]
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

// --- Scroll reveals (spec §19) ---------------------------------------------------

// Sections fade and rise once as they enter the viewport. The hidden state is
// only applied after hydration so prerendered/no-JS pages stay fully readable;
// reduced-motion and no-IntersectionObserver environments start visible.
const hydrated = ref(false)
onMounted(() => { hydrated.value = true })

const todaySection = ref<HTMLElement | null>(null)
const dataBand = ref<HTMLElement | null>(null)
const projectsBand = ref<HTMLElement | null>(null)
const lawsServicesBand = ref<HTMLElement | null>(null)
const heritageBand = ref<HTMLElement | null>(null)
const collageSection = ref<HTMLElement | null>(null)
const sourcesBand = ref<HTMLElement | null>(null)
const aboutSection = ref<HTMLElement | null>(null)

const { isVisible: todayVisible } = useScrollReveal(todaySection, { threshold: 0.1 })
const { isVisible: dataVisible } = useScrollReveal(dataBand, { threshold: 0.05 })
const { isVisible: projectsVisible } = useScrollReveal(projectsBand, { threshold: 0.1 })
const { isVisible: lawsServicesVisible } = useScrollReveal(lawsServicesBand, { threshold: 0.05 })
const { isVisible: heritageVisible } = useScrollReveal(heritageBand, { threshold: 0.1 })
const { isVisible: collageVisible } = useScrollReveal(collageSection, { threshold: 0.1 })
const { isVisible: sourcesVisible } = useScrollReveal(sourcesBand, { threshold: 0.1 })
const { isVisible: aboutVisible } = useScrollReveal(aboutSection, { threshold: 0.1 })

const REVEAL_CLASS = 'transition-all duration-700 ease-out motion-reduce:transition-none'
function revealClass(isVisible: boolean) {
  return [REVEAL_CLASS, hydrated.value && !isVisible ? 'opacity-0 translate-y-5' : 'opacity-100 translate-y-0']
}

// Full-content-width band: cancels the layout's horizontal padding so the
// section tone runs edge to edge, then restores it for the inner content.
const BAND_CLASS = '-mx-4 px-4 py-10 sm:-mx-6 sm:px-6 md:py-14 lg:-mx-8 lg:px-8'
</script>

<template>
  <div data-pagefind-filter="type:pages" class="flex flex-col gap-16 md:gap-24">
    <!-- 1 — Hero (parchment) -->
    <section aria-labelledby="hero-heading" class="pt-2 md:pt-6">
      <div class="grid items-center gap-10 lg:grid-cols-12">
        <div class="animate-fade-in-up lg:col-span-7">
          <p class="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-rose-accent-dark">
            <CivicRoseMotif :size="16" class="text-rose-accent" />
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

          <CivicHeroSearch class="mt-8" />

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

          <p class="mt-6 flex items-center gap-2 text-xs text-charcoal/70">
            <span class="inline-block h-1.5 w-1.5 rounded-full bg-laguna-green" aria-hidden="true" />
            Independent community project • Sources linked to original documents
          </p>
        </div>

        <div class="relative lg:col-span-5">
          <MediaCivicImage
            :media="heroImage"
            :alt="heroImage.description"
            aspect-ratio="4 / 3"
            priority
            img-class="animate-ken-burns"
            credit-variant="overlay"
            class="shadow-md"
          >
            <!-- Warm editorial tone treatment (spec §7): a light deep-green
                 wash — the photograph stays recognizable. -->
            <div
              aria-hidden="true"
              class="pointer-events-none absolute inset-0 bg-gradient-to-t from-laguna-green/30 via-transparent to-transparent"
            />
          </MediaCivicImage>
          <div
            aria-hidden="true"
            class="absolute -left-4 -top-4 hidden h-14 w-14 items-center justify-center rounded-full bg-parchment text-rose-accent-dark shadow-md ring-1 ring-charcoal/10 sm:flex"
          >
            <CivicRoseMotif :size="28" />
          </div>
        </div>
      </div>
    </section>

    <!-- 2 — Santa Rosa Today (warm parchment band) -->
    <section
      ref="todaySection"
      aria-labelledby="today-heading"
      class="section-parchment"
      :class="revealClass(todayVisible)"
    >
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
          :numeric-value="stat.numericValue"
          :suffix="stat.suffix"
        />
      </div>
    </section>

    <!-- 3 & 4 — White data band: Map Explorer + city money -->
    <div
      ref="dataBand"
      class="section-white"
      :class="[BAND_CLASS, revealClass(dataVisible)]"
    >
      <div class="flex flex-col gap-16 md:gap-20">
        <section aria-label="Explore Santa Rosa">
          <CivicMapExplorer />
          <NuxtLink
            to="/barangays"
            class="mt-4 inline-block rounded-sm text-sm font-semibold text-laguna-green underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
          >
            Browse all 18 barangays →
          </NuxtLink>
        </section>

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
              <p class="text-xs font-semibold uppercase tracking-wider text-charcoal/70">
                FY {{ latestBudget.fiscalYear }}
              </p>
              <p class="mt-2 font-serif text-4xl font-bold tracking-tight text-laguna-green sm:text-5xl">
                {{ formatPeso(latestBudget.totalBudgetPhp) }}
              </p>
              <p class="mt-1 text-sm font-medium text-charcoal">Verified city revenue (COA/BLGF)</p>
              <p class="mt-4 text-sm leading-relaxed text-charcoal/70">
                {{ latestBudget.categories.at(0)?.name }}
              </p>
              <div class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-charcoal/10 pt-3 text-xs text-charcoal/70">
                <span>Source: {{ budgetSourceTitle(latestBudget.fiscalYear, latestBudget.source) }}</span>
                <a
                  v-if="latestDocUrl"
                  :href="latestDocUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="font-medium text-rose-accent-dark hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green rounded-sm"
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
                  <p class="text-xs font-semibold uppercase tracking-wider text-charcoal/70">FY {{ b.fiscalYear }}</p>
                  <DataLastVerified :date="b.lastVerified" :show-state="false" />
                </div>
                <p class="mt-1 font-serif text-xl font-bold text-laguna-green">{{ formatPeso(b.totalBudgetPhp) }}</p>
                <p class="mt-1 text-[11px] leading-snug text-charcoal/80">
                  Verified revenue — {{ budgetSourceTitle(b.fiscalYear, b.source) }}
                </p>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>

    <!-- 5 — Building the City (deep green band) -->
    <section
      ref="projectsBand"
      aria-labelledby="projects-heading"
      class="section-deep-green"
      :class="[BAND_CLASS, revealClass(projectsVisible)]"
    >
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="projects-heading" class="font-serif text-3xl font-bold tracking-tight text-parchment">
            Building the City
          </h2>
          <p class="mt-1 text-sm text-parchment/75">Projects tracked against official and reported records.</p>
        </div>
        <NuxtLink
          to="/projects"
          class="rounded-sm text-sm font-semibold text-parchment underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-parchment"
        >
          Explore projects →
        </NuxtLink>
      </div>

      <div class="mt-6 grid gap-4 md:grid-cols-3">
        <ProjectsProjectCard
          v-for="p in featuredProjects"
          :key="p.id"
          :project="p"
        />
      </div>
    </section>

    <!-- 6 & 7 — Laws then Services in DOM (spec §9.1); mobile renders Services first (spec §33) -->
    <div
      ref="lawsServicesBand"
      class="flex flex-col gap-16 md:gap-24"
      :class="revealClass(lawsServicesVisible)"
    >
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
              <time :datetime="law.date" class="text-xs text-charcoal/70">{{ law.date }}</time>
            </div>
            <h3 class="mt-2 font-serif text-base font-bold leading-snug text-charcoal">{{ law.title }}</h3>
            <div class="mt-2 flex flex-wrap items-center justify-between gap-2">
              <a
                v-if="law.documentUrl"
                :href="law.documentUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-xs font-medium text-rose-accent-dark hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green rounded-sm"
              >Read the document ↗</a>
              <span v-else class="text-xs text-charcoal/70">Document copy pending</span>
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
            <ul v-if="cat.items.length" class="mt-2 space-y-1 text-xs leading-snug text-charcoal/70">
              <li v-for="s in cat.items.slice(0, 2)" :key="s.id">{{ s.title }}</li>
            </ul>
            <p v-else class="mt-2 text-xs leading-snug text-charcoal/70">
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
                class="mt-1 inline-block text-xs font-medium text-rose-accent-dark hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green rounded-sm"
              >Official page ↗</a>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- 8 — From Bukol to Modern Santa Rosa (Laguna-blue band) -->
    <section
      ref="heritageBand"
      aria-labelledby="history-heading"
      class="section-lake-blue"
      :class="[BAND_CLASS, revealClass(heritageVisible)]"
    >
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

    <!-- 9 — Signature editorial collage (heritage parchment) -->
    <section
      ref="collageSection"
      aria-label="Santa Rosa life and heritage collage"
      class="section-parchment"
      :class="revealClass(collageVisible)"
    >
      <CivicCollage />
    </section>

    <!-- 10 — Data Freshness (white sources band) -->
    <section
      ref="sourcesBand"
      aria-labelledby="freshness-heading"
      class="section-white"
      :class="[BAND_CLASS, revealClass(sourcesVisible)]"
    >
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

    <!-- 11 — About -->
    <section
      ref="aboutSection"
      aria-labelledby="about-heading"
      class="rounded-2xl border border-charcoal/10 bg-white p-6 shadow-sm sm:p-10"
      :class="revealClass(aboutVisible)"
    >
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
