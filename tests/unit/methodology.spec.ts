import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MethodologyPage from '../../pages/about/methodology.vue'

describe('Methodology Page (/about/methodology)', () => {
  it('renders methodology heading and core principles', () => {
    const wrapper = mount(MethodologyPage, {
      global: {
        stubs: {
          NuxtLink: { template: '<a><slot /></a>' },
          DataSourceBadge: true,
          DataLastVerified: true
        }
      }
    })
    expect(wrapper.find('h1').text()).toContain('Methodology & Standards')
    expect(wrapper.text()).toContain('Primary-source preference')
    expect(wrapper.text()).toContain('Verification process')
    expect(wrapper.text()).toContain('Found an error?')
    expect(wrapper.text()).toContain('Independent civic-information project')
  })
})
