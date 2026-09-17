<script setup lang="ts">
import { ref, computed } from 'vue'
import placesData from '~/data/places.json'
import type { Place } from '~/types/civic'
import PlaceCard from '~/components/places/PlaceCard.vue'
import { buildSeoHead } from '~/utils/seo'
import { Search } from 'lucide-vue-next'

if (typeof useHead === 'function') {
  useHead(buildSeoHead({
    title: 'Places & Landmarks · Better Santa Rosa City',
    description: 'Civic landmarks, historical sites, cultural places, and natural heritage in Santa Rosa City, Laguna.',
    path: '/places'
  }))
}

const places = placesData as Place[]
const activeCategory = ref<string>('All')
const searchQuery = ref<string>('')

const categories = ['All', 'Landmark', 'Heritage', 'Civic', 'Nature', 'Attraction']

const filteredPlaces = computed(() => {
  return places.filter(p => {
    const matchesCat = activeCategory.value === 'All' || p.category === activeCategory.value
    const matchesSearch = !searchQuery.value.trim() ||
      p.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.barangay.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesCat && matchesSearch
  })
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
    <header class="max-w-3xl space-y-3">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-rose-accent-dark">
        Explore Santa Rosa
      </p>
      <h1 class="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-laguna-green">
        Places & Landmarks
      </h1>
      <p class="text-sm sm:text-base text-charcoal/70 leading-relaxed">
        Key landmarks, historical fortresses, cultural museums, and civic spaces across Santa Rosa City. Sourced from cultural heritage registries and official municipal records.
      </p>
    </header>

    <!-- Filters & Search -->
    <div class="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between pb-2 border-b border-charcoal/10">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="cat in categories"
          :key="cat"
          type="button"
          @click="activeCategory = cat"
          class="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
          :class="activeCategory === cat ? 'bg-laguna-green text-white font-semibold' : 'bg-charcoal/5 text-charcoal/80 hover:bg-charcoal/10'"
        >
          {{ cat }}
        </button>
      </div>

      <div class="relative w-full sm:w-64">
        <Search :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" aria-hidden="true" />
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Filter places..."
          class="w-full pl-9 pr-3 py-1.5 rounded-md border border-charcoal/20 text-xs focus:border-laguna-green focus:outline-none"
        >
      </div>
    </div>

    <!-- Places Grid -->
    <div v-if="filteredPlaces.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <PlaceCard v-for="place in filteredPlaces" :key="place.id" :place="place" />
    </div>
    <div v-else class="text-center py-12 text-sm text-charcoal/60">
      No places match the selected filters.
    </div>
  </div>
</template>
