<!-- components/civic/MapExplorer.vue -->
<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import 'maplibre-gl/dist/maplibre-gl.css'
import barangaysData from '~/data/barangays.json'
import SectionHeader from '~/components/editorial/SectionHeader.vue'

// Free vector basemap — no API key (same stack as expresswayph gas-calculator).
const MAP_STYLE = 'https://tiles.openfreemap.org/styles/positron'

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
// MapLibre instance is runtime-only; keep it loosely typed.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let map: any = null
const centroids = new Map<string, { lat: number; lon: number }>()
// Per-slug [[minLon,minLat],[maxLon,maxLat]] for zoom-to-area on selection.
const areaBounds = new Map<string, [[number, number], [number, number]]>()

function focusBarangay(slug: string) {
  map.setFilter('barangay-selected', ['==', ['get', 'slug'], slug])
  map.setFilter('barangay-fill-selected', ['==', ['get', 'slug'], slug])

  // Spotlight the selection: fade other fills, dots, and labels.
  const isSelected = ['==', ['get', 'slug'], slug]
  map.setPaintProperty('barangay-fills', 'fill-opacity', ['case', isSelected, 0.02, 0.05])
  map.setPaintProperty('barangay-dots', 'circle-opacity', ['case', isSelected, 0.95, 0.3])
  map.setPaintProperty('barangay-dots', 'circle-stroke-opacity', ['case', isSelected, 1, 0.4])
  map.setPaintProperty('barangay-labels', 'text-opacity', ['case', isSelected, 1, 0.35])

  const b = areaBounds.get(slug)
  if (b) {
    map.fitBounds(b, { padding: 140, maxZoom: 14, duration: 800 })
  } else {
    const c = centroids.get(slug)
    if (c) map.easeTo({ center: [c.lon, c.lat], zoom: 13.5, duration: 600 })
  }
}

watch(selectedSlug, slug => {
  if (!map || !mapReady.value) return
  focusBarangay(slug)
})

