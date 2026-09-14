<script setup lang="ts">
import servicesData from '~/data/services.json'
import DataSourceBadge from '~/components/data/SourceBadge.vue'
import DataSourceCitation from '~/components/data/SourceCitation.vue'
import DataLastVerified from '~/components/data/LastVerified.vue'
import { toSourceReference } from '~/utils/source'
import { buildSeoHead } from '~/utils/seo'
import { ServiceSchema, type Service } from '~/types/civic'

// Auto-imports are Nuxt-only; the guard keeps this page mountable under plain Vitest.
if (typeof useHead === 'function') {
  useHead(buildSeoHead({
    title: 'Public Services Directory — Better Santa Rosa City',
    description: 'Directory of official City of Santa Rosa government services — permits, taxes, civil registry, health and online services — each linked to its official destination.',
    path: '/services'
  }))
}

const services = servicesData as Service[]

// Section order follows the schema enum — the spec §17 category list.
const SERVICE_CATEGORIES = ServiceSchema.shape.category.options

const grouped = SERVICE_CATEGORIES.map(category => ({
  category,
  services: services.filter(s => s.category === category)
}))

function categoryAnchor(category: string): string {
  return `category-${category.toLowerCase().replace(/\s+/g, '-')}`
}

const lastVerified = services.map(s => s.lastVerified).sort().at(-1)
</script>

<template>
  <div data-pagefind-filter="type:services" class="flex flex-col gap-12">
    <header class="max-w-3xl space-y-3">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-rose-accent">
        Santa Rosa City, Laguna
      </p>
      <h1 class="font-serif text-3xl font-bold tracking-tight text-laguna-green sm:text-4xl">
        Public Services Directory
      </h1>
      <div class="flex flex-wrap items-center gap-2">
        <DataSourceBadge type="official" />
      </div>
      <p class="text-sm leading-relaxed text-charcoal/70 sm:text-base">
        Every entry here links out to the city government's own service pages —
        marked <span class="font-medium">Official Government Service</span> — so
        you always land on the official destination. Better Santa Rosa does not
        recreate transactional services; it points you to them and cites the
        source each entry was verified against.
      </p>
      <DataLastVerified v-if="lastVerified" :date="lastVerified" :show-state="false" />
    </header>

    <section
      v-for="group in grouped"
      :key="group.category"
      :aria-labelledby="categoryAnchor(group.category)"
    >
      <div class="flex items-baseline justify-between gap-2 border-b border-charcoal/10 pb-2">
        <h2 :id="categoryAnchor(group.category)" class="font-serif text-2xl font-bold tracking-tight text-laguna-green">
          {{ group.category }}
        </h2>
        <span class="text-xs font-medium text-charcoal/50">
          {{ group.services.length }} service{{ group.services.length === 1 ? '' : 's' }}
        </span>
      </div>

      <ul v-if="group.services.length" class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="service in group.services" :key="service.id">
          <!-- id=service.id is a forward contract: /services#<id> anchors from
               search and external links resolve to this card. -->
          <article
            :id="service.id"
            class="flex h-full flex-col rounded-lg border border-charcoal/10 bg-white p-5 shadow-sm scroll-mt-24"
          >
            <span class="inline-flex w-fit items-center rounded border border-laguna-green/20 bg-laguna-green/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-laguna-green">
              Official Government Service
            </span>

            <h3 class="mt-3 font-serif text-lg font-bold leading-snug text-charcoal">
              {{ service.title }}
            </h3>
            <p class="mt-2 text-sm leading-relaxed text-charcoal/70">
              {{ service.description }}
            </p>

            <div v-if="service.requirements?.length" class="mt-3">
              <h4 class="text-xs font-semibold uppercase tracking-wide text-charcoal/60">
                Requirements
              </h4>
              <ul class="mt-1 list-disc space-y-1 pl-5 text-sm text-charcoal/70">
                <li v-for="req in service.requirements" :key="req">{{ req }}</li>
              </ul>
            </div>

            <div class="mt-auto space-y-3 pt-4">
              <a
                :href="service.officialUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-block rounded-md bg-laguna-green px-3 py-2 text-sm font-semibold text-white transition hover:bg-laguna-green/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-laguna-green"
                :aria-label="`Open official page for ${service.title} (opens in new tab)`"
              >Go to the official service ↗</a>
              <div>
                <DataSourceCitation
                  :source="toSourceReference(service.source)"
                  :verified-date="service.lastVerified"
                />
              </div>
            </div>
          </article>
        </li>
      </ul>
      <p v-else class="mt-6 rounded-md border border-charcoal/10 bg-white p-6 text-center text-sm text-charcoal/70">
        No services cataloged under this category yet.
      </p>
    </section>

    <p class="text-xs text-charcoal/60">
      This directory lists selected services verified against the cited official
      pages — transactions are completed on the city government's own sites,
      never here.
    </p>
  </div>
</template>
