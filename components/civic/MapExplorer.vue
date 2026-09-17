<!-- components/civic/MapExplorer.vue -->
<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import 'leaflet/dist/leaflet.css'
import barangaysData from '~/data/barangays.json'
import SectionHeader from '~/components/editorial/SectionHeader.vue'

// barangays.json is checked-in static data guaranteed non-empty (18 entries)
// by tests/unit/data-integrity.spec.ts — non-null assert satisfies noUncheckedIndexedAccess.
const defaultBarangay = barangaysData[0]!
const selectedSlug = ref(defaultBarangay.slug)

const selectedBarangay = computed(() => {
  return barangaysData.find(b => b.slug === selectedSlug.value) ?? defaultBarangay
})

// Zone group → marker color (design tokens).
const GROUP_COLORS: Record<string, string> = {
  'Laguna Lake': '#5E9FA5',
  'Lowland Urban': '#164A3D',
  'Upper / Tagaytay': '#D6A94B'
}
const markerColor = (group: string) => GROUP_COLORS[group] ?? '#164A3D'

const mapEl = ref<HTMLElement>()
const mapReady = ref(false)
// Leaflet types are heavy for the template layer; runtime objects only.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let map: any = null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const markers = new Map<string, any>()

function restyleMarkers() {
  for (const [slug, m] of markers) {
    const active = slug === selectedSlug.value
    m.setStyle({
      radius: active ? 10 : 7,
      weight: active ? 3 : 2,
      fillOpacity: active ? 0.95 : 0.7
    })
    if (active) m.bringToFront()
  }
}

watch(selectedSlug, () => {
  restyleMarkers()
  const m = markers.get(selectedSlug.value)
  if (map && m) map.panTo(m.getLatLng(), { animate: true })
})

onMounted(async () => {
  const L = await import('leaflet')

  // Centroids are a static asset; if it fails the basemap still renders.
  let geo: Record<string, { lat: number; lon: number; group: string }> = {}
  try {
    const res = await fetch('/data/barangay-centroids.json')
    if (res.ok) geo = (await res.json()).barangays
  } catch { /* markers are additive */ }

  map = L.map(mapEl.value!, {
    scrollWheelZoom: false, // don't trap page scroll
    zoomControl: true
  }).setView([14.306, 121.104], 12)

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 19
  }).addTo(map)

  for (const b of barangaysData) {
    const c = geo[b.slug]
    if (!c) continue
    const marker = L.circleMarker([c.lat, c.lon], {
      radius: 7,
      weight: 2,
      color: '#ffffff',
      fillColor: markerColor(b.group),
      fillOpacity: 0.7
    }).addTo(map)
    marker.bindTooltip(b.name, { direction: 'top', offset: [0, -6] })
    marker.on('click', () => { selectedSlug.value = b.slug })
    markers.set(b.slug, marker)
  }

  restyleMarkers()
  mapReady.value = true
})

onBeforeUnmount(() => {
  map?.remove()
  map = null
})
</script>

<template>
  <div class="space-y-8">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <SectionHeader
        eyebrow="Interactive Geography"
        title="Explore Santa Rosa"
        description="18 barangays across three geographic zones: Lakefront, Lowland Urban, and Upper Ridge."
      />

      <div class="w-full sm:w-auto md:min-w-64">
        <label for="barangay-select" class="block text-xs font-semibold text-charcoal/70 mb-1">
          Select Barangay
        </label>
        <select
          id="barangay-select"
          v-model="selectedSlug"
          class="w-full min-h-11 rounded-lg border border-charcoal/20 bg-white px-3 py-2 text-sm text-charcoal font-medium focus:border-laguna-green focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
        >
          <option v-for="b in barangaysData" :key="b.slug" :value="b.slug">
            {{ b.name }} ({{ b.group }})
          </option>
        </select>
      </div>
    </div>

    <!-- Full-bleed map band: breaks out of the inner max-w-7xl measure. -->
    <div class="relative">
      <div class="relative left-1/2 h-[420px] w-screen -translate-x-1/2 sm:h-[520px] lg:h-[560px]">
        <div ref="mapEl" class="absolute inset-0 z-0 bg-light-green" data-testid="leaflet-map" />
        <div
          v-if="!mapReady"
          class="absolute inset-0 z-10 flex items-center justify-center text-sm text-charcoal/60"
          aria-busy="true"
        >
          Loading map…
        </div>
      </div>

      <!-- Detail card: stacked on mobile, overlaid at the content gutter on lg. -->
      <div class="mt-6 lg:absolute lg:bottom-6 lg:z-20 lg:mt-0 lg:w-96 lg:right-[max(1rem,calc((100vw-80rem)/2+2rem))]">
        <div class="flex flex-col justify-between rounded-2xl border border-charcoal/10 bg-white/95 p-6 shadow-md backdrop-blur-sm sm:p-7">
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

    <p class="text-[11px] text-charcoal/60">
      Map © OpenStreetMap contributors · barangay markers are community-mapped centroids, not official cadastral boundaries.
    </p>
  </div>
</template>