onMounted(async () => {
  const maplibregl = (await import('maplibre-gl')).default

  // Centroids + Voronoi coverage cells are static assets; if either fails the
  // basemap still renders.
  let geo: Record<string, { lat: number; lon: number; group: string }> = {}
  let areas: { features?: { properties?: Record<string, unknown> }[] } | null = null
  try {
    const [cRes, aRes] = await Promise.all([
      fetch('/data/barangay-centroids.json'),
      fetch('/data/barangay-areas.json')
    ])
    if (cRes.ok) geo = (await cRes.json()).barangays
    if (aRes.ok) areas = await aRes.json()
  } catch { /* markers are additive */ }
  for (const [slug, c] of Object.entries(geo)) centroids.set(slug, c)

  // Bbox per coverage cell → fitBounds target on selection.
  type Pos = [number, number]
  const walk = (coords: unknown, cb: (p: Pos) => void): void => {
    if (!Array.isArray(coords)) return
    if (typeof coords[0] === 'number') { cb(coords as Pos); return }
    for (const c of coords) walk(c, cb)
  }
  for (const f of areas?.features ?? []) {
    const slug = String(f.properties?.slug ?? '')
    let minLon = Infinity, minLat = Infinity, maxLon = -Infinity, maxLat = -Infinity
    walk((f as { geometry?: { coordinates?: unknown } }).geometry?.coordinates, ([x, y]) => {
      if (x < minLon) minLon = x; if (x > maxLon) maxLon = x
      if (y < minLat) minLat = y; if (y > maxLat) maxLat = y
    })
    if (slug && isFinite(minLon)) areaBounds.set(slug, [[minLon, minLat], [maxLon, maxLat]])
  }

  // Frame all 18 markers — pad right on desktop so the overlay card doesn't
  // cover dots. `bounds` must be a constructor option: camera set before
  // 'load' is overridden when the style's own root center/zoom arrives.
  const lons = Object.values(geo).map(c => c.lon)
  const lats = Object.values(geo).map(c => c.lat)
  const hasBounds = lons.length > 0 && lats.length > 0
  const isLg = window.innerWidth >= 1024

  map = new maplibregl.Map({
    container: mapEl.value!,
    style: MAP_STYLE,
    cooperativeGestures: true, // page scroll stays safe; ctrl/cmd+scroll or two-finger zoom
    ...(hasBounds
      ? {
          bounds: [
            [Math.min(...lons), Math.min(...lats)],
            [Math.max(...lons), Math.max(...lats)]
          ],
          fitBoundsOptions: {
            padding: { top: 60, bottom: 60, left: 60, right: isLg ? 440 : 60 },
            maxZoom: 13
          }
        }
      : { center: [121.104, 14.306], zoom: 12 })
  })
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')

  map.on('load', () => {
    const isSelected = ['==', ['get', 'slug'], selectedSlug.value]
    if (areas?.features?.length) {
      // Coverage fills sit under the dots; the selected cell gets a stronger
      // fill while everything else fades into the basemap.
      map.addSource('barangay-areas', {
        type: 'geojson',
        data: {
          ...areas,
          features: areas.features.map(f => ({
            ...f,
            properties: { ...f.properties, color: markerColor(String(f.properties?.group ?? '')) }
          }))
        }
      })
      map.addLayer({
        id: 'barangay-fills',
        type: 'fill',
        source: 'barangay-areas',
        paint: {
          'fill-color': ['get', 'color'],
          'fill-opacity': ['case', isSelected, 0.02, 0.05]
        }
      })
      map.addLayer({
        id: 'barangay-fill-selected',
        type: 'fill',
        source: 'barangay-areas',
        filter: isSelected,
        paint: { 'fill-color': ['get', 'color'], 'fill-opacity': 0.32 }
      })
      map.addLayer({
        id: 'barangay-fill-outline',
        type: 'line',
        source: 'barangay-areas',
        paint: { 'line-color': ['get', 'color'], 'line-width': 1, 'line-opacity': 0.45 }
      })
      map.on('click', 'barangay-fills', (e: { features?: { properties?: { slug?: string } }[] }) => {
        const slug = e.features?.[0]?.properties?.slug
        if (slug) selectedSlug.value = slug
      })
      map.on('mouseenter', 'barangay-fills', () => { map.getCanvas().style.cursor = 'pointer' })
      map.on('mouseleave', 'barangay-fills', () => { map.getCanvas().style.cursor = '' })
    }

    map.addSource('barangays', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: barangaysData
          .filter(b => geo[b.slug])
          .map(b => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [geo[b.slug]!.lon, geo[b.slug]!.lat] },
            properties: { slug: b.slug, name: b.name, color: markerColor(b.group) }
          }))
      }
    })

    map.addLayer({
      id: 'barangay-dots',
      type: 'circle',
      source: 'barangays',
      paint: {
        'circle-radius': 8,
        'circle-color': ['get', 'color'],
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff',
        'circle-opacity': ['case', isSelected, 0.95, 0.3],
        'circle-stroke-opacity': ['case', isSelected, 1, 0.4]
      }
    })
    // Selected-state ring drawn above the base dots.
    map.addLayer({
      id: 'barangay-selected',
      type: 'circle',
      source: 'barangays',
      filter: ['==', ['get', 'slug'], selectedSlug.value],
      paint: {
        'circle-radius': 12,
        'circle-color': 'transparent',
        'circle-stroke-width': 3,
        'circle-stroke-color': ['get', 'color']
      }
    })
    map.addLayer({
      id: 'barangay-labels',
      type: 'symbol',
      source: 'barangays',
      layout: {
        'text-field': ['get', 'name'],
        // OpenFreeMap hosts Noto Sans only; the default Open Sans stack 404s.
        'text-font': ['Noto Sans Regular'],
        'text-size': 11,
        'text-offset': [0, 1.3],
        'text-anchor': 'top',
        'text-optional': true
      },
      paint: {
        'text-color': '#182421',
        'text-halo-color': '#ffffff',
        'text-halo-width': 1.5,
        'text-opacity': ['case', isSelected, 1, 0.35]
      }
    })

    map.on('click', 'barangay-dots', (e: { features?: { properties?: { slug?: string } }[] }) => {
      const slug = e.features?.[0]?.properties?.slug
      if (slug) selectedSlug.value = slug
    })
    map.on('mouseenter', 'barangay-dots', () => { map.getCanvas().style.cursor = 'pointer' })
    map.on('mouseleave', 'barangay-dots', () => { map.getCanvas().style.cursor = '' })

    mapReady.value = true
    // A pick made while the style was still loading was skipped by the
    // watcher — apply its spotlight + zoom now.
    if (selectedSlug.value !== defaultBarangay.slug) focusBarangay(selectedSlug.value)
  })
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

    <!-- Full-bleed map band: breaks out of the inner max-w-7xl measure.
         overflow-x-clip on the section ancestor prevents the 100vw scrollbar gap. -->
    <div class="relative">
      <div class="relative left-1/2 h-[540px] w-screen -translate-x-1/2 sm:h-[660px] lg:h-[760px]">
        <!-- maplibre-gl.css sets .maplibregl-map{position:relative} unlayered, which
         beats Tailwind's layered .absolute — size with h-full/w-full instead. -->
        <div ref="mapEl" class="h-full w-full bg-light-green" data-testid="explore-map" />
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
      Map © OpenStreetMap contributors · shaded zones are approximate coverage areas derived from community-mapped centroids, not official cadastral boundaries.
    </p>
  </div>
</template>
