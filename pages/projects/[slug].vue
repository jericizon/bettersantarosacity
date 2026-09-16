<script setup lang="ts">
import projectsData from '~/data/projects.json'
import ProjectsProjectStatus from '~/components/projects/ProjectStatus.vue'
import DataLastVerified from '~/components/data/LastVerified.vue'
import DataSourceCitation from '~/components/data/SourceCitation.vue'
import { formatPeso, formatPesoFull } from '~/utils/currency'
import { toSourceReference } from '~/utils/source'
import { buildSeoHead, SITE_URL } from '~/utils/seo'
import type { Project } from '~/types/civic'

// useRoute/createError/useHead are Nuxt auto-imports; guards keep this page
// importable under plain Vitest where the auto-import globals do not exist.
const slug = typeof useRoute === 'function' ? String(useRoute().params.slug ?? '') : ''

const project = (projectsData as Project[]).find(p => p.slug === slug)

if (!project && typeof createError === 'function') {
  throw createError({
    statusCode: 404,
    statusMessage: `No project found for "${slug}"`,
    fatal: true
  })
}

if (typeof useHead === 'function') {
  useHead(buildSeoHead({
    title: `${project?.name ?? 'Project Not Found'} · Better Santa Rosa City`,
    description: project?.description ?? 'City project record for Santa Rosa City, Laguna.',
    path: `/projects/${slug}`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Projects', item: `${SITE_URL}/projects` },
        { '@type': 'ListItem', position: 3, name: project?.name ?? 'Project' }
      ]
    }
  }))
}

const sourceRefs = project ? project.sources.map(toSourceReference) : []

// No coordinates exist in the dataset — the honest "map" is an external OSM
// search for the reported location string, labeled as such.
const osmSearchUrl = project?.location
  ? `https://www.openstreetmap.org/search?query=${encodeURIComponent(project.location)}`
  : null
</script>

<template>
  <div v-if="project" data-pagefind-filter="type:projects" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-10">
    <nav aria-label="Breadcrumb">
      <NuxtLink
        to="/projects"
        class="rounded-sm text-sm font-semibold text-laguna-green underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
      >← All projects</NuxtLink>
    </nav>

    <header class="max-w-3xl space-y-3">
      <div class="flex flex-wrap items-center gap-2">
        <ProjectsProjectStatus :status="project.status" />
        <span class="inline-flex items-center rounded border border-charcoal/20 bg-charcoal/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-charcoal/70">
          {{ project.category }}
        </span>
        <span v-if="project.year != null" class="text-xs text-charcoal/70">{{ project.year }}</span>
      </div>
      <h1 class="font-serif text-3xl font-bold tracking-tight text-laguna-green sm:text-4xl">
        {{ project.name }}
      </h1>
      <DataLastVerified :date="project.lastVerified" />
      <p class="text-sm leading-relaxed text-charcoal/75 sm:text-base">
        {{ project.description }}
      </p>
    </header>

    <section aria-labelledby="details-heading" class="space-y-4">
      <h2 id="details-heading" class="font-serif text-2xl font-bold tracking-tight text-laguna-green">
        Project details
      </h2>
      <dl class="grid gap-4 rounded-lg border border-charcoal/10 bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <dt class="text-xs font-semibold uppercase tracking-wide text-charcoal/70">Status</dt>
          <dd class="mt-1"><ProjectsProjectStatus :status="project.status" /></dd>
        </div>
        <div>
          <dt class="text-xs font-semibold uppercase tracking-wide text-charcoal/70">Barangay</dt>
          <dd class="mt-1 text-sm font-medium text-charcoal">{{ project.barangay }}</dd>
        </div>
        <div>
          <dt class="text-xs font-semibold uppercase tracking-wide text-charcoal/70">Category</dt>
          <dd class="mt-1 text-sm font-medium text-charcoal">{{ project.category }}</dd>
        </div>
        <div>
          <dt class="text-xs font-semibold uppercase tracking-wide text-charcoal/70">Implementing office</dt>
          <dd class="mt-1 text-sm font-medium text-charcoal">{{ project.implementingOffice }}</dd>
        </div>
        <div>
          <dt class="text-xs font-semibold uppercase tracking-wide text-charcoal/70">Timeline</dt>
          <dd class="mt-1 text-sm font-medium text-charcoal">
            <template v-if="project.year != null">Year reported in sources: {{ project.year }}</template>
            <template v-else><span class="italic text-charcoal/70">Timeline unavailable in the source reviewed</span></template>
          </dd>
        </div>
      </dl>
    </section>

    <section aria-labelledby="cost-heading" class="space-y-4">
      <h2 id="cost-heading" class="font-serif text-2xl font-bold tracking-tight text-laguna-green">
        Budget &amp; reported cost
      </h2>
      <div class="rounded-lg border border-charcoal/10 bg-white p-5 shadow-sm">
        <template v-if="project.budgetPhp != null">
          <p class="font-serif text-3xl font-bold tracking-tight text-laguna-green">
            {{ formatPeso(project.budgetPhp) }}
          </p>
          <p class="mt-1 text-sm font-medium text-charcoal">
            {{ formatPesoFull(project.budgetPhp) }} reported in the cited sources
          </p>
          <p class="mt-3 text-xs leading-relaxed text-charcoal/70">
            Scope of this figure (single project, aggregate allocation, or
            multi-year total) is as described above and in the source documents.
          </p>
        </template>
        <p v-else class="text-sm italic text-charcoal/70">
          Cost not disclosed in sources reviewed
        </p>
      </div>
    </section>

    <section aria-labelledby="location-heading" class="space-y-4">
      <h2 id="location-heading" class="font-serif text-2xl font-bold tracking-tight text-laguna-green">
        Location
      </h2>
      <div v-if="project.location" class="rounded-lg border border-charcoal/10 bg-white p-5 shadow-sm">
        <p class="text-sm text-charcoal/80">
          Reported location: <span class="font-medium">{{ project.location }}</span>
        </p>
        <a
          v-if="osmSearchUrl"
          :href="osmSearchUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="mt-2 inline-block rounded-sm text-sm font-semibold text-rose-accent-dark hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
        >Search this location on OpenStreetMap ↗</a>
        <p class="mt-3 text-xs text-charcoal/70">
          Precise project coordinates were not available in the sources reviewed;
          the link above opens an external map search for the reported location.
        </p>
      </div>
      <p v-else class="rounded-lg border border-charcoal/10 bg-white p-5 text-sm italic text-charcoal/70">
        Location unavailable in the source reviewed
      </p>
    </section>

    <section aria-labelledby="sources-heading" class="space-y-4">
      <h2 id="sources-heading" class="font-serif text-2xl font-bold tracking-tight text-laguna-green">
        Source documents
      </h2>
      <ul v-if="sourceRefs.length" class="flex flex-wrap gap-2">
        <li v-for="s in sourceRefs" :key="s.title">
          <DataSourceCitation :source="s" :verified-date="project.lastVerified" />
        </li>
      </ul>
      <p v-else class="rounded-lg border border-charcoal/10 bg-white p-5 text-sm italic text-charcoal/70">
        Source documents unavailable in the source reviewed
      </p>
      <p class="text-xs text-charcoal/70">
        Details not shown here were unavailable in the sources reviewed and are
        never filled in with assumptions.
      </p>
    </section>
  </div>
</template>
