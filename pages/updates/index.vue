<script setup lang="ts">
import { ref, computed } from 'vue'
import updatesData from '~/data/updates.json'
import type { CityUpdate } from '~/types/civic'
import UpdateCard from '~/components/updates/UpdateCard.vue'
import { buildSeoHead } from '~/utils/seo'
import { Search } from 'lucide-vue-next'

if (typeof useHead === 'function') {
  useHead(buildSeoHead({
    title: 'City Updates & Advisories · Better Santa Rosa City',
    description: 'Public announcements, road advisories, and emergency alerts from the City Government of Santa Rosa and municipal agencies.',
    path: '/updates'
  }))
}

const updates = updatesData as CityUpdate[]
const activeCategory = ref<string>('all')
const searchQuery = ref<string>('')

const categories = ['all', 'traffic', 'emergency', 'public-services', 'government', 'infrastructure']

const filteredUpdates = computed(() => {
  return updates.filter(u => {
    const matchesCat = activeCategory.value === 'all' || u.category === activeCategory.value
    const matchesSearch = !searchQuery.value.trim() ||
      u.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      u.summary.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesCat && matchesSearch
  })
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
    <header class="max-w-3xl space-y-3">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-rose-accent-dark">
        Public Information
      </p>
      <h1 class="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-laguna-green">
        City Updates & Advisories
      </h1>
      <p class="text-sm sm:text-base text-charcoal/70 leading-relaxed">
        Curated public announcements from the City Government of Santa Rosa and disaster risk authorities, presented with source attribution and plain-language summaries.
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
          class="px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider transition-colors"
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
          placeholder="Search updates..."
          class="w-full pl-9 pr-3 py-1.5 rounded-md border border-charcoal/20 text-xs focus:border-laguna-green focus:outline-none"
        >
      </div>
    </div>

    <!-- Updates Grid -->
    <div v-if="filteredUpdates.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UpdateCard v-for="update in filteredUpdates" :key="update.id" :update="update" />
    </div>
    <div v-else class="text-center py-12 text-sm text-charcoal/60">
      No updates match the selected filters.
    </div>
  </div>
</template>
