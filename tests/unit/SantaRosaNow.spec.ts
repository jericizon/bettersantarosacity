import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SantaRosaNow from '../../components/civic/SantaRosaNow.vue'

describe('Santa Rosa Now', () => {
  it('renders weather and recent city updates with no traffic UI', () => {
    const wrapper = mount(SantaRosaNow, {
      global: {
        stubs: {
          NuxtLink: { template: '<a><slot /></a>' },
          CivicWeatherToday: { template: '<div class="weather-stub">Weather Conditions</div>' },
          UpdatesUpdateCard: { template: '<div class="update-stub">Update Item</div>' }
        }
      }
    })
    expect(wrapper.text()).toContain('Santa Rosa Now')
    expect(wrapper.text()).toContain('City Updates & Conditions')
    expect(wrapper.text()).toContain('Current weather and recent public information from Santa Rosa.')
    expect(wrapper.text()).toContain('Recent City Updates')
    expect(wrapper.find('.weather-stub').exists()).toBe(true)
    expect(wrapper.findAll('.update-stub').length).toBeGreaterThan(0)
    expect(wrapper.text()).toContain('All City Updates')
    expect(wrapper.text()).not.toContain('Traffic')
    expect(wrapper.find('.traffic-stub').exists()).toBe(false)
  })
})
