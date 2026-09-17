<script setup lang="ts">
import AnimatedWeatherIcon from '~/components/civic/AnimatedWeatherIcon.vue'
import { useWeather, weatherLabel } from '~/composables/useWeather'

const { status, nowTemp, displayCode } = useWeather()
</script>

<template>
  <!-- Renders nothing until live data arrives (or if it fails), so prerendered
       output stays stable and the chip simply never appears on error. -->
  <div
    v-if="status === 'ready'"
    class="animate-fade-in-up inline-flex items-center gap-2 rounded-full border border-charcoal/10 bg-white/90 py-1.5 pl-2 pr-3.5 shadow-sm backdrop-blur"
    role="status"
    :aria-label="`Current weather in Santa Rosa: ${nowTemp} degrees, ${weatherLabel(displayCode)}`"
    data-testid="weather-chip"
  >
    <AnimatedWeatherIcon :code="displayCode" :size="26" class="shrink-0" />
    <span class="text-sm font-bold leading-none text-laguna-green">{{ nowTemp }}°C</span>
    <span class="text-xs font-medium leading-none text-charcoal/70">{{ weatherLabel(displayCode) }}</span>
  </div>
</template>
