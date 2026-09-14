<script setup lang="ts">
import lawsData from '~/data/laws.json'
import DataLastVerified from '~/components/data/LastVerified.vue'
import DataSourceCitation from '~/components/data/SourceCitation.vue'
import { toSourceReference } from '~/utils/source'
import { buildSeoHead, SITE_URL } from '~/utils/seo'
import type { Law, SourceReference } from '~/types/civic'

// Route param is the law id — the dataset has no separate slug field.
// useRoute/createError/useHead are Nuxt auto-imports; guards keep this page
// importable under plain Vitest where the auto-import globals do not exist.
const slug = typeof useRoute === 'function' ? String(useRoute().params.slug ?? '') : ''

const law = (lawsData as Law[]).find(l => l.id === slug)

if (!law && typeof createError === 'function') {
  throw createError({
    statusCode: 404,
    statusMessage: `No law or issuance found for "${slug}"`,
    fatal: true
  })
}

const LAW_TYPE_LABEL: Record<Law['type'], string> = {
  ordinance: 'Ordinance',
  resolution: 'Resolution',
  executive_order: 'Executive Order'
}

const LAW_TYPE_PLURAL: Record<Law['type'], string> = {
  ordinance: 'Ordinances',
  resolution: 'Resolutions',
  executive_order: 'Executive Orders'
}

const LAW_TYPE_BADGE: Record<Law['type'], string> = {
  ordinance: 'bg-laguna-green/10 text-laguna-green border-laguna-green/20',
  resolution: 'bg-laguna-blue/15 text-laguna-blue border-laguna-blue/30',
  executive_order: 'bg-heritage-gold/20 text-charcoal border-heritage-gold/40'
}

// Spec §22 attribution pattern: "Based on: Official Ordinance No. XXXX"
const LAW_BASED_ON: Record<Law['type'], string> = {
  ordinance: 'Official Ordinance',
  resolution: 'Official Resolution',
  executive_order: 'Executive Order'
}

const typeLabel = law ? LAW_TYPE_LABEL[law.type] : 'Measure'

if (typeof useHead === 'function') {
  useHead(buildSeoHead({
    title: `${typeLabel} No. ${law?.number ?? 'Not Found'} — Better Santa Rosa City`,
    description: law?.summary ?? 'City law or issuance record for Santa Rosa City, Laguna.',
    path: `/laws/${slug}`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Laws & Ordinances', item: `${SITE_URL}/laws` },
        { '@type': 'ListItem', position: 3, name: law ? `${typeLabel} No. ${law.number}` : 'Measure' }
      ]
    }
  }))
}

// source strings hold "Title (url); Title (url)" — split into citation records.
const sourceRefs: SourceReference[] = law
  ? law.source.split(';').map(part => part.trim()).filter(Boolean).map(toSourceReference)
  : []

// Related measures: same issuance type, other ids — no topic field exists in
// the dataset, so type is the only honest relationship available.
const relatedLaws = law
  ? (lawsData as Law[]).filter(l => l.id !== law.id && l.type === law.type).slice(0, 3)
  : []
</script>

