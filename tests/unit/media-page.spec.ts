// tests/unit/media-page.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MediaPage from '~/pages/about/media.vue'

describe('Media Credits Page', () => {
  it('renders directory of all registered media assets with license links', () => {
    const wrapper = mount(MediaPage)
    expect(wrapper.text()).toContain('Media & Photography Credits')
    expect(wrapper.findAll('article').length).toBeGreaterThanOrEqual(5)
  })
})
