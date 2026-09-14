// tests/unit/explore.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ExplorePage from '../../pages/explore.vue'

describe('City Profile / Explore Page', () => {
  it('displays the historical journey from Barrio Bukol to Cityhood', () => {
    const wrapper = mount(ExplorePage)
    expect(wrapper.text()).toContain('Barrio Bukol')
    expect(wrapper.text()).toContain('2004')
  })
})
