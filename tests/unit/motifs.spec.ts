import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RoseMotif from '~/components/civic/RoseMotif.vue'
import CityMapSvg from '~/components/civic/CityMapSvg.vue'

describe('Civic Motifs Components', () => {
  it('renders RoseMotif SVG with correct aria attributes', () => {
    const wrapper = mount(RoseMotif, {
      props: { size: 32 }
    })
    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.attributes('aria-hidden')).toBe('true')
  })

  it('renders CityMapSvg with 18 barangay elements and emits selection on click', async () => {
    const wrapper = mount(CityMapSvg, {
      props: { selectedSlug: 'aplaya' }
    })
    const regions = wrapper.findAll('[data-barangay-slug]')
    expect(regions.length).toBe(18)

    await regions[0]!.trigger('click')
    expect(wrapper.emitted('select')).toBeTruthy()
  })
})
