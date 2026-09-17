import { vi } from 'vitest'

// MapLibre needs WebGL — happy-dom has none. Stub the module for every spec;
// files that inspect calls (MapExplorer.spec) keep their own richer mock.
vi.mock('maplibre-gl', () => ({
  default: {
    Map: class {
      addControl = vi.fn()
      addSource = vi.fn()
      addLayer = vi.fn()
      setFilter = vi.fn()
      easeTo = vi.fn()
      remove = vi.fn()
      fitBounds = vi.fn()
      setCenter = vi.fn()
      setZoom = vi.fn()
      getCanvas = () => ({ style: {} as Record<string, string> })
      on = vi.fn((event: string, layerOrCb: unknown) => {
        if (event === 'load' && typeof layerOrCb === 'function') (layerOrCb as () => void)()
      })
    },
    NavigationControl: class {},
    LngLatBounds: class {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      extend(c: any) { return this }
    }
  }
}))

// No real network in unit tests: MapExplorer reads a static centroids asset,
// WeatherToday calls Open-Meteo. Spec files may override per-test via stubGlobal.
vi.stubGlobal('fetch', vi.fn().mockImplementation((url: string) => {
  if (String(url).includes('open-meteo')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        current: { temperature_2m: 30, apparent_temperature: 34, relative_humidity_2m: 70, weather_code: 2 },
        daily: {
          time: ['2026-09-17', '2026-09-18', '2026-09-19'],
          weather_code: [2, 61, 95],
          temperature_2m_max: [32, 30, 29],
          temperature_2m_min: [24, 24, 23],
          precipitation_probability_max: [10, 65, 80]
        }
      })
    })
  }
  return Promise.resolve({ ok: true, json: () => Promise.resolve({ barangays: {} }) })
}))
