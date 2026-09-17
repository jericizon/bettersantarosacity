<script setup lang="ts">
import barangaysData from '~/data/barangays.json'
import projectsData from '~/data/projects.json'
import DataStatCard from '~/components/data/StatCard.vue'
import DataLastVerified from '~/components/data/LastVerified.vue'
import DataSourceCitation from '~/components/data/SourceCitation.vue'
import ProjectsProjectStatus from '~/components/projects/ProjectStatus.vue'
import { buildSeoHead, SITE_URL } from '~/utils/seo'
import { formatPeso } from '~/utils/currency'
import { toSourceReference, toSourceReferences } from '~/utils/source'
import type { Barangay, Project } from '~/types/civic'

// useRoute/createError/useHead are Nuxt auto-imports; guards keep this page
// importable under plain Vitest where the auto-import globals do not exist.
const slug = typeof useRoute === 'function' ? String(useRoute().params.slug ?? '') : ''

const barangay = (barangaysData as Barangay[]).find(b => b.slug === slug)

if (!barangay && typeof createError === 'function') {
  throw createError({
    statusCode: 404,
    statusMessage: `No barangay found for "${slug}"`,
    fatal: true
  })
}

if (typeof useHead === 'function') {
  useHead(buildSeoHead({
    title: `Barangay ${barangay?.name ?? 'Not Found'} · Better Santa Rosa City`,
    description: barangay?.description ?? 'Barangay profile for Santa Rosa City, Laguna.',
    path: `/barangays/${slug}`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Barangays', item: `${SITE_URL}/barangays` },
        { '@type': 'ListItem', position: 3, name: barangay?.name ?? 'Barangay' }
      ]
    }
  }))
}

// Known projects: strict case-insensitive match on the project barangay field.
// "Citywide"/"Multiple barangays" records are not attributed to one barangay.
const knownProjects = ((projectsData as Project[]).filter(
  p => p.barangay.trim().toLowerCase() === (barangay?.name.trim().toLowerCase() ?? '')
))

const formattedPopulation =
  barangay?.population != null ? barangay.population.toLocaleString('en-US') : null

const hasCoordinates = barangay?.latitude != null && barangay?.longitude != null

const osmUrl = hasCoordinates
  ? `https://www.openstreetmap.org/?mlat=${barangay?.latitude}&mlon=${barangay?.longitude}#map=15/${barangay?.latitude}/${barangay?.longitude}`
  : null

// source strings hold "Title (url); Title (url)" — split into citation records.
const sourceRefs = barangay ? toSourceReferences(barangay.source) : []

const GROUP_BADGE_CLASSES: Record<string, string> = {
  'Laguna Lake': 'bg-laguna-blue/15 text-laguna-blue border-laguna-blue/30',
  'Lowland Urban': 'bg-laguna-green/10 text-laguna-green border-laguna-green/20',
  'Upper / Tagaytay': 'bg-heritage-gold/20 text-charcoal border-heritage-gold/40'
}
</script>

