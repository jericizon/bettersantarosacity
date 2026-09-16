<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  code: number | undefined
  size?: number
}>(), {
  size: 64
})

type Scene = 'sun' | 'suncloud' | 'cloud' | 'fog' | 'drizzle' | 'rain' | 'storm' | 'snow'

const SCENE: Record<number, Scene> = {
  0: 'sun', 1: 'sun',
  2: 'suncloud',
  3: 'cloud',
  45: 'fog', 48: 'fog',
  51: 'drizzle', 53: 'drizzle', 55: 'drizzle', 56: 'drizzle', 57: 'drizzle',
  61: 'rain', 63: 'rain', 65: 'rain', 66: 'rain', 67: 'rain',
  80: 'rain', 81: 'rain', 82: 'rain',
  71: 'snow', 73: 'snow', 75: 'snow', 77: 'snow', 85: 'snow', 86: 'snow',
  95: 'storm', 96: 'storm', 99: 'storm'
}

const scene = computed<Scene>(() => (props.code != null && SCENE[props.code]) || 'cloud')
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 64 64"
    fill="none"
    role="img"
    aria-hidden="true"
    class="weather-icon"
  >
    <!-- Clear: rotating rays around a calm disc -->
    <g v-if="scene === 'sun'">
      <g class="wx-rays">
        <line v-for="a in 8" :key="a" x1="32" y1="10" x2="32" y2="17"
          :transform="`rotate(${a * 45} 32 32)`" stroke="#d6a039" stroke-width="3" stroke-linecap="round" />
      </g>
      <circle cx="32" cy="32" r="11" fill="#d6a039" />
    </g>

    <!-- Partly cloudy: small sun peeking behind a drifting cloud -->
    <g v-else-if="scene === 'suncloud'">
      <g class="wx-rays">
        <line v-for="a in 8" :key="a" x1="22" y1="10" x2="22" y2="15"
          :transform="`rotate(${a * 45} 22 22)`" stroke="#d6a039" stroke-width="2.5" stroke-linecap="round" />
      </g>
      <circle cx="22" cy="22" r="8" fill="#d6a039" />
      <path class="wx-cloud" d="M22 44a8 8 0 0 1-1.2-15.9A11 11 0 0 1 42 26a9 9 0 0 1 12 8.5A7.5 7.5 0 0 1 46.5 44z" fill="#619499" />
    </g>

    <!-- Overcast: two clouds drifting out of phase -->
    <g v-else-if="scene === 'cloud'">
      <path class="wx-cloud" d="M18 42a8 8 0 0 1-1.2-15.9A11 11 0 0 1 38 24a9 9 0 0 1 12 8.5A7.5 7.5 0 0 1 42.5 42z" fill="#619499" />
      <path class="wx-cloud wx-cloud-2" d="M26 50a6 6 0 0 1-.9-11.9A8.5 8.5 0 0 1 41 37a7 7 0 0 1 9.5 6.4A5.8 5.8 0 0 1 45 50z" fill="#8fb6ba" />
    </g>

    <!-- Fog: cloud over sliding lines -->
    <g v-else-if="scene === 'fog'">
      <path class="wx-cloud" d="M18 36a8 8 0 0 1-1.2-15.9A11 11 0 0 1 38 18a9 9 0 0 1 12 8.5A7.5 7.5 0 0 1 42.5 36z" fill="#619499" />
      <line class="wx-fog" x1="16" y1="44" x2="48" y2="44" stroke="#8fb6ba" stroke-width="3" stroke-linecap="round" />
      <line class="wx-fog wx-fog-2" x1="20" y1="51" x2="44" y2="51" stroke="#8fb6ba" stroke-width="3" stroke-linecap="round" />
    </g>

    <!-- Drizzle: cloud + sparse slow drops -->
    <g v-else-if="scene === 'drizzle'">
      <path class="wx-cloud" d="M18 38a8 8 0 0 1-1.2-15.9A11 11 0 0 1 38 20a9 9 0 0 1 12 8.5A7.5 7.5 0 0 1 42.5 38z" fill="#619499" />
      <circle class="wx-drop" cx="24" cy="46" r="2" fill="#5e9fa5" />
      <circle class="wx-drop wx-drop-2" cx="32" cy="46" r="2" fill="#5e9fa5" />
      <circle class="wx-drop wx-drop-3" cx="40" cy="46" r="2" fill="#5e9fa5" />
    </g>

    <!-- Rain / showers: cloud + falling streaks -->
    <g v-else-if="scene === 'rain'">
      <path class="wx-cloud" d="M18 36a8 8 0 0 1-1.2-15.9A11 11 0 0 1 38 18a9 9 0 0 1 12 8.5A7.5 7.5 0 0 1 42.5 36z" fill="#619499" />
      <line class="wx-drop" x1="23" y1="43" x2="20" y2="51" stroke="#5e9fa5" stroke-width="3" stroke-linecap="round" />
      <line class="wx-drop wx-drop-2" x1="33" y1="43" x2="30" y2="51" stroke="#5e9fa5" stroke-width="3" stroke-linecap="round" />
      <line class="wx-drop wx-drop-3" x1="43" y1="43" x2="40" y2="51" stroke="#5e9fa5" stroke-width="3" stroke-linecap="round" />
    </g>

    <!-- Thunderstorm: cloud + flashing bolt -->
    <g v-else-if="scene === 'storm'">
      <path class="wx-cloud" d="M18 34a8 8 0 0 1-1.2-15.9A11 11 0 0 1 38 16a9 9 0 0 1 12 8.5A7.5 7.5 0 0 1 42.5 34z" fill="#4a7d84" />
      <polygon class="wx-bolt" points="34,38 26,50 32,50 28,60 40,46 33,46" fill="#d6a039" />
      <line class="wx-drop wx-drop-2" x1="20" y1="40" x2="18" y2="46" stroke="#5e9fa5" stroke-width="2.5" stroke-linecap="round" />
      <line class="wx-drop wx-drop-3" x1="47" y1="40" x2="45" y2="46" stroke="#5e9fa5" stroke-width="2.5" stroke-linecap="round" />
    </g>

    <!-- Snow: cloud + drifting flakes (rare here, kept for completeness) -->
    <g v-else>
      <path class="wx-cloud" d="M18 36a8 8 0 0 1-1.2-15.9A11 11 0 0 1 38 18a9 9 0 0 1 12 8.5A7.5 7.5 0 0 1 42.5 36z" fill="#619499" />
      <circle class="wx-flake" cx="24" cy="45" r="2.5" fill="#8fb6ba" />
      <circle class="wx-flake wx-drop-2" cx="32" cy="45" r="2.5" fill="#8fb6ba" />
      <circle class="wx-flake wx-drop-3" cx="40" cy="45" r="2.5" fill="#8fb6ba" />
    </g>
  </svg>
