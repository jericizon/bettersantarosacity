import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import WeatherAmbience from '~/components/civic/WeatherAmbience.vue'
import { resetWeatherState, overrideWeatherScene } from '~/composables/useWeather'

const baseResponse = {
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

function stubFetch(code: number, ok = true) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok,
    json: () => Promise.resolve({
      ...baseResponse,
      current: { ...baseResponse.current, weather_code: code }
    })
  }))
}

describe('CivicWeatherAmbience', () => {
  beforeEach(() => { resetWeatherState(); stubFetch(2) })
  afterEach(() => vi.unstubAllGlobals())

  it('renders nothing while the fetch is pending', () => {
    const wrapper = mount(WeatherAmbience)
    expect(wrapper.find('[data-testid="weather-ambience"]').exists()).toBe(false)
  })

  it('stays hidden when the request fails', async () => {
    stubFetch(2, false)
    const wrapper = mount(WeatherAmbience)
    await flushPromises()
    expect(wrapper.find('[data-testid="weather-ambience"]').exists()).toBe(false)
  })

  it('renders birds, motes and travelling clouds per scene', async () => {
    stubFetch(0)
    const sun = mount(WeatherAmbience)
    await flushPromises()
    expect(sun.findAll('.amb-bird')).toHaveLength(4)
    expect(sun.findAll('.amb-mote')).toHaveLength(9)
    sun.unmount()

    resetWeatherState()
    stubFetch(2)
    const partly = mount(WeatherAmbience)
    await flushPromises()
    expect(partly.findAll('.amb-cloud--cross')).toHaveLength(3)
    // each cloud is a face-bearing character
    expect(partly.findAll('.cc-eyes')).toHaveLength(3)
    expect(partly.findAll('.amb-bird')).toHaveLength(0)
  })

  it('dims overcast with gray cloud characters', async () => {
    stubFetch(3)
    const wrapper = mount(WeatherAmbience)
    await flushPromises()
    expect(wrapper.find('[data-testid="weather-ambience"]').attributes('data-scene')).toBe('cloud')
    expect(wrapper.findAll('.amb-cloud--gray')).toHaveLength(4)
    expect(wrapper.findAll('.cc-eyes')).toHaveLength(4)
  })

  it('fills the banner with rain streaks for rain codes', async () => {
    stubFetch(61)
    const wrapper = mount(WeatherAmbience)
    await flushPromises()
    expect(wrapper.findAll('.amb-drop')).toHaveLength(26)
  })

  it('adds a lightning bolt and wash for thunderstorms', async () => {
    stubFetch(95)
    const wrapper = mount(WeatherAmbience)
    await flushPromises()
    expect(wrapper.find('.amb-bolt').exists()).toBe(true)
    expect(wrapper.find('.amb-flash').exists()).toBe(true)
    expect(wrapper.findAll('.amb-cloud--gray')).toHaveLength(4)
    expect(wrapper.findAll('.cc-eyes')).toHaveLength(4)
  })

  it('keeps fog bands behind the content; veil lives on the emblem', async () => {
    stubFetch(45)
    const wrapper = mount(WeatherAmbience)
    await flushPromises()
    expect(wrapper.find('[data-testid="weather-ambience"]').attributes('data-scene')).toBe('fog')
    expect(wrapper.findAll('.amb-fogband')).toHaveLength(3)
    // The veil is WeatherFogVeil.vue, mounted on the emblem in index.vue —
    // the ambience layer itself must not cover the hero content.
    expect(wrapper.find('[data-testid="weather-veil"]').exists()).toBe(false)
  })

  it('makes birds and cloud characters draggable', async () => {
    stubFetch(0)
    const sun = mount(WeatherAmbience)
    await flushPromises()
    const birdDrags = sun.findAll('.amb-bird .wxdrag')
    expect(birdDrags).toHaveLength(4)
    // A pointer drag applies a translate3d offset to the element.
    const d = birdDrags[0]!
    await d.trigger('pointerdown', { clientX: 100, clientY: 100, button: 0 })
    await d.trigger('pointermove', { clientX: 180, clientY: 140 })
    expect(d.attributes('style')).toContain('translate3d(80px, 40px')
    await d.trigger('pointerup', { clientX: 180, clientY: 140 })
    sun.unmount()

    resetWeatherState()
    stubFetch(2)
    const partly = mount(WeatherAmbience)
    await flushPromises()
    expect(partly.findAll('.amb-cloud--cross .wxdrag')).toHaveLength(3)
  })

  it('is aria-hidden and non-interactive', async () => {
    const wrapper = mount(WeatherAmbience)
    await flushPromises()
    const layer = wrapper.find('[data-testid="weather-ambience"]')
    expect(layer.attributes('aria-hidden')).toBe('true')
    expect(layer.classes()).toContain('pointer-events-none')
  })

  it('shows the forced scene immediately when the debug override is set', () => {
    overrideWeatherScene(95)
    const wrapper = mount(WeatherAmbience)
    // No flushPromises: layer must appear without waiting for the fetch.
    const layer = wrapper.find('[data-testid="weather-ambience"]')
    expect(layer.exists()).toBe(true)
    expect(layer.attributes('data-scene')).toBe('storm')
  })

  it('follows the debug override over live data', async () => {
    overrideWeatherScene(0)
    const wrapper = mount(WeatherAmbience)
    await flushPromises()
    // Live fetch says suncloud (code 2), but the override wins → sun.
    expect(wrapper.find('[data-testid="weather-ambience"]').attributes('data-scene')).toBe('sun')
  })
})
