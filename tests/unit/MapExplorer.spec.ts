// tests/unit/MapExplorer.spec.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import MapExplorer from '~/components/civic/MapExplorer.vue'

// MapLibre needs WebGL; stub the module surface MapExplorer uses.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapInstances: { addSource: ReturnType<typeof vi.fn>; [k: string]: any }[] = []
vi.mock('maplibre-gl', () => ({
  default: {
    Map: class {
      addControl = vi.fn()
      addSource = vi.fn()
      addLayer = vi.fn()
      setFilter = vi.fn()
      easeTo = vi.fn()
      remove = vi.fn()
      getCanvas = () => ({ style: {} as Record<string, string> })
      on = vi.fn((event: string, layerOrCb: unknown, cb?: (e: unknown) => void) => {
        if (event === 'load' && typeof layerOrCb === 'function') (layerOrCb as () => void)()
      })
      constructor() { mapInstances.push(this) }
      fitBounds = vi.fn()
      setCenter = vi.fn()
      setZoom = vi.fn()
    },
    NavigationControl: class {},
    LngLatBounds: class {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      extend(c: any) { return this }
    }
  }
}))

const centroids = { barangays: Object.fromEntries(
  ['aplaya','caingin','sinalhan','balibago','dila','dita','ibaba','kanluran','labas','macabling','malitlit','malusak','market-area','pooc','tagapo','don-jose','pulong-santa-cruz','santo-domingo']
    .map(s => [s, { lat: 14.3, lon: 121.1 }])
)}

describe('MapExplorer Component', () => {
  beforeEach(() => {
    mapInstances.length = 0
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(centroids) }))
  })
  afterEach(() => vi.unstubAllGlobals())

  it('renders the explorer header and map host', async () => {
    const wrapper = mount(MapExplorer)
    expect(wrapper.text()).toContain('Explore Santa Rosa')
    expect(wrapper.text()).toContain('18 barangays')
    expect(wrapper.find('[data-testid="explore-map"]').exists()).toBe(true)
  })

  it('adds a GeoJSON source with all 18 barangays and shows attribution', async () => {
    const wrapper = mount(MapExplorer)
    await flushPromises()
    expect(mapInstances).toHaveLength(1)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const source = mapInstances[0]!.addSource.mock.calls.find((c: any[]) => c[0] === 'barangays')
    expect(source?.[1].data.features).toHaveLength(18)
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
