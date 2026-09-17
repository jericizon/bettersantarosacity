<script setup lang="ts">
import cityData from '~/data/city.json'
import CivicTimeline from '~/components/civic/Timeline.vue'
import CivicRoseMotif from '~/components/civic/RoseMotif.vue'
import DataSourceBadge from '~/components/data/SourceBadge.vue'
import DataSourceCitation from '~/components/data/SourceCitation.vue'
import DataLastVerified from '~/components/data/LastVerified.vue'
import { toSourceReference } from '~/utils/source'
import { buildSeoHead } from '~/utils/seo'
import type { SourceReference } from '~/types/civic'

if (typeof useHead === 'function') {
  useHead(buildSeoHead({
    title: 'History of Santa Rosa City · From Bukol to Modern Day',
    description: 'Historical timeline of Santa Rosa, Laguna from Barrio Bukol in 1571 to 2004 cityhood and modern civic development.',
    path: '/history',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'History of Santa Rosa City: From Bukol to Modern Day',
      description: 'Historical timeline and public records of Santa Rosa City, Laguna.',
      datePublished: '2026-09-15',
      dateModified: cityData.lastVerified,
      author: {
        '@type': 'Organization',
        name: 'Better Santa Rosa City'
      }
    }
  }))
}

const timeline = cityData.timeline
const lastVerified = cityData.lastVerified

// Spec §6.1: the timeline splits into three jumpable eras. Bucketed on the
// numeric year: < 1898 Spanish colonial, 1898-1945 revolution and republic,
// > 1945 modern era.
const eras = [
  {
    id: 'era-spanish',
    name: 'Spanish Era',
    range: '1571–1898',
    items: timeline.filter(item => Number(item.year) < 1898)
  },
  {
    id: 'era-revolution',
    name: 'Revolution & Republic',
    range: '1898–1945',
    items: timeline.filter(item => Number(item.year) >= 1898 && Number(item.year) <= 1945)
  },
  {
    id: 'era-modern',
    name: 'Modern Era',
    range: '1993–2025',
    items: timeline.filter(item => Number(item.year) > 1945)
  }
]

// city.json source strings embed their URLs in parentheses; toSourceReference
// also normalizes the em-dashes the dataset carries.
const profileSources: SourceReference[] = cityData.sources.map(toSourceReference)
</script>

<template>
  <div data-pagefind-filter="type:history" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-12">
    <!-- Header -->
    <header class="max-w-3xl space-y-4">
      <p class="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-rose-accent-dark">
        <CivicRoseMotif :size="16" class="text-rose-accent" />
        Santa Rosa City, Laguna
      </p>
      <h1 class="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-laguna-green leading-tight">
        From Bukol to Modern Santa Rosa
      </h1>
      <div class="flex flex-wrap items-center gap-2">
        <DataSourceBadge type="official" />
      </div>
      <p class="text-base sm:text-lg leading-relaxed text-charcoal/80">
        Over 450 years of civic history: from an agrarian lakeside settlement named Barrio Bukol, to emancipation as a municipality in 1792, through revolutionary sacrifice, post-war rebirth, and transformation into a premier economic center.
      </p>
      <DataLastVerified :date="lastVerified" :show-state="false" />
    </header>

    <!-- Era jump navigation -->
    <nav aria-label="Jump to era" class="flex flex-wrap gap-2">
      <a
        v-for="era in eras"
        :key="era.id"
        :href="`#${era.id}`"
        class="inline-flex items-center gap-1.5 rounded-full border border-laguna-green/25 bg-laguna-green/5 px-3.5 py-1.5 text-xs font-semibold text-laguna-green transition-colors hover:bg-laguna-green/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
      >
        {{ era.name }}
        <span class="font-normal text-charcoal/60">{{ era.range }}</span>
      </a>
    </nav>

    <!-- Historical timeline, one section per era -->
    <section
      v-for="era in eras"
      :key="era.id"
      :id="era.id"
      :aria-labelledby="`${era.id}-heading`"
      class="rounded-2xl border border-charcoal/10 bg-white p-6 sm:p-12 shadow-sm scroll-mt-24"
    >
      <h2 :id="`${era.id}-heading`" class="mb-8 font-serif text-2xl sm:text-3xl font-bold tracking-tight text-laguna-green">
        {{ era.name }}
        <span class="font-sans text-base sm:text-lg font-medium text-charcoal/60">({{ era.range }})</span>
      </h2>
      <CivicTimeline :items="era.items" theme="light" />
    </section>

    <!-- Source Notes -->
    <section aria-labelledby="history-sources-heading" class="rounded-xl border border-charcoal/10 bg-parchment p-6 sm:p-8 space-y-4">
      <h2 id="history-sources-heading" class="font-serif text-xl font-bold text-laguna-green">
        Sources and Historical References
      </h2>
      <p class="text-sm text-charcoal/70 leading-relaxed">
        Timeline entries are drawn directly from official municipal publications, the 2025 Voluntary Local Review, Republic Acts, and verified archival records.
      </p>
      <ul class="flex flex-wrap gap-2">
        <li v-for="s in profileSources" :key="s.title">
          <DataSourceCitation :source="s" :verified-date="lastVerified" />
        </li>
      </ul>
    </section>
  </div>
</template>
