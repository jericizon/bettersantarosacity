import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import WeatherToday from '~/components/civic/WeatherToday.vue'

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

describe('CivicWeatherToday', () => {
  beforeEach(() => stubFetch(okResponse))
  afterEach(() => vi.unstubAllGlobals())

  it('renders current conditions and a 3-day forecast after fetch', async () => {
    const wrapper = mount(WeatherToday)
    await flushPromises()
    expect(wrapper.text()).toContain('31°C')
    expect(wrapper.text()).toContain('Partly cloudy')
    expect(wrapper.text()).toContain('74% humidity')
    expect(wrapper.text()).toContain('Feels like 35°C')
    const items = wrapper.findAll('[aria-label="3-day forecast"] li')
    expect(items).toHaveLength(3)
    expect(items[0]!.text()).toContain('Today')
    expect(items[1]!.text()).toContain('30°')
    expect(items[2]!.text()).toContain('80% rain')
  })

  it('starts in a loading state before fetch resolves', () => {
    const wrapper = mount(WeatherToday)
    expect(wrapper.text()).toContain('Fetching live weather')
    expect(wrapper.find('[aria-busy="true"]').exists()).toBe(true)
  })

  it('shows the PAGASA fallback when the request fails', async () => {
    stubFetch(null, false)
    const wrapper = mount(WeatherToday)
    await flushPromises()
    expect(wrapper.text()).toContain('Live weather is unavailable')
    expect(wrapper.find('a[href*="pagasa"]').exists()).toBe(true)
  })

  it('shows the PAGASA fallback when fetch throws', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    const wrapper = mount(WeatherToday)
    await flushPromises()
    expect(wrapper.text()).toContain('Live weather is unavailable')
  })

  it('credits Open-Meteo with a link', () => {
    const wrapper = mount(WeatherToday)
    expect(wrapper.find('a[href="https://open-meteo.com"]').exists()).toBe(true)
  })
})
