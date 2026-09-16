<script setup lang="ts">
import DataSourceBadge from '~/components/data/SourceBadge.vue'
import DataLastVerified from '~/components/data/LastVerified.vue'
import { buildDatasets } from '~/utils/datasets'
import { buildSeoHead, SITE_URL } from '~/utils/seo'

// The catalog builder lives in utils/datasets.ts so the homepage Data &
// Downloads chapter publishes the same files and source notes.
const datasets = buildDatasets()

// Auto-imports are Nuxt-only; the guard keeps this page mountable under plain Vitest.
// Runs after `datasets` so the Dataset JSON-LD mirrors the published list.
if (typeof useHead === 'function') {
  useHead(buildSeoHead({
    title: 'Open Data & Downloads · Better Santa Rosa City',
    description: 'Downloadable civic datasets for Santa Rosa, Laguna: barangays, officials, budgets, projects, ordinances and the source registry, in JSON and CSV.',
    path: '/data',
    jsonLd: datasets.map(ds => ({
      '@context': 'https://schema.org',
      '@type': 'Dataset',
      name: `Santa Rosa City, Laguna · ${ds.name}`,
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
  <div data-pagefind-filter="type:pages" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-12">
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
        citations and verification dates. Check the original documents before
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
