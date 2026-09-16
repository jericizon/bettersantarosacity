<script setup lang="ts">
import barangaysData from '~/data/barangays.json'
import DataBarangayCard from '~/components/data/BarangayCard.vue'
import { buildSeoHead } from '~/utils/seo'
import type { Barangay } from '~/types/civic'

// Auto-imports are Nuxt-only; the guard keeps this page mountable under plain Vitest.
if (typeof useHead === 'function') {
  useHead(buildSeoHead({
    title: 'Barangays — Better Santa Rosa City',
    description: 'All 18 barangays of Santa Rosa City, Laguna — grouped by geography, each with a sourced profile.',
    path: '/barangays'
  }))
}

const barangays = barangaysData as Barangay[]

// Spec §11 group order and labels.
const BARANGAY_GROUP_ORDER = ['Laguna Lake', 'Lowland Urban', 'Upper / Tagaytay'] as const

const barangayGroups = BARANGAY_GROUP_ORDER.map(name => ({
  name,
  sectionId: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  barangays: barangays.filter(b => b.group === name)
}))
</script>

<template>
  <div data-pagefind-filter="type:barangays" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-12">
    <header class="max-w-3xl space-y-3">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-rose-accent-dark">
        Santa Rosa City, Laguna
      </p>
      <h1 class="font-serif text-3xl font-bold tracking-tight text-laguna-green sm:text-4xl">
        Barangays
      </h1>
      <p class="text-sm leading-relaxed text-charcoal/70 sm:text-base">
        All {{ barangays.length }} barangays of Santa Rosa, grouped by geography.
        Each profile shows only what the cited sources support — missing information
        is labeled, never filled in.
      </p>
    </header>

    <section
      v-for="group in barangayGroups"
      :key="group.name"
      :aria-labelledby="`group-${group.sectionId}`"
    >
      <div class="flex items-baseline justify-between gap-2 border-b border-charcoal/10 pb-2">
        <h2
          :id="`group-${group.sectionId}`"
          class="font-serif text-2xl font-bold tracking-tight text-laguna-green"
        >
          {{ group.name }}
        </h2>
        <span class="text-xs font-medium text-charcoal/70">
          {{ group.barangays.length }} barangay{{ group.barangays.length === 1 ? '' : 's' }}
        </span>
      </div>

      <ul class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="b in group.barangays" :key="b.slug">
          <DataBarangayCard :barangay="b" />
        </li>
      </ul>
    </section>

    <p class="text-xs text-charcoal/70">
      An interactive barangay map will be added once authoritative GIS boundary data is available.
    </p>
  </div>
</template>
