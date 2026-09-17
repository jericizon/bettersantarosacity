<script setup lang="ts">
import { Droplets, Thermometer } from 'lucide-vue-next'
import AnimatedWeatherIcon from '~/components/civic/AnimatedWeatherIcon.vue'
import { useWeather, weatherLabel as label } from '~/composables/useWeather'

const { status, nowTemp, nowFeels, nowHumidity, nowCode, days } = useWeather()
</script>

<template>
  <div
    class="rounded-2xl border border-laguna-green/15 bg-light-green/70 px-6 py-6 sm:px-8 sm:py-7"
    data-testid="weather-today"
  >
    <p class="text-xs font-semibold uppercase tracking-[0.18em] text-laguna-green">
      Live weather · Santa Rosa
    </p>

    <!-- Loading: keeps SSR/prerender output stable before the client fetch. -->
    <div v-if="status === 'loading'" class="mt-4 flex items-center gap-3 text-sm text-charcoal/60" aria-busy="true">
      <span class="inline-block h-2 w-2 animate-pulse rounded-full bg-laguna-blue" aria-hidden="true" />
      Fetching live weather for Santa Rosa…
    </div>

    <!-- Error: point readers at the national forecaster rather than hide. -->
    <p v-else-if="status === 'error'" class="mt-4 text-sm text-charcoal/70">
      Live weather is unavailable right now. Check
      <a
        href="https://bagong.pagasa.dost.gov.ph"
        target="_blank"
        rel="noopener noreferrer"
        class="font-semibold text-laguna-green underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green rounded-sm"
      >PAGASA</a>
      for the official forecast.
    </p>

    <div v-else class="mt-5 flex flex-wrap items-center justify-between gap-8">
      <div class="flex items-center gap-5">
        <AnimatedWeatherIcon :code="nowCode" :size="72" class="shrink-0" />
        <div>
          <p class="font-serif text-5xl font-bold leading-none text-laguna-green sm:text-6xl">{{ nowTemp }}°C</p>
          <p class="mt-1.5 text-base font-medium text-charcoal/80">{{ label(nowCode) }}</p>
          <div class="mt-2 flex flex-wrap items-center gap-2 text-xs text-charcoal/70">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1">
              <Droplets :size="12" class="text-laguna-blue" aria-hidden="true" />
              {{ nowHumidity }}% humidity
            </span>
            <span class="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1">
              <Thermometer :size="12" class="text-rose-accent" aria-hidden="true" />
              Feels like {{ nowFeels }}°C
            </span>
          </div>
        </div>
      </div>

      <ul class="flex gap-3 sm:gap-4" aria-label="3-day forecast">
        <li
          v-for="d in days"
          :key="d.day"
          class="rounded-xl bg-white/80 px-4 py-3 text-center min-w-[4.5rem]"
        >
          <p class="text-xs font-semibold uppercase tracking-wide text-charcoal/60">{{ d.day }}</p>
          <AnimatedWeatherIcon :code="d.code" :size="30" class="mx-auto mt-1.5" />
          <p class="mt-1.5 text-sm font-semibold text-charcoal">{{ d.hi }}°<span class="font-normal text-charcoal/50"> / {{ d.lo }}°</span></p>
          <p v-if="d.precip > 0" class="mt-0.5 text-[11px] font-medium text-laguna-blue">{{ d.precip }}% rain</p>
        </li>
      </ul>
    </div>

    <p class="mt-5 text-[11px] text-charcoal/50">
      Weather data:
      <a
        href="https://open-meteo.com"
        target="_blank"
        rel="noopener noreferrer"
        class="underline underline-offset-2 hover:text-laguna-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green rounded-sm"
      >Open-Meteo.com</a>
      (CC BY 4.0) · live conditions, not a city government advisory
    </p>
  </div>
</template>
