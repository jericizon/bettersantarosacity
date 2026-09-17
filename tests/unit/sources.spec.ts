// tests/unit/sources.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SourcesPage from '../../pages/sources.vue'
import { toSourceReference } from '../../utils/source'

describe('Sources & Methodology', () => {
  it('explains the source hierarchy and editorial methodology', () => {
    const wrapper = mount(SourcesPage)
    expect(wrapper.text()).toContain('Source Hierarchy')
    expect(wrapper.text()).toContain('Methodology')
  })
})

describe('toSourceReference', () => {
  it('normalizes em-dashes in derived titles and keeps the url intact', () => {
    const ref = toSourceReference('City Government of Santa Rosa — About Us (https://x)')
    expect(ref.title).not.toContain('—')
    expect(ref.title).toBe('City Government of Santa Rosa · About Us')
    expect(ref.url).toBe('https://x')
  })
})
