// tests/unit/barangays.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BarangaysIndex from '../../pages/barangays/index.vue'

describe('Barangays Explorer', () => {
  it('renders all three geographic groups', () => {
    const wrapper = mount(BarangaysIndex)
    expect(wrapper.text()).toContain('Laguna Lake')
    expect(wrapper.text()).toContain('Lowland Urban')
    expect(wrapper.text()).toContain('Upper / Tagaytay')
  })
})
