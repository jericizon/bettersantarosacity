<script setup lang="ts">
import CivicRoseMotif from '~/components/civic/RoseMotif.vue'
import DataSourceBadge from '~/components/data/SourceBadge.vue'
import { buildSeoHead } from '~/utils/seo'

if (typeof useHead === 'function') {
  useHead(buildSeoHead({
    title: 'About · Better Santa Rosa City',
    description: 'Learn about Better Santa Rosa City: an independent, community-maintained public information portal for Santa Rosa, Laguna.',
    path: '/about',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'About Better Santa Rosa City',
      description: 'Independent civic transparency and public records project for Santa Rosa City, Laguna.'
    }
  }))
}

const principles = [
  {
    title: 'Facts Before Opinions',
    desc: 'We present factual public data without political commentary, candidate scoring, or municipal rankings. Civic data belongs to the public.'
  },
  {
    title: 'Source-First Verification',
    desc: 'Every key claim, budget figure, and demographic statistic links back to its primary official source (COA, PSA, DBM, City Ordinances) and carries a verification date.'
  },
  {
    title: 'Preserve Definitions',
    desc: 'We never conflate city revenue with total budget, allocations with actual spending, or project proposals with completed works. Gaps are acknowledged, never invented.'
  },
  {
    title: 'Static & Independent',
    desc: 'Built as a static-first portal deployed at zero runtime cost. Completely independent from any political group or municipal office.'
  }
]
</script>

<template>
  <div data-pagefind-filter="type:about" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-12">
    <!-- Header -->
    <header class="space-y-4">
      <p class="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-rose-accent-dark">
        <CivicRoseMotif :size="16" class="text-rose-accent" />
        Independent Public-Information Layer
      </p>
      <h1 class="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-laguna-green leading-tight">
        About Better Santa Rosa City
      </h1>
      <div class="flex flex-wrap items-center gap-2">
        <DataSourceBadge type="community" />
      </div>
      <p class="text-base sm:text-lg leading-relaxed text-charcoal/80">
        Better Santa Rosa City is an independent, open-data civic portal designed to make public records about Santa Rosa, Laguna easier to discover, understand, and verify.
      </p>
    </header>

    <!-- Independence Notice Callout -->
    <section aria-label="Legal Status and Disclaimer" class="rounded-xl border-2 border-heritage-gold/50 bg-heritage-gold/10 p-6 sm:p-8 space-y-3">
      <h2 class="font-serif text-xl font-bold text-laguna-green">
        Non-Governmental Independence Notice
      </h2>
      <p class="text-sm leading-relaxed text-charcoal/90">
        Better Santa Rosa City is community-maintained and is <strong>not an official website of the City Government of Santa Rosa</strong>. It is not affiliated with, authorized, or endorsed by the municipal government, any barangay council, or any government agency.
      </p>
      <p class="text-xs leading-relaxed text-charcoal/70">
        All government services, official requests, and tax payments must be completed through official City Government channels. Visit the official portal at
        <a href="https://santarosacity.gov.ph" target="_blank" rel="noopener noreferrer" class="font-semibold underline text-laguna-green hover:text-rose-accent-dark">
          santarosacity.gov.ph ↗
        </a>.
      </p>
    </section>

    <!-- Core Data Principles -->
    <section aria-labelledby="principles-heading" class="space-y-6">
      <h2 id="principles-heading" class="font-serif text-2xl font-bold text-laguna-green">
        Our Operating Principles
      </h2>
      <div class="grid gap-4 sm:grid-cols-2">
        <article v-for="p in principles" :key="p.title" class="rounded-xl border border-charcoal/10 bg-white p-5 shadow-sm space-y-2">
          <h3 class="font-serif text-base font-bold text-charcoal">{{ p.title }}</h3>
          <p class="text-xs leading-relaxed text-charcoal/70">{{ p.desc }}</p>
        </article>
      </div>
    </section>

    <!-- Corrections & Community Feedback -->
    <section aria-labelledby="corrections-heading" class="rounded-xl border border-charcoal/10 bg-white p-6 sm:p-8 space-y-4 shadow-sm">
      <h2 id="corrections-heading" class="font-serif text-2xl font-bold text-laguna-green">
        Submit a Correction or Data Update
      </h2>
      <p class="text-sm leading-relaxed text-charcoal/75">
        Civic accuracy depends on vigilance. If you find an outdated figure, broken document link, or factual inaccuracy, please submit a correction.
      </p>
      <div class="flex flex-wrap items-center gap-4 pt-2">
        <a
          href="https://github.com/jericizon/bettersantarosacity/issues"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex min-h-11 items-center justify-center rounded-lg bg-laguna-green px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-laguna-green/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
        >
          Open GitHub Issue ↗
        </a>
        <NuxtLink
          to="/sources"
          class="inline-flex min-h-11 items-center justify-center rounded-lg border border-charcoal/20 bg-white px-5 py-2.5 text-sm font-semibold text-charcoal transition hover:border-laguna-green hover:text-laguna-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
        >
          Review Data Sources & Methodology
        </NuxtLink>
      </div>
    </section>

    <!-- Related Links -->
    <nav aria-label="About sub-navigation" class="border-t border-charcoal/10 pt-6 flex flex-wrap gap-4 text-xs font-semibold text-laguna-green">
      <NuxtLink to="/about/media" class="underline hover:text-rose-accent-dark">
        Media &amp; Image Licensing Credits →
      </NuxtLink>
      <NuxtLink to="/sources" class="underline hover:text-rose-accent-dark">
        Source Registry &amp; Verification Tiers →
      </NuxtLink>
      <NuxtLink to="/data" class="underline hover:text-rose-accent-dark">
        Open Data Downloads →
      </NuxtLink>
    </nav>
  </div>
</template>
