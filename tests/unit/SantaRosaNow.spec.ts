import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TrafficMap from '../../components/civic/TrafficMap.vue'
import SantaRosaNow from '../../components/civic/SantaRosaNow.vue'

describe('Santa Rosa Now & TrafficMap', () => {
  it('renders TrafficMap with accessible status badges and disclaimer', () => {
    const wrapper = mount(TrafficMap)
    expect(wrapper.text()).toContain('Traffic information')
    expect(wrapper.text()).toContain('Normal')
    expect(wrapper.text()).toContain('Slow')
    expect(wrapper.text()).toContain('Heavy')
    expect(wrapper.text()).toContain('Santa Rosa, Laguna')
  })

  it('renders SantaRosaNow combining Weather, Traffic, and City Updates', () => {
    const wrapper = mount(SantaRosaNow, {
      global: {
        stubs: {
          NuxtLink: { template: '<a><slot /></a>' },
          CivicWeatherToday: { template: '<div class="weather-stub">Weather Conditions</div>' },
          CivicTrafficMap: { template: '<div class="traffic-stub">Traffic Map</div>' },
          UpdatesUpdateCard: { template: '<div class="update-stub">Update Item</div>' }
        }
      }
    })
    expect(wrapper.text()).toContain('Santa Rosa Now')
    expect(wrapper.text()).toContain('What is happening in Santa Rosa right now')
    expect(wrapper.text()).toContain('Traffic Map')
    expect(wrapper.text()).toContain('Recent Advisories')
  })
})
