<script setup lang="ts">
import { computed } from 'vue'
import { useWeather } from '~/composables/useWeather'

const { status, scene, debugCode } = useWeather()

// Same visibility rule as the ambience layer: weather data ready, or a debug
// scene forced. Parent must be `relative`; the veil fills that box only.
const show = computed(() =>
  scene.value === 'fog' && (status.value === 'ready' || debugCode.value != null)
)

const bands = [
  { top: '12%', dur: '11s', delay: '0s' },
  { top: '42%', dur: '14s', delay: '-5s' },
  { top: '68%', dur: '9s', delay: '-2.5s' }
]
</script>

<template>
  <!-- Fog veil scoped to the hero emblem: sits above the arch image so the
       mist covers it, but never the headline copy. Edges are mask-feathered
       so the wash fades out instead of showing a hard rectangle. -->
  <div v-if="show" class="fogveil" aria-hidden="true" data-testid="weather-veil">
    <span
      v-for="(f, i) in bands" :key="i" class="fogveil-band"
      :style="{ top: f.top, animationDuration: f.dur, animationDelay: f.delay }"
    />
  </div>
</template>

<style scoped>
.fogveil {
  position: absolute; inset: -6%; z-index: 10;
  overflow: hidden; pointer-events: none;
  background: linear-gradient(to bottom, rgba(246, 243, 234, 0.5), rgba(246, 243, 234, 0.38));
  -webkit-mask-image: radial-gradient(ellipse at center, #000 55%, transparent 98%);
  mask-image: radial-gradient(ellipse at center, #000 55%, transparent 98%);
  animation: fogveil-in 1.4s ease-out both;
}
.fogveil-band {
  position: absolute; left: -10%; width: 120%; height: 20%;
  background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.6), transparent);
  animation: fogveil-slide 12s ease-in-out infinite alternate;
}

@keyframes fogveil-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes fogveil-slide { from { transform: translateX(-4%); } to { transform: translateX(4%); } }

@media (prefers-reduced-motion: reduce) {
  .fogveil, .fogveil-band { animation: none; }
}
</style>
