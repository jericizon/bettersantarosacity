// tests/unit/sources.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SourcesPage from '../../pages/sources.vue'

describe('Sources & Methodology', () => {
  it('explains the source hierarchy and editorial methodology', () => {
    const wrapper = mount(SourcesPage)
    expect(wrapper.text()).toContain('Source Hierarchy')
    expect(wrapper.text()).toContain('Methodology')
  })
})
