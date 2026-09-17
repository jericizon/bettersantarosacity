import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import cityData from '~/data/city.json'
import HistoryPage from '~/pages/history/index.vue'

describe('History Page (/history)', () => {
  it('renders the page title and historical overview', () => {
    const wrapper = mount(HistoryPage, {
      global: {
        stubs: {
          CivicRoseMotif: true,
          DataSourceBadge: true,
          NuxtLink: { template: '<a><slot /></a>' }
        }
      }
    })

    expect(wrapper.find('h1').text()).toContain('From Bukol to Modern Santa Rosa')
    expect(wrapper.text()).toContain('1571')
    expect(wrapper.text()).toContain('2025')
  })

  it('renders all 11 chronological milestones from city.json', () => {
    const wrapper = mount(HistoryPage, {
      global: {
        stubs: {
          CivicRoseMotif: true,
          DataSourceBadge: true,
          NuxtLink: { template: '<a><slot /></a>' }
        }
      }
    })

    expect(cityData.timeline.length).toBe(11)
    for (const item of cityData.timeline) {
      expect(wrapper.text()).toContain(item.year)
    }
  })

  it('includes sources and verification metadata', () => {
    const wrapper = mount(HistoryPage, {
      global: {
        stubs: {
          CivicRoseMotif: true,
          DataSourceBadge: true,
          NuxtLink: { template: '<a><slot /></a>' }
        }
      }
    })

    expect(wrapper.text()).toContain('City Government of Santa Rosa')
    expect(wrapper.text()).toContain(cityData.lastVerified)
  })
})
