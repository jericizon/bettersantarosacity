import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'
import WeatherFogVeil from '~/components/civic/WeatherFogVeil.vue'
import { resetWeatherState, overrideWeatherScene } from '~/composables/useWeather'

const baseResponse = {
  current: {
    temperature_2m: 31.4,
    apparent_temperature: 35.2,
    relative_humidity_2m: 74,
    weather_code: 45
  },
  daily: {
    time: ['2026-09-17', '2026-09-18', '2026-09-19'],
    weather_code: [45, 45, 45],
    temperature_2m_max: [32, 30, 29],
    temperature_2m_min: [24, 24, 23],
    precipitation_probability_max: [10, 65, 80]
  }
}

function stubFetch(code: number, ok = true) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok,
    json: () => Promise.resolve({
      ...baseResponse,
      current: { ...baseResponse.current, weather_code: code }
    })
  }))
}

describe('CivicWeatherFogVeil', () => {
  beforeEach(() => { resetWeatherState(); stubFetch(45) })
  afterEach(() => vi.unstubAllGlobals())

  it('renders nothing while the fetch is pending', () => {
    const wrapper = mount(WeatherFogVeil)
    expect(wrapper.find('[data-testid="weather-veil"]').exists()).toBe(false)
  })

  it('stays hidden for non-fog scenes', async () => {
    stubFetch(61)
    const wrapper = mount(WeatherFogVeil)
    await flushPromises()
    expect(wrapper.find('[data-testid="weather-veil"]').exists()).toBe(false)
  })

  it('veils its parent box once fog data arrives', async () => {
    const wrapper = mount(WeatherFogVeil)
    await flushPromises()
    const veil = wrapper.find('[data-testid="weather-veil"]')
    expect(veil.exists()).toBe(true)
    expect(veil.classes()).toContain('fogveil')
    expect(wrapper.findAll('.fogveil-band')).toHaveLength(3)
  })

  it('is aria-hidden', async () => {
    const wrapper = mount(WeatherFogVeil)
    await flushPromises()
    const veil = wrapper.find('[data-testid="weather-veil"]')
    expect(veil.attributes('aria-hidden')).toBe('true')
    // .fogveil carries pointer-events: none in scoped CSS
    expect(veil.classes()).toContain('fogveil')
  })

  it('shows immediately when the debug override forces fog', () => {
    overrideWeatherScene(45)
    const wrapper = mount(WeatherFogVeil)
    expect(wrapper.find('[data-testid="weather-veil"]').exists()).toBe(true)
  })

  it('clears when the override switches to a non-fog scene', async () => {
    overrideWeatherScene(45)
    const wrapper = mount(WeatherFogVeil)
    expect(wrapper.find('[data-testid="weather-veil"]').exists()).toBe(true)
    overrideWeatherScene(0)
    await nextTick()
    expect(wrapper.find('[data-testid="weather-veil"]').exists()).toBe(false)
  })
})
