<script setup lang="ts">
import barangaysData from '~/data/barangays.json'

defineProps<{
  selectedSlug?: string
}>()

const emit = defineEmits<{
  (e: 'select', slug: string): void
}>()

// Visual coordinates for Santa Rosa's 18 barangays positioned across 3 zones:
// Top (Laguna Lake shore), Middle (Lowland Urban), Bottom (Upper Tagaytay ridge)
const barangayCoords: Record<string, { cx: number; cy: number; r: number }> = {
  'aplaya': { cx: 270, cy: 70, r: 24 },
  'caingin': { cx: 210, cy: 75, r: 26 },
  'sinalhan': { cx: 330, cy: 90, r: 26 },
  'tagapo': { cx: 160, cy: 130, r: 28 },
  'kanluran': { cx: 220, cy: 135, r: 18 },
  'malusak': { cx: 245, cy: 140, r: 16 },
  'market-area': { cx: 210, cy: 170, r: 22 },
  'ibaba': { cx: 265, cy: 165, r: 20 },
  'labas': { cx: 295, cy: 155, r: 24 },
  'pooc': { cx: 165, cy: 190, r: 30 },
  'macabling': { cx: 250, cy: 210, r: 24 },
  'dila': { cx: 205, cy: 235, r: 28 },
  'dita': { cx: 270, cy: 260, r: 28 },
  'balibago': { cx: 215, cy: 290, r: 26 },
  'malitlit': { cx: 260, cy: 320, r: 26 },
  'pulong-santa-cruz': { cx: 180, cy: 350, r: 28 },
  'don-jose': { cx: 150, cy: 405, r: 32 },
  'santo-domingo': { cx: 120, cy: 460, r: 30 }
}

// Join each barangay with its map coordinates; skips any slug lacking coords
// (keeps template index-access free under noUncheckedIndexedAccess).
const barangayNodes = barangaysData.flatMap((b) => {
  const coord = barangayCoords[b.slug]
  return coord ? [{ ...b, cx: coord.cx, cy: coord.cy, r: coord.r }] : []
})

function onSelect(slug: string) {
  emit('select', slug)
}
</script>

<template>
  <div class="relative w-full overflow-hidden rounded-xl border border-charcoal/10 bg-white p-4 shadow-sm">
    <div class="mb-3 flex items-center justify-between text-xs text-charcoal/70">
      <div class="flex items-center gap-3">
        <span class="flex items-center gap-1"><span class="h-2 w-2 rounded-full bg-laguna-blue" /> Lakefront</span>
        <span class="flex items-center gap-1"><span class="h-2 w-2 rounded-full bg-laguna-green" /> Lowland Urban</span>
        <span class="flex items-center gap-1"><span class="h-2 w-2 rounded-full bg-heritage-gold" /> Upper Ridge</span>
      </div>
      <span class="font-medium">18 Barangays</span>
    </div>

    <svg viewBox="0 0 420 520" class="h-auto w-full select-none" role="group" aria-label="Interactive Map of Santa Rosa City Barangays">
      <!-- Water body: Laguna Lake representation on northern border -->
      <path
        d="M 120 20 Q 250 5 400 45 L 400 120 Q 300 100 150 110 Z"
        fill="#5E9FA5"
        fill-opacity="0.12"
      />
      <text x="320" y="45" font-size="10" font-family="sans-serif" fill="#5E9FA5" font-weight="600" opacity="0.8">
        LAGUNA LAKE
      </text>

      <!-- Connecting roads corridor representation -->
      <path d="M 215 110 L 215 360 L 140 480" stroke="#164A3D" stroke-opacity="0.15" stroke-width="3" stroke-dasharray="4 4" fill="none" />

      <!-- Barangay nodes -->
      <g
        v-for="b in barangayNodes"
        :key="b.slug"
        :data-barangay-slug="b.slug"
        role="button"
        tabindex="0"
        :aria-label="b.name"
        :aria-pressed="selectedSlug === b.slug"
        class="cursor-pointer transition-all duration-200 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
        @click="onSelect(b.slug)"
        @keydown.enter="onSelect(b.slug)"
        @keydown.space.prevent="onSelect(b.slug)"
      >
        <circle
          :cx="b.cx"
          :cy="b.cy"
          :r="b.r"
          :fill="b.group === 'Laguna Lake' ? '#5E9FA5' : b.group === 'Upper / Tagaytay' ? '#D6A94B' : '#164A3D'"
          :fill-opacity="selectedSlug === b.slug ? 0.9 : 0.25"
          :stroke="selectedSlug === b.slug ? '#164A3D' : '#182421'"
          :stroke-width="selectedSlug === b.slug ? 2.5 : 1"
          stroke-opacity="0.6"
          class="hover:stroke-opacity-80 transition-all"
        />
        <text
          :x="b.cx"
          :y="b.cy + 4"
          text-anchor="middle"
          font-size="9"
          font-weight="600"
          :fill="selectedSlug === b.slug ? '#FFFFFF' : '#182421'"
          pointer-events="none"
        >
          {{ b.name }}
        </text>
      </g>
    </svg>
  </div>
</template>
