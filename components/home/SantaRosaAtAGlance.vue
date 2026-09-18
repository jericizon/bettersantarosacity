<script setup lang="ts">
import cityData from '~/data/city.json'
import barangaysData from '~/data/barangays.json'
import CountUp from '~/components/civic/CountUp.vue'
import RoseMotif from '~/components/civic/RoseMotif.vue'
import BrandMark from '~/components/brand/BrandMark.vue'
import { ArrowRight, MapPin, Landmark, Compass, History } from 'lucide-vue-next'

const lakeBarangays = barangaysData.filter(b => b.group === 'Laguna Lake')
const lakeBarangayCount = lakeBarangays.length

const stats = [
  {
    value: String(cityData.barangayCount),
    numericValue: cityData.barangayCount,
    label: 'BARANGAYS',
    context: '18 administrative subdivisions across the city',
    source: 'City Government of Santa Rosa · About Us'
  },
  {
    value: `${cityData.landAreaHa.toLocaleString('en-US')} ha`,
    numericValue: cityData.landAreaHa,
    suffix: ' ha',
    label: 'LAND AREA',
    context: 'Total municipal land area in Laguna',
    source: 'City Government of Santa Rosa · About Us'
  },
  {
    value: String(cityData.cityhoodYear),
    label: 'CITYHOOD',
    context: 'Plebiscite ratification under Republic Act No. 9264',
    source: 'Republic Act No. 9264 (July 10, 2004)'
  },
  {
    value: String(lakeBarangayCount),
    numericValue: lakeBarangayCount,
    label: 'LAKESHORE BARANGAYS',
    context: 'Aplaya, Sinalhan, and Caingin along Laguna de Bay',
    source: 'City Government of Santa Rosa · About Us'
  }
]

const exploreLinks = [
  {
    title: 'Barangays',
    description: "Explore Santa Rosa's 18 barangays.",
    to: '/barangays',
    icon: MapPin,
    action: 'Browse barangays'
  },
  {
    title: 'Places & Landmarks',
    description: 'Discover notable places, landmarks and attractions around the city.',
    to: '/places',
    icon: Landmark,
    action: 'Explore places'
  },
  {
    title: 'City Map',
    description: 'See Santa Rosa by barangay and geographic area.',
    to: '/explore',
    icon: Compass,
    action: 'Open map explorer'
  },
  {
    title: 'History & Heritage',
    description: 'Trace Santa Rosa from Barrio Bukol to the modern city.',
    to: '/history',
    icon: History,
    action: 'Read city history'
  }
]
</script>

<template>
  <div class="relative space-y-12 sm:space-y-16">
    <div
      class="pointer-events-none absolute -right-6 -top-10 opacity-[0.04] sm:opacity-[0.06] text-laguna-green hidden sm:block"
      aria-hidden="true"
    >
      <BrandMark :size="280" monochrome />
    </div>

    <div class="max-w-3xl space-y-3">
      <div class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-rose-accent-dark">
        <RoseMotif :size="14" class="text-rose-accent" />
        <span>SANTA ROSA AT A GLANCE</span>
      </div>

      <h2
        id="glance-heading"
        class="font-serif text-3xl font-bold tracking-tight text-laguna-green sm:text-4xl lg:text-5xl leading-tight"
      >
        Santa Rosa at a Glance
      </h2>

      <p class="text-base sm:text-lg leading-relaxed text-charcoal/75">
        A quick look at the city: its people, places, geography and history.
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 lg:gap-8 border-y border-charcoal/10 py-8 sm:py-10">
      <div
        v-for="(stat, idx) in stats"
        :key="stat.label"
        class="flex flex-col justify-between"
        :class="{ 'lg:border-r lg:border-charcoal/10 lg:pr-6': idx < stats.length - 1 }"
      >
        <div>
          <p class="font-serif text-5xl sm:text-6xl font-bold tracking-tight text-laguna-green leading-none">
            <CountUp
              v-if="stat.numericValue !== undefined"
              :end="stat.numericValue"
              :suffix="stat.suffix || ''"
            />
            <template v-else>{{ stat.value }}</template>
          </p>
          <p class="mt-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-charcoal/80">
            {{ stat.label }}
          </p>
          <p class="mt-1 text-xs text-charcoal/70 leading-relaxed">
            {{ stat.context }}
          </p>
        </div>

        <p class="mt-5 border-t border-charcoal/10 pt-2 text-[11px] text-charcoal/60 leading-tight">
          Source: <span class="font-medium text-charcoal/80">{{ stat.source }}</span>
        </p>
      </div>
    </div>

    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-charcoal/10 pb-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-rose-accent-dark">
            EXPLORE THE CITY
          </p>
          <h3 class="font-serif text-xl sm:text-2xl font-bold text-laguna-green mt-1">
            Explore Santa Rosa by Area, Place &amp; History
          </h3>
        </div>
        <p class="text-xs text-charcoal/60 max-w-md">
          Independent civic and geographic exploration across Santa Rosa's communities.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <NuxtLink
          v-for="item in exploreLinks"
          :key="item.to"
          :to="item.to"
          class="group flex flex-col justify-between rounded-xl border border-charcoal/10 bg-white p-5 sm:p-6 shadow-sm transition-all duration-200 hover:border-laguna-green/40 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-laguna-green"
        >
          <div class="space-y-3">
            <div class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-light-green/80 text-laguna-green group-hover:bg-laguna-green group-hover:text-white transition-colors duration-200">
              <component :is="item.icon" :size="18" aria-hidden="true" />
            </div>

            <h4 class="font-serif text-lg font-bold text-charcoal group-hover:text-laguna-green transition-colors">
              {{ item.title }}
            </h4>

            <p class="text-xs sm:text-sm text-charcoal/70 leading-relaxed">
              {{ item.description }}
            </p>
          </div>

          <div class="mt-5 pt-3 border-t border-charcoal/10 flex items-center justify-between text-xs font-semibold text-laguna-green">
            <span>{{ item.action }}</span>
            <ArrowRight :size="14" class="transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
