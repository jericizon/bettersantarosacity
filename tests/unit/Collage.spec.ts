// tests/unit/Collage.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Collage from '~/components/civic/Collage.vue'

describe('Collage Editorial Component', () => {
  it('renders curated local landmark images with photo credits', () => {
    const wrapper = mount(Collage)
    expect(wrapper.text()).toContain('Santa Rosa Life & Heritage')
    expect(wrapper.text()).toContain('Photo:')
    const images = wrapper.findAll('img')
    expect(images.length).toBeGreaterThanOrEqual(3)
  })
})
