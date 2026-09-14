<script setup lang="ts">
import cityData from '~/data/city.json'
import barangaysData from '~/data/barangays.json'
import sourcesData from '~/data/sources.json'
import CivicTimeline from '~/components/civic/Timeline.vue'
import DataStatCard from '~/components/data/StatCard.vue'
import DataSourceCitation from '~/components/data/SourceCitation.vue'
import DataLastVerified from '~/components/data/LastVerified.vue'
import { toSourceReference } from '~/utils/source'
import { buildSeoHead } from '~/utils/seo'
import type { Barangay, SourceReference } from '~/types/civic'

// Auto-imports are Nuxt-only; the guard keeps this page mountable under plain Vitest.
if (typeof useHead === 'function') {
  useHead(buildSeoHead({
    title: 'Explore Santa Rosa — City profile and history — Better Santa Rosa City',
    description:
      'The story and shape of Santa Rosa City, Laguna — from Barrio Bukol to cityhood, its 18 barangays, Laguna Lake frontage, and industrial economy.',
    path: '/explore'
  }))
}

const barangays = barangaysData as Barangay[]

// --- Section 2: Santa Rosa at a glance -----------------------------------------

// 2020 population is the sum of the 18 barangay-level PSA census counts.
const population2020 = barangays.reduce((sum, b) => sum + (b.population ?? 0), 0)

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
    note: 'Plebiscite July 10, 2004 · RA 9264',
    source: 'Republic Act No. 9264'
  },
  {
    value: population2020.toLocaleString('en-US'),
    label: 'Population (2020 census)',
    note: 'PSA 2024 census: 430,920',
    source: 'PSA 2020 Census via PhilAtlas'
  }
]

// --- Section 3: history ---------------------------------------------------------

const timeline = cityData.timeline

// --- Section 4: geography & Laguna Lake -------------------------------------------

const lakeBarangays = barangays.filter(b => b.group === 'Laguna Lake')

// --- Section 6: landmarks ----------------------------------------------------------

// Landmark claims are drawn from the corresponding barangay descriptions.
const landmarks = [
  {
    name: 'Enchanted Kingdom',
    kind: 'Theme park',
    slug: 'balibago',
    barangayName: 'Balibago',
    description:
      'Theme park in Barangay Balibago along the National Highway corridor — the city\'s signature visitor attraction.'
  },
  {
    name: 'Cuartel de Santo Domingo',
    kind: 'Historic site',
    slug: 'santo-domingo',
    barangayName: 'Santo Domingo',
    description:
      'A Spanish-era Guardia Civil bastion near the Silang, Cavite boundary, in the upland barangay of Santo Domingo.'
  },
  {
    name: 'Nuvali',
    kind: 'Mixed-use estate',
    slug: 'don-jose',
    barangayName: 'Don Jose',
    description:
      'The Ayala Land mixed-use estate in the city\'s upland barangays; Barangay Don Jose covers part of the development area.'
  }
]

// --- Sources -----------------------------------------------------------------------

// city.json source strings embed their URLs in parentheses.
const profileSources: SourceReference[] = cityData.sources.map(toSourceReference)

// The 2025 Voluntary Local Review backs the economy section's recent figures.
const vlrSource = profileSources.at(2)

const censusSources: SourceReference[] = sourcesData
  .filter(s => s.id === 'psa' || s.id === 'philatlas')
  .map(s => ({ title: s.name, url: s.url }))
</script>

