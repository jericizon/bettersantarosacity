import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RoseMotif from '~/components/civic/RoseMotif.vue'

describe('Civic Motifs Components', () => {
  it('renders RoseMotif SVG with correct aria attributes', () => {
    const wrapper = mount(RoseMotif, {
      props: { size: 32 }
    })
    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.attributes('aria-hidden')).toBe('true')
  })
})
