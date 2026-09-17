<script setup lang="ts">
import { buildSeoHead } from '~/utils/seo'
import DataSourceBadge from '~/components/data/SourceBadge.vue'

// Auto-imports are Nuxt-only; the guard keeps this page mountable under plain Vitest.
if (typeof useHead === 'function') {
  useHead(buildSeoHead({
    title: 'Methodology & Standards · Better Santa Rosa City',
    description: 'How Better Santa Rosa City collects, verifies, and publishes public records, official advisories, and civic statistics.',
    path: '/about/methodology'
  }))
}
</script>

<template>
  <div data-pagefind-filter="type:about" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
    <header class="space-y-4">
      <NuxtLink to="/about" class="text-xs font-semibold uppercase tracking-wider text-rose-accent-dark hover:underline">
        ← About Better Santa Rosa
      </NuxtLink>
      <h1 class="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-laguna-green">
        Methodology &amp; Standards
      </h1>
      <p class="text-base sm:text-lg text-charcoal/80 leading-relaxed">
        Better Santa Rosa City is a community-maintained public information portal. Every record and metric we present follows strict principles of sourcing, verification, and non-partisanship.
      </p>
    </header>

    <div class="max-w-none space-y-10">
      <section class="space-y-3" aria-labelledby="m-collection">
        <h2 id="m-collection" class="font-serif text-2xl font-bold text-laguna-green">
          1. Source collection
        </h2>
        <p class="text-charcoal/80 leading-relaxed">
          Every dataset is compiled by hand from public records: audit reports, census releases, budget statements, ordinances and resolutions, and the official portals listed in the
          <NuxtLink to="/sources" class="font-semibold text-laguna-green hover:underline">source registry</NuxtLink>.
          There is no automated scraping: a person reads the source document and transcribes what it actually says.
        </p>
      </section>

      <section class="space-y-3" aria-labelledby="m-primary">
        <h2 id="m-primary" class="font-serif text-2xl font-bold text-laguna-green">
          2. Primary-source preference
        </h2>
        <p class="text-charcoal/80 leading-relaxed">
          We prioritize primary official records issued directly by government authorities. This includes Commission on Audit (COA) annual audit reports, Bureau of Local Government Finance (BLGF) fiscal statements, Philippine Statistics Authority (PSA) census data, Santa Rosa City Council ordinances and resolutions, and official department directories.
        </p>
        <div class="flex flex-wrap gap-2 items-center pt-1">
          <DataSourceBadge type="primary" organization="Official Government Record" />
          <DataSourceBadge type="official" organization="City Government of Santa Rosa" />
        </div>
      </section>

      <section class="space-y-3" aria-labelledby="m-secondary">
        <h2 id="m-secondary" class="font-serif text-2xl font-bold text-laguna-green">
          3. Secondary-source handling
        </h2>
        <p class="text-charcoal/80 leading-relaxed">
          When primary documents are unavailable, secondary sources such as reputable news publications, historical references, PhilAtlas, or Wikipedia may be referenced. Secondary sources are always explicitly identified and never visually conflated with official records.
        </p>
        <div class="pt-1">
          <DataSourceBadge type="secondary" organization="Third-Party Reference / News" />
        </div>
      </section>

      <section class="space-y-3" aria-labelledby="m-verification">
        <h2 id="m-verification" class="font-serif text-2xl font-bold text-laguna-green">
          4. Verification process
        </h2>
        <p class="text-charcoal/80 leading-relaxed">
          Every record carries a <code>lastVerified</code> date: the day it was last compared against its source. We preserve source definitions strictly: we do not label city revenue as the appropriation budget, nor do we present proposed projects as completed infrastructure.
        </p>
      </section>

      <section class="space-y-3" aria-labelledby="m-freshness">
        <h2 id="m-freshness" class="font-serif text-2xl font-bold text-laguna-green">
          5. Data freshness model
        </h2>
        <p class="text-charcoal/80 leading-relaxed">
          Datasets are audited on a scheduled basis, and a dataset is only as current as its stalest record. Freshness badges shown across the site are computed from each record's <code>lastVerified</code> date, so a stale record is visibly stale rather than silently wrong.
        </p>
      </section>

      <section class="space-y-3 p-6 rounded-lg bg-parchment border border-charcoal/10" aria-labelledby="m-corrections">
        <h2 id="m-corrections" class="font-serif text-xl font-bold text-laguna-green">
          6. Found an error?
        </h2>
        <p class="text-sm text-charcoal/80 leading-relaxed">
          Accuracy is our highest priority. If you identify a factual error, broken source link, or outdated record, please report it through our public GitHub repository so the correction can be tracked and verified.
        </p>
        <div class="pt-2 flex flex-wrap gap-4 text-sm">
          <a
            href="https://github.com/jericizon/bettersantarosacity/issues"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1 font-semibold text-laguna-green hover:underline"
          >
            Submit an issue on GitHub →
          </a>
        </div>
      </section>

      <section class="space-y-3" aria-labelledby="m-missing">
        <h2 id="m-missing" class="font-serif text-2xl font-bold text-laguna-green">
          7. Missing information
        </h2>
        <p class="text-charcoal/80 leading-relaxed">
          We never extrapolate or fabricate missing information. When a field is absent from reviewed sources, we explicitly state: <em>"Data not available in the source reviewed."</em> Broken original links are labeled <em>"Original source currently unavailable."</em>
        </p>
      </section>

      <section class="space-y-3" aria-labelledby="m-media">
        <h2 id="m-media" class="font-serif text-2xl font-bold text-laguna-green">
          8. Image licensing &amp; media credits
        </h2>
        <p class="text-charcoal/80 leading-relaxed">
          Every photograph and illustration on this site is used under its stated license, with author, source, and license recorded per asset. Full credits live on the
          <NuxtLink to="/about/media" class="font-semibold text-laguna-green hover:underline">media &amp; image licensing page</NuxtLink>.
        </p>
      </section>

      <section class="space-y-3" aria-labelledby="m-independence">
        <h2 id="m-independence" class="font-serif text-2xl font-bold text-laguna-green">
          9. Independent civic-information project
        </h2>
        <p class="text-charcoal/80 leading-relaxed">
          Better Santa Rosa City is an independent civic-information project, not affiliated with or operated by the City Government of Santa Rosa. We do not endorse political candidates, rank officials, assign municipal report-card scores, or publish editorial commentary. We present public records neutrally so residents can form their own judgments.
        </p>
      </section>
    </div>
  </div>
</template>
