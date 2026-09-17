<script setup lang="ts">
import { computed } from 'vue'
import placesData from '~/data/places.json'
import type { Place } from '~/types/civic'
import { buildSeoHead } from '~/utils/seo'
import DataLastVerified from '~/components/data/LastVerified.vue'
import { MapPin, ExternalLink } from 'lucide-vue-next'

// useRoute/useHead are Nuxt auto-imports; guards keep this page
// importable under plain Vitest where the auto-import globals do not exist.
const slug = typeof useRoute === 'function' ? String(useRoute().params.slug ?? '') : ''

const place = computed(() => (placesData as Place[]).find(p => p.slug === slug))

if (typeof useHead === 'function' && place.value) {
  useHead(buildSeoHead({
    title: `${place.value.title} · Better Santa Rosa City`,
    description: place.value.description,
    path: `/places/${place.value.slug}`
  }))
}
</script>

<template>
  <div v-if="place" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
    <nav aria-label="Breadcrumb" class="text-xs text-charcoal/60 flex items-center gap-2">
      <NuxtLink to="/places" class="hover:text-laguna-green">Places</NuxtLink>
      <span>/</span>
      <span class="text-charcoal font-medium">{{ place.title }}</span>
    </nav>

    <header class="space-y-3">
      <div class="flex flex-wrap items-center gap-2">
        <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-laguna-green/10 text-laguna-green">
          {{ place.category }}
        </span>
        <span class="text-xs text-charcoal/70 flex items-center gap-1">
          <MapPin :size="12" aria-hidden="true" />
          {{ place.location }}
        </span>
      </div>

      <h1 class="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-laguna-green">
        {{ place.title }}
      </h1>
      <p class="text-base sm:text-lg text-charcoal/80 leading-relaxed">
        {{ place.description }}
      </p>
      <DataLastVerified :date="place.lastVerified" />
    </header>

    <div class="space-y-6 text-sm text-charcoal/80 leading-relaxed border-t border-charcoal/10 pt-6">
      <div v-if="place.whyItMatters" class="space-y-2">
        <h2 class="font-serif text-xl font-bold text-charcoal">Why It Matters</h2>
        <p>{{ place.whyItMatters }}</p>
      </div>

      <div v-if="place.historicalContext" class="space-y-2">
        <h2 class="font-serif text-xl font-bold text-charcoal">Historical Context</h2>
        <p>{{ place.historicalContext }}</p>
      </div>

      <div class="space-y-2 pt-4 border-t border-charcoal/10">
        <h2 class="font-serif text-base font-bold text-charcoal">Sources & Reference</h2>
        <ul class="space-y-1.5 list-disc list-inside text-xs text-charcoal/70">
          <li v-for="source in place.sources" :key="source">{{ source }}</li>
        </ul>
        <div v-if="place.officialUrl" class="pt-2">
          <a
            :href="place.officialUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1 text-xs font-semibold text-laguna-green hover:underline"
          >
            <span>Visit official reference website</span>
            <ExternalLink :size="12" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="max-w-4xl mx-auto px-4 py-16 text-center text-charcoal/60">
    Place not found.
  </div>
</template>
