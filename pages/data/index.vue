<script setup lang="ts">
import barangaysData from '~/data/barangays.json'
import officialsData from '~/data/officials.json'
import departmentsData from '~/data/departments.json'
import budgetsData from '~/data/budgets.json'
import projectsData from '~/data/projects.json'
import lawsData from '~/data/laws.json'
import servicesData from '~/data/services.json'
import sourcesData from '~/data/sources.json'
import cityData from '~/data/city.json'
import DataSourceBadge from '~/components/data/SourceBadge.vue'
import DataLastVerified from '~/components/data/LastVerified.vue'
import { toSourceReference } from '~/utils/source'
import { toCsv, csvDataUri } from '~/utils/csv'
import { buildSeoHead, SITE_URL } from '~/utils/seo'
import type {
  Barangay, Budget, CityProfile, Department, Law, Official, Project, Service, Source
} from '~/types/civic'

type AnyRecord = Record<string, unknown>

function asRecords(data: unknown): AnyRecord[] {
  return (Array.isArray(data) ? data : [data]) as AnyRecord[]
}

// Records cite `source: string` or `sources: string[]` depending on the dataset.
function distinctSourceTitles(records: AnyRecord[]): string[] {
  const titles = new Set<string>()
  for (const record of records) {
    const many = record.sources
    const list = Array.isArray(many)
      ? many.filter((s): s is string => typeof s === 'string')
      : typeof record.source === 'string' ? [record.source] : []
    for (const s of list) titles.add(toSourceReference(s).title)
  }
  return [...titles]
}

function maxVerified(records: AnyRecord[]): string | undefined {
  return records
    .map(r => r.lastVerified)
    .filter((d): d is string => typeof d === 'string')
    .sort()
    .at(-1)
}

// Same usage note on every dataset: compiled public data, originals win.
const LICENSE_NOTE = 'Public data compiled from official sources — verify against original documents.'

interface DatasetCard {
  slug: string
  name: string
  description: string
  coverage: string
  lastUpdated?: string
  sourceNote: string
  licenseNote: string
  jsonHref: string
  csvHref: string
}

function makeDataset(
  slug: string,
  name: string,
  description: string,
  coverage: string,
  raw: unknown,
  sourceNoteOverride?: string
): DatasetCard {
  const records = asRecords(raw)
  const titles = distinctSourceTitles(records)
  return {
    slug,
    name,
    description,
    coverage,
    lastUpdated: maxVerified(records),
    sourceNote: sourceNoteOverride ?? titles.join(' · '),
    licenseNote: LICENSE_NOTE,
    // JSON is mirrored into public/data/ by scripts/sync-public-data.mjs.
    jsonHref: `/data/${slug}.json`,
    csvHref: csvDataUri(toCsv(records))
  }
}

const budgetYears = (budgetsData as Budget[]).map(b => b.fiscalYear).sort((a, b) => b - a)
const budgetCoverage = `${(budgetsData as Budget[]).length} fiscal years (FY${budgetYears[0]}–${budgetYears.at(-1)})`

const datasets: DatasetCard[] = [
  makeDataset(
    'barangays', 'Barangays',
    'All city barangays with district grouping, description and 2020 PSA census population where recorded.',
    `${(barangaysData as Barangay[]).length} barangays`, barangaysData
  ),
  makeDataset(
    'officials', 'Elected Officials',
    'City officials — mayor, vice mayor, councilors and the lone district representative — with positions, terms and offices.',
    `${(officialsData as Official[]).length} officials`, officialsData
  ),
  makeDataset(
    'departments', 'Departments & Offices',
    'City departments and offices with heads, responsibilities, contacts and locations.',
    `${(departmentsData as Department[]).length} offices`, departmentsData
  ),
  makeDataset(
    'budgets', 'Annual Budgets',
    'Annual budget totals and category breakdowns per fiscal year, traced to audit and disclosure documents.',
    budgetCoverage, budgetsData
  ),
  makeDataset(
    'projects', 'Public Projects',
    'Tracked public projects with status, barangay, implementing office and budget where disclosed.',
    `${(projectsData as Project[]).length} projects`, projectsData
  ),
  makeDataset(
    'laws', 'Laws & Ordinances',
    'Ordinances, resolutions and executive orders with summaries and links to document copies.',
    `${(lawsData as Law[]).length} issuances`, lawsData
  ),
  makeDataset(
    'services', 'Public Services Directory',
    'Directory entries linking out to official government service pages — never recreated here.',
    `${(servicesData as Service[]).length} services`, servicesData
  ),
  makeDataset(
    'sources', 'Source Registry',
    'Every source cited across the site\'s datasets — official portals, audits, census and secondary references.',
    `${(sourcesData as Source[]).length} registered sources`, sourcesData,
    'The registry itself — per-source notes included in the records'
  ),
  makeDataset(
    'city', 'City Profile',
    'City of Santa Rosa profile — cityhood, land area, barangay count and the historical timeline.',
    `City profile + ${(cityData as CityProfile).timeline.length}-entry timeline`, cityData
  )
]

