<!-- components/civic/MapExplorer.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import barangaysData from '~/data/barangays.json'
import CityMapSvg from './CityMapSvg.vue'
import SectionHeader from '~/components/editorial/SectionHeader.vue'

// barangays.json is checked-in static data guaranteed non-empty (18 entries)
// by tests/unit/data-integrity.spec.ts — non-null assert satisfies noUncheckedIndexedAccess.
const defaultBarangay = barangaysData[0]!
const selectedSlug = ref(defaultBarangay.slug)

const selectedBarangay = computed(() => {
  return barangaysData.find(b => b.slug === selectedSlug.value) ?? defaultBarangay
})

function onSelect(slug: string) {
  selectedSlug.value = slug
}
</script>

<template>
  <div class="space-y-8">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <SectionHeader
        eyebrow="Interactive Geography"
        title="Explore Santa Rosa"
        description="18 barangays across three geographic zones: Lakefront, Lowland Urban, and Upper Ridge."
      />

      <!-- Mobile dropdown selector -->
      <div class="md:hidden w-full sm:w-auto">
        <label for="barangay-mobile-select" class="block text-xs font-semibold text-charcoal/70 mb-1">
          Select Barangay
        </label>
        <select
          id="barangay-mobile-select"
          v-model="selectedSlug"
          class="w-full min-h-11 rounded-lg border border-charcoal/20 bg-white px-3 py-2 text-sm text-charcoal font-medium focus:border-laguna-green focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
        >
          <option v-for="b in barangaysData" :key="b.slug" :value="b.slug">
            {{ b.name }} ({{ b.group }})
          </option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      <!-- Left: Interactive Map -->
      <div class="lg:col-span-7">
        <CityMapSvg :selected-slug="selectedSlug" @select="onSelect" />
      </div>

      <!-- Right: Active Barangay Detail Card -->
      <div class="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-charcoal/10 bg-white p-6 sm:p-8 shadow-sm">
        <div>
          <span
            :class="[
              'inline-block px-3 py-1 text-xs font-semibold rounded-full mb-4 text-charcoal',
              selectedBarangay.group === 'Laguna Lake' ? 'bg-laguna-blue/20' :
              selectedBarangay.group === 'Upper / Tagaytay' ? 'bg-heritage-gold/20' :
              'bg-laguna-green/15'
            ]"
          >
            {{ selectedBarangay.group }}
          </span>
          <h3 class="font-serif text-3xl font-bold text-charcoal">
            {{ selectedBarangay.name }}
          </h3>
          <p class="mt-3 text-sm sm:text-base text-charcoal/80 leading-relaxed">
            {{ selectedBarangay.description }}
          </p>
          <div class="mt-6 pt-6 border-t border-charcoal/10 flex items-baseline justify-between">
            <span class="text-xs uppercase tracking-wider text-charcoal/70">2020 Population</span>
            <span class="font-serif text-2xl font-bold text-laguna-green">
              {{ selectedBarangay.population.toLocaleString('en-US') }}
            </span>
          </div>
        </div>

        <div class="mt-8 pt-4 border-t border-charcoal/10 flex items-center justify-between">
          <NuxtLink
            :to="`/barangays#${selectedBarangay.slug}`"
            class="text-sm font-semibold text-laguna-green underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green rounded-sm"
          >
            View full profile →
          </NuxtLink>
          <span class="text-[11px] text-charcoal/60">Verified PSA Census</span>
        </div>
      </div>
    </div>
  </div>
</template>
