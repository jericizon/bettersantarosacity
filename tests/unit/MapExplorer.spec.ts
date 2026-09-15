import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MapExplorer from '~/components/civic/MapExplorer.vue'

describe('MapExplorer Component', () => {
  it('renders interactive map and selected barangay details', () => {
    const wrapper = mount(MapExplorer)
    expect(wrapper.text()).toContain('Explore Santa Rosa')
    expect(wrapper.find('select').exists()).toBe(true)
  })
})