<template>
  <div v-if="law" data-pagefind-filter="type:laws" class="flex flex-col gap-10">
    <nav aria-label="Breadcrumb">
      <NuxtLink
        to="/laws"
        class="rounded-sm text-sm font-semibold text-laguna-green underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
      >← All laws &amp; ordinances</NuxtLink>
    </nav>

    <header class="max-w-3xl space-y-3">
      <div class="flex flex-wrap items-center gap-2">
        <span
          class="inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
          :class="LAW_TYPE_BADGE[law.type]"
        >{{ typeLabel }} No. {{ law.number }}</span>
        <!-- Dates render exactly as recorded — year-only values stay year-only -->
        <time :datetime="law.date" class="text-xs text-charcoal/50">{{ law.date }}</time>
      </div>
      <h1 class="font-serif text-3xl font-bold tracking-tight text-laguna-green sm:text-4xl">
        {{ law.title }}
      </h1>
      <DataLastVerified :date="law.lastVerified" />
    </header>

    <section aria-labelledby="summary-heading" class="space-y-4">
      <h2 id="summary-heading" class="font-serif text-2xl font-bold tracking-tight text-laguna-green">
        Summary
      </h2>
      <div class="rounded-lg border border-charcoal/10 bg-white p-5 shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-wide text-heritage-gold">
          Better Santa Rosa summary
        </p>
        <p class="mt-1 text-xs text-charcoal/60">
          Based on: {{ LAW_BASED_ON[law.type] }} No. {{ law.number }}
        </p>
        <p class="mt-3 text-sm leading-relaxed text-charcoal/80 sm:text-base">
          {{ law.summary }}
        </p>
        <p class="mt-4 text-xs leading-relaxed text-charcoal/60">
          This is a neutral community summary, not the official text. The linked
          document copy is the authoritative reference.
        </p>
      </div>
    </section>

    <section aria-labelledby="details-heading" class="space-y-4">
      <h2 id="details-heading" class="font-serif text-2xl font-bold tracking-tight text-laguna-green">
        Record details
      </h2>
      <dl class="grid gap-4 rounded-lg border border-charcoal/10 bg-white p-5 shadow-sm sm:grid-cols-3">
        <div>
          <dt class="text-xs font-semibold uppercase tracking-wide text-charcoal/50">Type</dt>
          <dd class="mt-1 text-sm font-medium text-charcoal">{{ typeLabel }}</dd>
        </div>
        <div>
          <dt class="text-xs font-semibold uppercase tracking-wide text-charcoal/50">Number</dt>
          <dd class="mt-1 text-sm font-medium text-charcoal">{{ law.number }}</dd>
        </div>
        <div>
          <dt class="text-xs font-semibold uppercase tracking-wide text-charcoal/50">Date</dt>
          <dd class="mt-1 text-sm font-medium text-charcoal">
            <time :datetime="law.date">{{ law.date }}</time>
          </dd>
        </div>
      </dl>
    </section>

    <section aria-labelledby="document-heading" class="space-y-4">
      <h2 id="document-heading" class="font-serif text-2xl font-bold tracking-tight text-laguna-green">
        Document
      </h2>
      <div class="rounded-lg border border-charcoal/10 bg-white p-5 shadow-sm">
        <template v-if="law.documentUrl">
          <a
            :href="law.documentUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-block rounded-sm text-sm font-semibold text-rose-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
          >Read the document copy ↗</a>
          <p class="mt-3 text-xs leading-relaxed text-charcoal/60">
            The link opens an external copy of the document cited in the sources
            below. It is not hosted by Better Santa Rosa City.
          </p>
        </template>
        <p v-else class="text-sm italic text-charcoal/60">
          Document copy unavailable in the sources reviewed
        </p>
      </div>
    </section>

    <section aria-labelledby="related-heading" class="space-y-4">
      <h2 id="related-heading" class="font-serif text-2xl font-bold tracking-tight text-laguna-green">
        Related measures
      </h2>
      <ul v-if="relatedLaws.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <li
          v-for="r in relatedLaws"
          :key="r.id"
          class="flex flex-col rounded-lg border border-charcoal/10 bg-white p-4 shadow-sm"
        >
          <span
            class="inline-flex w-fit items-center rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
            :class="LAW_TYPE_BADGE[r.type]"
          >{{ LAW_TYPE_LABEL[r.type] }} No. {{ r.number }}</span>
          <h3 class="mt-2 font-serif text-base font-bold leading-snug text-charcoal">
            <NuxtLink
              :to="`/laws/${r.id}`"
              class="rounded-sm transition hover:text-laguna-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
            >{{ r.title }}</NuxtLink>
          </h3>
          <time :datetime="r.date" class="mt-1 text-[11px] text-charcoal/50">{{ r.date }}</time>
        </li>
      </ul>
      <p v-else class="rounded-lg border border-charcoal/10 bg-white p-5 text-sm italic text-charcoal/60">
        No other {{ LAW_TYPE_PLURAL[law.type].toLowerCase() }} are recorded in this directory yet.
      </p>
      <p>
        <NuxtLink
          :to="`/laws?type=${law.type}`"
          class="rounded-sm text-sm font-semibold text-laguna-green underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
        >Browse all {{ LAW_TYPE_PLURAL[law.type].toLowerCase() }} →</NuxtLink>
      </p>
    </section>

    <section aria-labelledby="sources-heading" class="space-y-4">
      <h2 id="sources-heading" class="font-serif text-2xl font-bold tracking-tight text-laguna-green">
        Sources
      </h2>
      <ul v-if="sourceRefs.length" class="flex flex-wrap gap-2">
        <li v-for="s in sourceRefs" :key="s.title">
          <DataSourceCitation :source="s" :verified-date="law.lastVerified" />
        </li>
      </ul>
      <p v-else class="rounded-lg border border-charcoal/10 bg-white p-5 text-sm italic text-charcoal/60">
        Source documents unavailable in the source reviewed
      </p>
      <p class="text-xs text-charcoal/60">
        Details not shown here were unavailable in the sources reviewed and are
        never filled in with assumptions.
      </p>
    </section>
  </div>
</template>