<template>
  <div v-if="barangay" data-pagefind-filter="type:barangays" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-10">
    <nav aria-label="Breadcrumb">
      <NuxtLink
        to="/barangays"
        class="rounded-sm text-sm font-semibold text-laguna-green underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
      >← All barangays</NuxtLink>
    </nav>

    <header class="max-w-3xl space-y-3">
      <div class="flex flex-wrap items-center gap-3">
        <h1 class="font-serif text-3xl font-bold tracking-tight text-laguna-green sm:text-4xl">
          Barangay {{ barangay.name }}
        </h1>
        <span
          class="inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium"
          :class="GROUP_BADGE_CLASSES[barangay.group] ?? 'bg-charcoal/10 text-charcoal/70 border-charcoal/20'"
        >{{ barangay.group }}</span>
      </div>
      <DataLastVerified :date="barangay.lastVerified" />
      <p class="text-sm leading-relaxed text-charcoal/75 sm:text-base">
        {{ barangay.description }}
      </p>
    </header>

    <section aria-labelledby="stats-heading" class="space-y-4">
      <h2 id="stats-heading" class="font-serif text-2xl font-bold tracking-tight text-laguna-green">
        Public statistics
      </h2>
      <div v-if="formattedPopulation" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DataStatCard
          :value="formattedPopulation"
          label="Population"
          note="2020 PSA Census of Population and Housing"
          source="Philippine Statistics Authority via PhilAtlas"
          variant="card"
        />
      </div>
      <p v-else class="rounded-lg border border-charcoal/10 bg-white p-5 text-sm italic text-charcoal/70">
        Information unavailable in the source reviewed
      </p>
    </section>

    <section aria-labelledby="map-heading" class="space-y-4">
      <h2 id="map-heading" class="font-serif text-2xl font-bold tracking-tight text-laguna-green">
        Map location
      </h2>
      <div v-if="hasCoordinates" class="rounded-lg border border-charcoal/10 bg-white p-5 shadow-sm">
        <p class="text-sm text-charcoal/80">
          Approximate location:
          <span class="font-medium">{{ barangay.latitude }}, {{ barangay.longitude }}</span>
        </p>
        <a
          v-if="osmUrl"
          :href="osmUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="mt-2 inline-block rounded-sm text-sm font-semibold text-rose-accent-dark hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
        >View on OpenStreetMap ↗</a>
        <p class="mt-3 text-xs text-charcoal/70">
          Coordinates as reported in the cited source. An interactive map will be added once
          authoritative GIS boundary data is available.
        </p>
      </div>
      <p v-else class="rounded-lg border border-charcoal/10 bg-white p-5 text-sm italic text-charcoal/70">
        Map location unavailable in the source reviewed
      </p>
    </section>

    <section aria-labelledby="projects-heading" class="space-y-4">
      <h2 id="projects-heading" class="font-serif text-2xl font-bold tracking-tight text-laguna-green">
        Known projects
      </h2>
      <ul v-if="knownProjects.length" class="grid gap-4 md:grid-cols-2">
        <li
          v-for="p in knownProjects"
          :key="p.id"
          class="flex flex-col rounded-lg border border-charcoal/10 bg-white p-5 shadow-sm"
        >
          <div class="flex flex-wrap items-center gap-2">
            <ProjectsProjectStatus :status="p.status" />
            <span class="text-[11px] font-medium uppercase tracking-wide text-charcoal/80">{{ p.category }}</span>
            <span v-if="p.year" class="text-[11px] text-charcoal/80">{{ p.year }}</span>
          </div>
          <h3 class="mt-3 font-serif text-lg font-bold leading-snug text-charcoal">{{ p.name }}</h3>
          <p class="mt-2 text-sm leading-relaxed text-charcoal/70">{{ p.description }}</p>
          <p class="mt-3 text-sm font-medium text-charcoal">
            <template v-if="p.budgetPhp != null">{{ formatPeso(p.budgetPhp) }} reported</template>
            <template v-else>Cost not disclosed in sources reviewed</template>
          </p>
          <div class="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4 text-[11px] text-charcoal/80">
            <span v-if="p.sources.at(0)">Source: {{ toSourceReference(p.sources.at(0) ?? '').title }}</span>
            <DataLastVerified :date="p.lastVerified" :show-state="false" />
          </div>
        </li>
      </ul>
      <p v-else class="rounded-lg border border-charcoal/10 bg-white p-5 text-sm italic text-charcoal/70">
        No projects recorded for this barangay in the sources reviewed.
      </p>
    </section>

    <section aria-labelledby="sources-heading" class="space-y-4">
      <h2 id="sources-heading" class="font-serif text-2xl font-bold tracking-tight text-laguna-green">
        Sources
      </h2>
      <ul class="flex flex-wrap gap-2">
        <li v-for="s in sourceRefs" :key="s.title">
          <DataSourceCitation :source="s" :verified-date="barangay.lastVerified" />
        </li>
      </ul>
      <p class="text-xs text-charcoal/70">
        Population figures are from the 2020 PSA Census of Population and Housing as compiled by the
        cited sources. Statistics not shown here were unavailable in the sources reviewed.
      </p>
    </section>
  </div>
</template>
