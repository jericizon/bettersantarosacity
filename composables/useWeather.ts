import { computed, onMounted, ref } from 'vue'

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

export const weatherLabel = (code: number | undefined): string =>
  (code != null && WMO_LABEL[code]) || 'Unknown'

// Shared scene grouping: the chip icon, forecast icons and the hero ambience
// layer all key off this so they always depict the same condition.
export type WeatherScene = 'sun' | 'suncloud' | 'cloud' | 'fog' | 'drizzle' | 'rain' | 'storm' | 'snow'

const WMO_SCENE: Record<number, WeatherScene> = {
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

export const weatherScene = (code: number | undefined): WeatherScene =>
  (code != null && WMO_SCENE[code]) || 'cloud'

export interface DayForecast {
  day: string
  code: number
  hi: number
  lo: number
  precip: number
}

// Module-level state is shared by every consumer (hero chip, WeatherToday), so
// a page session makes at most one Open-Meteo request; errors are terminal for
// the session, matching the previous per-component behaviour.
const status = ref<'loading' | 'ready' | 'error'>('loading')
const nowTemp = ref(0)
const nowFeels = ref(0)
const nowHumidity = ref(0)
const nowCode = ref<number>()
const days = ref<DayForecast[]>([])

// Debug override: when set, the banner/chip depict this code instead of the
// live one. In-memory only — resets on reload and never reaches the API.
const debugCode = ref<number | null>(null)
const displayCode = computed(() => debugCode.value ?? nowCode.value)
const scene = computed<WeatherScene>(() => weatherScene(displayCode.value))

export function overrideWeatherScene(code: number | null) {
  debugCode.value = code
}

let inflight: Promise<void> | null = null

async function load() {
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
}

export function useWeather() {
  onMounted(() => {
    if (status.value === 'loading' && !inflight) {
      inflight = load().finally(() => { inflight = null })
    }
  })
  return { status, nowTemp, nowFeels, nowHumidity, nowCode, days, scene, debugCode, displayCode }
}

// Specs stub fetch per test, so shared state must not leak between mounts.
export function resetWeatherState() {
  status.value = 'loading'
  nowTemp.value = 0
  nowFeels.value = 0
  nowHumidity.value = 0
  nowCode.value = undefined
  days.value = []
  debugCode.value = null
  inflight = null
}