// Auto-imports are Nuxt-only; the guard keeps this page mountable under plain Vitest.
// Runs after `datasets` so the Dataset JSON-LD mirrors the published list.
if (typeof useHead === 'function') {
  useHead(buildSeoHead({
    title: 'Open Data & Downloads — Better Santa Rosa City',
    description: 'Downloadable civic datasets for Santa Rosa, Laguna — barangays, officials, budgets, projects, ordinances and the source registry — in JSON and CSV.',
    path: '/data',
    jsonLd: datasets.map(ds => ({
      '@context': 'https://schema.org',
      '@type': 'Dataset',
      name: `Santa Rosa City, Laguna — ${ds.name}`,
      description: ds.description,
      url: `${SITE_URL}${ds.jsonHref}`,
      license: ds.licenseNote,
      ...(ds.lastUpdated ? { dateModified: ds.lastUpdated } : {}),
      creator: {
        '@type': 'Organization',
        name: 'Better Santa Rosa City',
        url: SITE_URL
      }
    }))
  }))
}
</script>

<template>
  <div data-pagefind-filter="type:pages" class="flex flex-col gap-12">
    <header class="max-w-3xl space-y-3">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-rose-accent-dark">
        Santa Rosa City, Laguna
      </p>
      <h1 class="font-serif text-3xl font-bold tracking-tight text-laguna-green sm:text-4xl">
        Open Data &amp; Downloads
      </h1>
      <div class="flex flex-wrap items-center gap-2">
        <DataSourceBadge type="community" />
      </div>
      <p class="text-sm leading-relaxed text-charcoal/70 sm:text-base">
        Every dataset behind this site, downloadable for your own research,
        reporting or verification. Each file keeps its per-record source
        citations and verification dates — check the original documents before
        relying on any figure.
      </p>
    </header>

    <section aria-labelledby="datasets-heading">
      <div class="flex flex-wrap items-baseline justify-between gap-2 border-b border-charcoal/10 pb-2">
        <h2 id="datasets-heading" class="font-serif text-2xl font-bold tracking-tight text-laguna-green">
          Download Datasets
        </h2>
        <span class="text-xs font-medium text-charcoal/70">
          {{ datasets.length }} datasets · JSON &amp; CSV
        </span>
      </div>

      <ul class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="ds in datasets" :key="ds.slug">
          <article class="flex h-full flex-col rounded-lg border border-charcoal/10 bg-white p-5 shadow-sm">
            <h3 class="font-serif text-lg font-bold leading-snug text-charcoal">{{ ds.name }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-charcoal/70">{{ ds.description }}</p>

            <dl class="mt-4 space-y-2 text-xs text-charcoal/70">
              <div class="flex gap-2">
                <dt class="shrink-0 font-semibold uppercase tracking-wide text-charcoal/70">Coverage</dt>
                <dd>{{ ds.coverage }}</dd>
              </div>
              <div class="flex gap-2">
                <dt class="shrink-0 font-semibold uppercase tracking-wide text-charcoal/70">Updated</dt>
                <dd>
                  <DataLastVerified v-if="ds.lastUpdated" :date="ds.lastUpdated" :show-state="false" />
                  <span v-else>not recorded</span>
                </dd>
              </div>
              <div class="flex gap-2">
                <dt class="shrink-0 font-semibold uppercase tracking-wide text-charcoal/70">Source</dt>
                <dd>{{ ds.sourceNote }}</dd>
              </div>
            </dl>

            <p class="mt-3 text-[11px] leading-relaxed text-charcoal/80">{{ ds.licenseNote }}</p>

            <div class="mt-auto flex flex-wrap items-center gap-3 pt-4">
              <a
                :href="ds.jsonHref"
                :download="`${ds.slug}.json`"
                class="inline-block rounded-md bg-laguna-green px-3 py-2 text-sm font-semibold text-white transition hover:bg-laguna-green/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-laguna-green"
                :aria-label="`Download ${ds.name} as JSON`"
              >JSON ↓</a>
              <a
                :href="ds.csvHref"
                :download="`${ds.slug}.csv`"
                class="inline-block rounded-md border border-laguna-green/40 px-3 py-2 text-sm font-semibold text-laguna-green transition hover:bg-laguna-green/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-laguna-green"
                :aria-label="`Download ${ds.name} as CSV`"
              >CSV ↓</a>
            </div>
          </article>
        </li>
      </ul>
    </section>

    <p class="text-xs text-charcoal/70">
      Nested fields are kept intact in JSON; in CSV they appear as
      JSON-encoded cells. Records may carry <code>documentUrl</code> or
      <code>officialUrl</code> fields linking to original documents and PDF
      copies where published.
    </p>
  </div>
</template>
