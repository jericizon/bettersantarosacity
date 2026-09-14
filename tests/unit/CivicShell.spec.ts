import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DisclaimerBanner from '../../components/civic/DisclaimerBanner.vue'
import SourceBadge from '../../components/data/SourceBadge.vue'

describe('Civic Shell Components', () => {
  it('renders disclaimer stating non-governmental status', () => {
    const wrapper = mount(DisclaimerBanner)
    expect(wrapper.text()).toContain('not an official City Government of Santa Rosa website')
  })

  it('renders official vs community presentation badge', () => {
    const wrapper = mount(SourceBadge, {
      props: { type: 'official' }
    })
    expect(wrapper.text()).toContain('Official source')
  })
})
