import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import updatesData from '../../data/updates.json'
import { CityUpdateSchema } from '../../types/civic'
import UpdatesIndex from '../../pages/updates/index.vue'

describe('City Updates Feature', () => {
  it('validates updates.json against CityUpdateSchema', () => {
    expect(updatesData.length).toBeGreaterThanOrEqual(3)
    for (const update of updatesData) {
      const res = CityUpdateSchema.safeParse(update)
      expect(res.success, update.title).toBe(true)
    }
  })

  it('renders updates directory with category filters and official source badges', () => {
    const wrapper = mount(UpdatesIndex, {
      global: {
        stubs: {
          NuxtLink: { template: '<a><slot /></a>' },
          DataSourceBadge: true,
          DataLastVerified: true,
          UpdateCard: { template: '<div class="update-card"><slot /></div>' }
        }
      }
    })
    expect(wrapper.find('h1').text()).toContain('City Updates')
    expect(wrapper.text()).toContain('traffic')
    expect(wrapper.text()).toContain('emergency')
  })
})
