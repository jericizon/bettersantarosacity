<script setup lang="ts">
import updatesData from '~/data/updates.json'
import type { CityUpdate } from '~/types/civic'
import CivicWeatherToday from '~/components/civic/WeatherToday.vue'
import CivicTrafficMap from '~/components/civic/TrafficMap.vue'
import UpdatesUpdateCard from '~/components/updates/UpdateCard.vue'
import { ArrowRight } from 'lucide-vue-next'

// Published advisories only, newest first — the spec's "latest city updates"
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
          Real-time Civic Conditions
        </p>
        <h2 class="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-laguna-green">
          Santa Rosa Now
        </h2>
        <p class="text-sm text-charcoal/70">
          What is happening in Santa Rosa right now: live weather, traffic conditions, and official city advisories.
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

    <!-- 3-Column Grid for Live Utility + Advisories -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 1. Live Weather -->
      <div class="flex flex-col justify-between">
        <h3 class="sr-only">Live Weather</h3>
        <CivicWeatherToday />
      </div>

      <!-- 2. Live Traffic — TrafficMap renders its own visible heading -->
      <div class="flex flex-col justify-between">
        <CivicTrafficMap />
      </div>

      <!-- 3. Recent City Advisories -->
      <div class="flex flex-col justify-between space-y-4">
        <h3 class="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/60">
          Recent Advisories
        </h3>
        <div class="space-y-4">
          <UpdatesUpdateCard v-for="update in recentUpdates" :key="update.id" :update="update" />
        </div>
      </div>
    </div>
  </div>
</template>
