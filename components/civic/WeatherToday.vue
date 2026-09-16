<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Droplets, Thermometer } from 'lucide-vue-next'
import AnimatedWeatherIcon from '~/components/civic/AnimatedWeatherIcon.vue'

// Santa Rosa City Hall area, Laguna. Open-Meteo is keyless, CORS-enabled and
// free for non-commercial use — the site stays fully static; the browser
// fetches live conditions at runtime only.
const API_URL =
  'https://api.open-meteo.com/v1/forecast?latitude=14.3122&longitude=121.1114' +
  '&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code' +
  '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max' +
  '&timezone=Asia%2FManila&forecast_days=3'

// WMO weather interpretation codes → short label (icons come from
// AnimatedWeatherIcon, keyed by the same code).
const WMO_LABEL: Record<number, string> = {
  0: 'Clear sky', 1: 'Mostly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Icy fog',
  51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle',
  61: 'Light rain', 63: 'Rain', 65: 'Heavy rain',
  71: 'Snow',
  80: 'Light showers', 81: 'Showers', 82: 'Heavy showers',
  95: 'Thunderstorm', 96: 'Thunderstorm, hail', 99: 'Severe thunderstorm'
}

const label = (code: number | undefined): string => (code != null && WMO_LABEL[code]) || 'Unknown'

interface DayForecast {
  day: string
  code: number
  hi: number
  lo: number
  precip: number
}

const status = ref<'loading' | 'ready' | 'error'>('loading')
const nowTemp = ref(0)
const nowFeels = ref(0)
const nowHumidity = ref(0)
const nowCode = ref<number>()
const days = ref<DayForecast[]>([])

onMounted(async () => {
  try {
    const res = await fetch(API_URL)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    nowTemp.value = Math.round(data.current.temperature_2m)
    nowFeels.value = Math.round(data.current.apparent_temperature)
    nowHumidity.value = Math.round(data.current.relative_humidity_2m)
    nowCode.value = data.current.weather_code
    days.value = (data.daily.time as string[]).map((t, i) => ({
      day: i === 0 ? 'Today' : new Date(`${t}T12:00:00`).toLocaleDateString('en-PH', { weekday: 'short' }),
      code: data.daily.weather_code[i],
      hi: Math.round(data.daily.temperature_2m_max[i]),
      lo: Math.round(data.daily.temperature_2m_min[i]),
      precip: data.daily.precipitation_probability_max?.[i] ?? 0
    }))
    status.value = 'ready'
  } catch {
    status.value = 'error'
  }
})
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
