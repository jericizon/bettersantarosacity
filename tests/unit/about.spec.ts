import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AboutPage from '~/pages/about/index.vue'

describe('About Page (/about)', () => {
  it('renders the mission and independence disclaimer', () => {
    const wrapper = mount(AboutPage, {
      global: {
        stubs: {
          CivicRoseMotif: true,
          DataSourceBadge: true,
          NuxtLink: { template: '<a><slot /></a>' }
        }
      }
    })

    expect(wrapper.find('h1').text()).toContain('About Better Santa Rosa City')
    expect(wrapper.text()).toContain('not an official website of the City Government of Santa Rosa')
    expect(wrapper.text()).toContain('community-maintained')
  })

  it('includes data principles and corrections workflow', () => {
    const wrapper = mount(AboutPage, {
      global: {
        stubs: {
          CivicRoseMotif: true,
          DataSourceBadge: true,
          NuxtLink: { template: '<a><slot /></a>' }
        }
      }
    })

    expect(wrapper.text()).toContain('Facts Before Opinions')
    expect(wrapper.text()).toContain('Source-First Verification')
    expect(wrapper.text()).toContain('Submit a Correction')
  })
})
