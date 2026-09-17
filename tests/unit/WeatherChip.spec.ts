import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import WeatherChip from '~/components/civic/WeatherChip.vue'
import { resetWeatherState } from '~/composables/useWeather'

const okResponse = {
  current: {
    temperature_2m: 31.4,
    apparent_temperature: 35.2,
    relative_humidity_2m: 74,
    weather_code: 2
  },
  daily: {
    time: ['2026-09-17', '2026-09-18', '2026-09-19'],
    weather_code: [2, 61, 95],
    temperature_2m_max: [32.4, 30.1, 29.0],
    temperature_2m_min: [24.2, 24.8, 23.9],
    precipitation_probability_max: [10, 65, 80]
  }
}

function stubFetch(body: unknown, ok = true) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok,
    json: () => Promise.resolve(body)
  }))
}

describe('CivicWeatherChip', () => {
  beforeEach(() => { resetWeatherState(); stubFetch(okResponse) })
  afterEach(() => vi.unstubAllGlobals())

  it('renders icon, temperature and condition after fetch', async () => {
    const wrapper = mount(WeatherChip)
    await flushPromises()
    const chip = wrapper.find('[data-testid="weather-chip"]')
    expect(chip.exists()).toBe(true)
    expect(chip.text()).toContain('31°C')
    expect(chip.text()).toContain('Partly cloudy')
    expect(chip.attributes('aria-label')).toBe(
      'Current weather in Santa Rosa: 31 degrees, Partly cloudy'
    )
    expect(chip.find('svg.weather-icon').exists()).toBe(true)
  })

  it('renders nothing while the fetch is pending', () => {
    const wrapper = mount(WeatherChip)
    expect(wrapper.find('[data-testid="weather-chip"]').exists()).toBe(false)
  })

  it('stays hidden when the request fails', async () => {
    stubFetch(null, false)
    const wrapper = mount(WeatherChip)
    await flushPromises()
    expect(wrapper.find('[data-testid="weather-chip"]').exists()).toBe(false)
  })

  it('shares one fetch when mounted alongside other consumers', async () => {
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(okResponse)
    })
    vi.stubGlobal('fetch', fetchSpy)
    const { default: WeatherToday } = await import('~/components/civic/WeatherToday.vue')
    mount(WeatherChip)
    mount(WeatherToday)
    await flushPromises()
    expect(fetchSpy).toHaveBeenCalledTimes(1)
  })
})
