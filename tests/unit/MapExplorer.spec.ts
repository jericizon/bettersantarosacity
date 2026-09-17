// tests/unit/MapExplorer.spec.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import MapExplorer from '~/components/civic/MapExplorer.vue'

// Leaflet needs a real layout engine; stub the module surface MapExplorer uses.
const markerStubs: { on: ReturnType<typeof vi.fn>; setStyle: ReturnType<typeof vi.fn> }[] = []
vi.mock('leaflet', () => ({
  map: () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const m: any = { panTo: vi.fn(), remove: vi.fn() }
    m.setView = vi.fn(() => m)
    return m
  },
  tileLayer: () => ({ addTo: vi.fn() }),
  circleMarker: () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const m: any = {
      bindTooltip: vi.fn(),
      setStyle: vi.fn(),
      bringToFront: vi.fn(),
      getLatLng: () => ({ lat: 14.3, lng: 121.1 }),
      on: vi.fn()
    }
    m.addTo = vi.fn(() => m) // Leaflet chainable
    markerStubs.push(m)
    return m
  }
}))

const centroids = { barangays: Object.fromEntries(
  ['aplaya','caingin','sinalhan','balibago','dila','dita','ibaba','kanluran','labas','macabling','malitlit','malusak','market-area','pooc','tagapo','don-jose','pulong-santa-cruz','santo-domingo']
    .map(s => [s, { lat: 14.3, lon: 121.1 }])
)}

describe('MapExplorer Component', () => {
  beforeEach(() => {
    markerStubs.length = 0
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(centroids) }))
  })
  afterEach(() => vi.unstubAllGlobals())

  it('renders the explorer header and map host', async () => {
    const wrapper = mount(MapExplorer)
    expect(wrapper.text()).toContain('Explore Santa Rosa')
    expect(wrapper.text()).toContain('18 barangays')
    expect(wrapper.find('[data-testid="leaflet-map"]').exists()).toBe(true)
  })

  it('creates a marker per barangay and shows OSM attribution', async () => {
    const wrapper = mount(MapExplorer)
    await flushPromises()
    expect(markerStubs).toHaveLength(18)
    expect(wrapper.text()).toContain('OpenStreetMap contributors')
    expect(wrapper.text()).toContain('not official cadastral boundaries')
  })

  it('updates the detail card when the select changes', async () => {
    const wrapper = mount(MapExplorer)
    await flushPromises()
    const select = wrapper.find('#barangay-select')
    await select.setValue('sinalhan')
    expect(wrapper.text()).toContain('Sinalhan')
    expect(wrapper.text()).toContain('26,274')
  })
})
