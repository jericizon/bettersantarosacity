<script setup lang="ts">
import updatesData from '~/data/updates.json'
import type { CityUpdate } from '~/types/civic'
import CivicWeatherToday from '~/components/civic/WeatherToday.vue'
import UpdatesUpdateCard from '~/components/updates/UpdateCard.vue'
import { ArrowRight } from 'lucide-vue-next'

// Published updates only, newest first — the spec's "latest city updates"
// rail is a date-ordered feed, not dataset order.
const recentUpdates = (updatesData as CityUpdate[])
  .filter(u => u.status === 'published')
  .sort((a, b) => b.date.localeCompare(a.date))
  .slice(0, 3)
</script>

<template>
  <div class="space-y-8">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div class="space-y-2">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-rose-accent-dark">
          City Updates & Conditions
        </p>
        <h2 class="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-laguna-green">
          Santa Rosa Now
        </h2>
        <p class="text-sm text-charcoal/70">
          Current weather and recent public information from Santa Rosa.
        </p>
      </div>

      <NuxtLink
        to="/updates"
        class="inline-flex items-center gap-1 text-sm font-semibold text-laguna-green hover:underline whitespace-nowrap"
      >
        <span>All City Updates</span>
        <ArrowRight :size="14" aria-hidden="true" />
      </NuxtLink>
    </div>

    <!-- 2-column editorial grid: weather panel, then the updates rail. -->
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <!-- 1. Current Weather -->
      <div class="flex flex-col justify-between lg:col-span-2">
        <h3 class="sr-only">Current Weather</h3>
        <CivicWeatherToday />
      </div>

      <!-- 2. Recent City Updates -->
      <div class="flex flex-col justify-between space-y-4 lg:col-span-3">
        <h3 class="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/60">
          Recent City Updates
        </h3>
        <div class="space-y-4">
          <UpdatesUpdateCard v-for="update in recentUpdates" :key="update.id" :update="update" />
        </div>
      </div>
    </div>
  </div>
</template>