</template>

<style scoped>
.wx-rays { animation: wx-spin 14s linear infinite; transform-origin: 32px 32px; }
.wx-cloud { animation: wx-drift 5s ease-in-out infinite; }
.wx-cloud-2 { animation-delay: -2.5s; }
.wx-drop { animation: wx-fall 1.4s ease-in infinite; }
.wx-drop-2 { animation-delay: 0.45s; }
.wx-drop-3 { animation-delay: 0.9s; }
.wx-flake { animation: wx-fall 2.4s ease-in-out infinite; }
.wx-fog { animation: wx-slide 4s ease-in-out infinite; }
.wx-fog-2 { animation-delay: -2s; }
.wx-bolt { animation: wx-flash 2.8s ease-in-out infinite; }

@keyframes wx-spin { to { transform: rotate(360deg); } }
@keyframes wx-drift { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(3px); } }
@keyframes wx-fall { 0% { transform: translateY(0); opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } 100% { transform: translateY(9px); opacity: 0; } }
@keyframes wx-slide { 0%, 100% { transform: translateX(-3px); } 50% { transform: translateX(3px); } }
@keyframes wx-flash { 0%, 55%, 100% { opacity: 1; } 62% { opacity: 0.1; } 70% { opacity: 1; } 78% { opacity: 0.2; } }

@media (prefers-reduced-motion: reduce) {
  .wx-rays, .wx-cloud, .wx-drop, .wx-flake, .wx-fog, .wx-bolt { animation: none; }
}
</style>
