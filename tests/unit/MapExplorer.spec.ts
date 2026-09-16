// tests/unit/MapExplorer.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MapExplorer from '~/components/civic/MapExplorer.vue'

describe('MapExplorer Component', () => {
  it('renders interactive map and selected barangay details', async () => {
    const wrapper = mount(MapExplorer)
    expect(wrapper.text()).toContain('Explore Santa Rosa')
    expect(wrapper.text()).toContain('18 barangays')
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('displays the mandatory cadastral survey disclaimer', () => {
    const wrapper = mount(MapExplorer)
    expect(wrapper.text()).toContain('Not official cadastral survey data')
    expect(wrapper.text()).toContain('Simplified map for information purposes')
  })

  it('updates selected barangay on SVG node selection', async () => {
    const wrapper = mount(MapExplorer)
    const sinalhanNode = wrapper.find('[data-barangay-slug="sinalhan"]')
    expect(sinalhanNode.exists()).toBe(true)
    await sinalhanNode.trigger('click')
    expect(wrapper.text()).toContain('Sinalhan')
  })
})
