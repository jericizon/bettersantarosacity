<script setup lang="ts">
import { ref, computed, onMounted, type Component } from 'vue'
import {
  Sun, CloudSun, Cloud, CloudFog, CloudDrizzle, CloudRain,
  CloudLightning, Snowflake, Droplets
} from 'lucide-vue-next'

// Santa Rosa City Hall area, Laguna. Open-Meteo is keyless, CORS-enabled and
// free for non-commercial use — the site stays fully static; the browser
// fetches live conditions at runtime only.
const API_URL =
  'https://api.open-meteo.com/v1/forecast?latitude=14.3122&longitude=121.1114' +
  '&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code' +
  '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max' +
  '&timezone=Asia%2FManila&forecast_days=3'

interface WmoInfo {
  label: string
  icon: Component
}

// WMO weather interpretation codes → label + icon.
const WMO: Record<number, WmoInfo> = {
  0: { label: 'Clear sky', icon: Sun },
  1: { label: 'Mostly clear', icon: Sun },
  2: { label: 'Partly cloudy', icon: CloudSun },
  3: { label: 'Overcast', icon: Cloud },
  45: { label: 'Fog', icon: CloudFog },
  48: { label: 'Icy fog', icon: CloudFog },
  51: { label: 'Light drizzle', icon: CloudDrizzle },
  53: { label: 'Drizzle', icon: CloudDrizzle },
  55: { label: 'Heavy drizzle', icon: CloudDrizzle },
  61: { label: 'Light rain', icon: CloudRain },
  63: { label: 'Rain', icon: CloudRain },
  65: { label: 'Heavy rain', icon: CloudRain },
  71: { label: 'Snow', icon: Snowflake },
  80: { label: 'Light showers', icon: CloudRain },
  81: { label: 'Showers', icon: CloudRain },
  82: { label: 'Heavy showers', icon: CloudRain },
  95: { label: 'Thunderstorm', icon: CloudLightning },
  96: { label: 'Thunderstorm, hail', icon: CloudLightning },
  99: { label: 'Severe thunderstorm', icon: CloudLightning }
}

const FALLBACK: WmoInfo = { label: 'Unknown', icon: Cloud }
const wmo = (code: number | undefined): WmoInfo => (code != null && WMO[code]) || FALLBACK

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

const nowInfo = computed(() => wmo(nowCode.value))

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
  <div class="border-t border-charcoal/10 pt-6" data-testid="weather-today">
    <!-- Loading: keeps SSR/prerender output stable before the client fetch. -->
    <div v-if="status === 'loading'" class="flex items-center gap-3 text-sm text-charcoal/60" aria-busy="true">
      <span class="inline-block h-2 w-2 animate-pulse rounded-full bg-laguna-blue" aria-hidden="true" />
      Fetching live weather for Santa Rosa…
    </div>

    <!-- Error: point readers at the national forecaster rather than hide. -->
    <p v-else-if="status === 'error'" class="text-sm text-charcoal/70">
      Live weather is unavailable right now. Check
      <a
        href="https://bagong.pagasa.dost.gov.ph"
        target="_blank"
        rel="noopener noreferrer"
        class="font-semibold text-laguna-green underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green rounded-sm"
      >PAGASA</a>
      for the official forecast.
    </p>

    <div v-else class="flex flex-wrap items-start justify-between gap-6">
      <div class="flex items-center gap-4">
        <component :is="nowInfo.icon" :size="44" class="shrink-0 text-laguna-blue" aria-hidden="true" />
        <div>
          <p class="font-serif text-4xl font-bold leading-none text-laguna-green">{{ nowTemp }}°C</p>
          <p class="mt-1 text-sm font-medium text-charcoal/80">{{ nowInfo.label }}</p>
          <p class="mt-0.5 flex items-center gap-1.5 text-xs text-charcoal/60">
            <Droplets :size="12" aria-hidden="true" />
            {{ nowHumidity }}% humidity · feels like {{ nowFeels }}°C
          </p>
        </div>
      </div>

      <ul class="flex gap-5" aria-label="3-day forecast">
        <li v-for="d in days" :key="d.day" class="text-center">
          <p class="text-xs font-semibold uppercase tracking-wide text-charcoal/60">{{ d.day }}</p>
          <component :is="wmo(d.code).icon" :size="20" class="mx-auto mt-1.5 text-laguna-blue" aria-hidden="true" />
          <p class="mt-1 text-sm font-semibold text-charcoal">{{ d.hi }}°<span class="font-normal text-charcoal/50"> / {{ d.lo }}°</span></p>
          <p v-if="d.precip > 0" class="text-[11px] text-laguna-blue">{{ d.precip }}% rain</p>
        </li>
      </ul>
    </div>

    <p class="mt-4 text-[11px] text-charcoal/50">
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
