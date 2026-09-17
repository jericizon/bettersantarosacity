import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SourceBadge from '../../components/data/SourceBadge.vue'

describe('SourceBadge Component', () => {
  it('renders official badge correctly', () => {
    const wrapper = mount(SourceBadge, {
      props: {
        type: 'official',
        organization: 'City Government of Santa Rosa',
        date: '2026-09-17'
      }
    })
    expect(wrapper.text()).toContain('OFFICIAL')
    expect(wrapper.text()).toContain('City Government of Santa Rosa')
    expect(wrapper.text()).toContain('2026-09-17')
  })

  it('renders primary source with external URL link', () => {
    const wrapper = mount(SourceBadge, {
      props: {
        type: 'primary',
        organization: 'Commission on Audit',
        url: 'https://coa.gov.ph'
      }
    })
    expect(wrapper.text()).toContain('PRIMARY')
    expect(wrapper.find('a').attributes('href')).toBe('https://coa.gov.ph')
  })

  it('renders secondary and community badges with appropriate styling classes', () => {
    const secondaryWrapper = mount(SourceBadge, { props: { type: 'secondary' } })
    expect(secondaryWrapper.text()).toContain('SECONDARY')

    const commWrapper = mount(SourceBadge, { props: { type: 'community' } })
    expect(commWrapper.text()).toContain('BETTER SANTA ROSA')
  })
})