<template>
  <div data-pagefind-filter="type:pages" class="flex flex-col gap-16 md:gap-24">
    <!-- 1 — Hero -->
    <section aria-labelledby="hero-heading" class="pt-2 md:pt-6">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-rose-accent-dark">
        City profile · Santa Rosa City, Laguna
      </p>
      <h1
        id="hero-heading"
        class="mt-3 max-w-3xl font-serif text-4xl font-bold leading-tight tracking-tight text-laguna-green sm:text-5xl"
      >
        Explore Santa Rosa
      </h1>
      <p class="mt-4 max-w-2xl font-serif text-lg italic leading-relaxed text-charcoal/70">
        Two centuries as a lakeside barrio of Biñan, a farming and fishing town, an
        industrial anchor of Laguna — and since 2004 a city in its own right.
      </p>
      <p class="mt-4 max-w-2xl text-base leading-relaxed text-charcoal/75">
        This profile covers the city's history, geography, people and economy.
        Every claim traces to an authoritative source; anything we cannot verify
        is labeled or left out.
      </p>
      <DataLastVerified :date="cityData.lastVerified" class="mt-6" />
    </section>

    <!-- 2 — Santa Rosa at a glance -->
    <section aria-labelledby="glance-heading">
      <h2 id="glance-heading" class="font-serif text-3xl font-bold tracking-tight text-laguna-green">
        Santa Rosa at a glance
      </h2>
      <p class="mt-1 text-sm text-charcoal/70">
        The city's core figures — each carries its source.
      </p>
      <div class="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <DataStatCard
          v-for="stat in cityStats"
          :key="stat.label"
          :value="stat.value"
          :label="stat.label"
          :source="stat.source"
          :note="stat.note"
        />
      </div>
      <div class="mt-4 flex flex-wrap items-center gap-2">
        <DataSourceCitation
          v-for="s in censusSources"
          :key="s.title"
          :source="s"
          :verified-date="cityData.lastVerified"
        />
      </div>
    </section>

    <!-- 3 — History -->
    <section aria-labelledby="history-heading">
      <h2 id="history-heading" class="font-serif text-3xl font-bold tracking-tight text-laguna-green">
        From Barrio Bukol to Modern Santa Rosa
      </h2>
      <p class="mt-1 max-w-3xl text-sm leading-relaxed text-charcoal/70">
        The city government's published historical timeline, from its days as a
        sitio of Biñan called Barrio Bukol through cityhood in 2004 and today's
        growth — edited only for length, never for substance.
      </p>
      <CivicTimeline :items="timeline" class="mt-8" />
      <div class="mt-6 flex flex-wrap items-center gap-2">
        <DataSourceCitation
          v-for="s in profileSources.slice(0, 2)"
          :key="s.title"
          :source="s"
          :verified-date="cityData.lastVerified"
        />
      </div>
    </section>

    <!-- 4 — Geography & Laguna Lake -->
    <section aria-labelledby="geography-heading">
      <h2 id="geography-heading" class="font-serif text-3xl font-bold tracking-tight text-laguna-green">
        Geography &amp; Laguna Lake
      </h2>
      <p class="mt-2 max-w-3xl text-sm leading-relaxed text-charcoal/75 sm:text-base">
        Santa Rosa's {{ cityData.barangayCount }} barangays fall into three
        geographic groupings. A lakeside band fronts Laguna de Bay; the
        <span class="font-medium">Lowland Urban</span> barangays line the National
        Highway corridor and the old town center; and the
        <span class="font-medium">Upper / Tagaytay</span> barangays climb the
        ridge toward the Silang, Cavite boundary.
      </p>
      <p class="mt-3 max-w-3xl text-sm leading-relaxed text-charcoal/75 sm:text-base">
        Three barangays face the lake — Aplaya, Caingin and Sinalhan — the
        shoreline communities whose fishing grounds sustained the settlement long
        before industrialization.
      </p>

      <ul class="mt-6 grid gap-4 sm:grid-cols-3">
        <li
          v-for="b in lakeBarangays"
          :key="b.slug"
          class="rounded-lg border border-charcoal/10 bg-white p-5 shadow-sm"
        >
          <div class="flex items-baseline justify-between gap-2">
            <h3 class="font-serif text-lg font-bold text-charcoal">{{ b.name }}</h3>
            <span class="text-xs font-medium text-laguna-blue">Laguna Lake</span>
          </div>
          <p class="mt-1 text-xs text-charcoal/70">
            Lakeside barangay fronting Laguna de Bay.
          </p>
          <p v-if="b.population != null" class="mt-3 font-serif text-xl font-bold text-laguna-green">
            {{ b.population.toLocaleString('en-US') }}
            <span class="font-sans text-xs font-medium text-charcoal/70">residents (2020)</span>
          </p>
          <NuxtLink
            :to="`/barangays#${b.slug}`"
            class="mt-3 inline-block rounded-sm text-xs font-semibold text-laguna-green underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
          >
            Barangay profile →
          </NuxtLink>
        </li>
      </ul>

      <NuxtLink
        to="/barangays"
        class="mt-5 inline-block rounded-sm text-sm font-semibold text-laguna-green underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
      >
        Browse all {{ cityData.barangayCount }} barangays →
      </NuxtLink>
      <div class="mt-4 flex flex-wrap items-center gap-2">
        <DataSourceCitation
          :source="{ title: 'City Government of Santa Rosa — About Us', url: 'https://santarosacity.gov.ph/about-us' }"
          :verified-date="cityData.lastVerified"
        />
        <DataSourceCitation
          v-for="s in censusSources.slice(1)"
          :key="s.title"
          :source="s"
        />
      </div>
    </section>

    <!-- 5 — Economy & modern identity -->
    <section aria-labelledby="economy-heading">
      <h2 id="economy-heading" class="font-serif text-3xl font-bold tracking-tight text-laguna-green">
        Economy &amp; modern identity
      </h2>
      <div class="mt-3 max-w-3xl space-y-4 text-sm leading-relaxed text-charcoal/75 sm:text-base">
        <p>
          The timeline tells the arc plainly: when Santa Rosa's income reached
          ₱54.2&nbsp;million in 1993 it became a first-class municipality; eleven
          years later it was a city. By FY2024, Commission on Audit-reported
          revenue reached ₱6.251&nbsp;billion — reported as the largest of any
          city in Luzon outside Metro Manila.
        </p>
        <p>
          Santa Rosa sits along the South Luzon Expressway corridor at the
          southern edge of the Metro Manila growth belt, and its industrial
          identity is anchored by named, sourced developments: the Toyota
          Special Economic Zone in Pulong Santa Cruz; the Nuvali estate in the
          upland barangays, where Ayala Land and the city signed a 2025
          memorandum of understanding for a planned Santa Rosa Civic Complex;
          and the VITRO Santa Rosa hyperscale data center inaugurated in
          April 2025.
        </p>
        <p>
          Tourism is anchored by Enchanted Kingdom in Balibago, while the
          Spanish-era Cuartel de Santo Domingo marks the city's upland edge.
        </p>
        <p class="rounded-lg border border-heritage-gold/30 bg-heritage-gold/10 p-4 text-xs leading-relaxed text-charcoal/70">
          Honest gap: detailed industrial-park inventories, employment counts,
          and visitor statistics are not yet compiled here from authoritative
          sources — only claims tied to the cited datasets above are shown.
        </p>
      </div>
      <div class="mt-5 flex flex-wrap items-center gap-2">
        <DataSourceCitation
          v-if="vlrSource"
          :source="vlrSource"
          :verified-date="cityData.lastVerified"
        />
        <DataSourceCitation
          :source="{ title: 'City Government of Santa Rosa — About Us', url: 'https://santarosacity.gov.ph/about-us' }"
        />
        <DataLastVerified :date="cityData.lastVerified" :show-state="false" />
      </div>
    </section>

    <!-- 6 — Landmarks & destinations -->
    <section aria-labelledby="landmarks-heading">
      <h2 id="landmarks-heading" class="font-serif text-3xl font-bold tracking-tight text-laguna-green">
        Landmarks &amp; destinations
      </h2>
      <p class="mt-1 text-sm text-charcoal/70">
        The places the city's own records and sourced profiles name.
      </p>
      <ul class="mt-6 grid gap-4 md:grid-cols-3">
        <li
          v-for="l in landmarks"
          :key="l.name"
          class="flex flex-col rounded-lg border border-charcoal/10 bg-white p-5 shadow-sm"
        >
          <span class="text-[10px] font-semibold uppercase tracking-wide text-charcoal/80">
            {{ l.kind }}
          </span>
          <h3 class="mt-1 font-serif text-lg font-bold leading-snug text-charcoal">{{ l.name }}</h3>
          <p class="mt-2 text-xs leading-relaxed text-charcoal/70">{{ l.description }}</p>
          <NuxtLink
            :to="`/barangays#${l.slug}`"
            class="mt-auto inline-block pt-3 text-xs font-semibold text-laguna-green underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green rounded-sm"
          >
            Barangay {{ l.barangayName }} →
          </NuxtLink>
        </li>
      </ul>
    </section>

    <!-- 7 — Sources & verification -->
    <section
      aria-labelledby="sources-heading"
      class="rounded-2xl border border-charcoal/10 bg-white p-6 shadow-sm sm:p-10"
    >
      <h2 id="sources-heading" class="font-serif text-2xl font-bold tracking-tight text-laguna-green">
        Sources &amp; verification
      </h2>
      <p class="mt-3 max-w-3xl text-sm leading-relaxed text-charcoal/80">
        Every statement on this page traces to one of the records below, or to
        the per-barangay sources in the barangays dataset. Claims we cannot tie
        to an authoritative source are labeled or omitted.
      </p>
      <ul class="mt-5 flex flex-wrap gap-2">
        <li v-for="s in [...profileSources, ...censusSources]" :key="s.title">
          <DataSourceCitation :source="s" :verified-date="cityData.lastVerified" />
        </li>
      </ul>
      <div class="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
        <DataLastVerified :date="cityData.lastVerified" />
        <NuxtLink
          to="/sources"
          class="rounded-sm text-sm font-semibold text-laguna-green underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
        >
          See the full source registry →
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
