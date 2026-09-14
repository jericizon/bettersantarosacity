// tests/unit/homepage.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import IndexPage from '../../pages/index.vue'

describe('Homepage Civic Sections', () => {
  it('contains core city facts (18 barangays, land area, 2004 cityhood)', () => {
    const wrapper = mount(IndexPage)
    expect(wrapper.text()).toContain('18')
    expect(wrapper.text()).toContain('Barangays')
    expect(wrapper.text()).toContain('5,543 ha')
    expect(wrapper.text()).toContain('2004')
  })

  it('renders trust statement and source verification indicators', () => {
    const wrapper = mount(IndexPage)
    expect(wrapper.text()).toContain('Independent community project')
    expect(wrapper.text()).toContain('Last checked')
  })
})
