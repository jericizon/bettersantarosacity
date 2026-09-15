<script setup lang="ts">
import { ref, computed } from 'vue'
import barangaysData from '~/data/barangays.json'
import CityMapSvg from './CityMapSvg.vue'
import RoseMotif from './RoseMotif.vue'

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
  <div class="rounded-2xl border border-charcoal/10 bg-white p-6 lg:p-8 shadow-sm">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
      <div>
        <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-accent-dark">
          <RoseMotif :size="16" class="text-rose-accent" />
          <span>Interactive Geography</span>
        </div>
        <h2 class="mt-1 font-serif text-2xl lg:text-3xl font-bold text-laguna-green">
          Explore Santa Rosa
        </h2>
        <p class="text-sm text-charcoal/70">18 barangays across three geographic zones.</p>
      </div>

      <!-- Mobile dropdown selector -->
      <div class="md:hidden">
        <label for="barangay-mobile-select" class="sr-only">Select Barangay</label>
        <select
          id="barangay-mobile-select"
          v-model="selectedSlug"
          class="w-full rounded-lg border border-charcoal/20 bg-parchment px-3 py-2 text-sm text-charcoal font-medium focus:border-laguna-green focus:outline-none"
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
      <div class="lg:col-span-5 flex flex-col justify-between rounded-xl border border-charcoal/10 bg-parchment p-6">
        <div>
          <span
            :class="[
              'inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full mb-3 text-charcoal',
              selectedBarangay.group === 'Laguna Lake' ? 'bg-laguna-blue/20' :
              selectedBarangay.group === 'Upper / Tagaytay' ? 'bg-heritage-gold/20' :
              'bg-laguna-green/15'
            ]"
          >
            {{ selectedBarangay.group }}
          </span>
          <h3 class="font-serif text-2xl font-bold text-charcoal">
            {{ selectedBarangay.name }}
          </h3>
          <p class="mt-3 text-sm text-charcoal/80 leading-relaxed">
            {{ selectedBarangay.description }}
          </p>
          <div class="mt-4 pt-4 border-t border-charcoal/10 text-xs">
            <span class="block text-charcoal/70">2020 Population</span>
            <span class="font-serif text-base font-bold text-laguna-green">
              {{ selectedBarangay.population.toLocaleString('en-US') }}
            </span>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-charcoal/10 flex items-center justify-between">
          <NuxtLink
            :to="`/barangays#${selectedBarangay.slug}`"
            class="text-xs font-semibold text-laguna-green hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green rounded-sm"
          >
            View full profile →
          </NuxtLink>
          <span class="text-[10px] text-charcoal/70">Verified Census Data</span>
        </div>
      </div>
    </div>
  </div>
</template>
