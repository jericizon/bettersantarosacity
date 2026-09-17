<script setup lang="ts">
import cityData from '~/data/city.json'
import CivicTimeline from '~/components/civic/Timeline.vue'
import CivicRoseMotif from '~/components/civic/RoseMotif.vue'
import DataSourceBadge from '~/components/data/SourceBadge.vue'
import DataLastVerified from '~/components/data/LastVerified.vue'
import { buildSeoHead } from '~/utils/seo'

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
const sources = cityData.sources
const lastVerified = cityData.lastVerified
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

    <!-- Historical Timeline Chapter -->
    <section aria-label="Chronological Timeline" class="rounded-2xl border border-charcoal/10 bg-white p-6 sm:p-12 shadow-sm">
      <CivicTimeline :items="timeline" theme="light" />
    </section>

    <!-- Source Notes -->
    <section aria-labelledby="history-sources-heading" class="rounded-xl border border-charcoal/10 bg-parchment p-6 sm:p-8 space-y-4">
      <h2 id="history-sources-heading" class="font-serif text-xl font-bold text-laguna-green">
        Sources and Historical References
      </h2>
      <p class="text-sm text-charcoal/70 leading-relaxed">
        Timeline entries are drawn directly from official municipal publications, the 2025 Voluntary Local Review, Republic Acts, and verified archival records.
      </p>
      <ul class="space-y-2 text-xs text-charcoal/80 list-disc pl-5">
        <li v-for="(source, idx) in sources" :key="idx">
          {{ source }}
        </li>
      </ul>
    </section>
  </div>
</template>
