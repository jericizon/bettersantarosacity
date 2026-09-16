// tests/unit/explore.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ExplorePage from '../../pages/explore.vue'
import Timeline from '../../components/civic/Timeline.vue'

describe('City Profile / Explore Page', () => {
  it('displays the historical journey from Barrio Bukol to Cityhood', () => {
    const wrapper = mount(ExplorePage)
    expect(wrapper.text()).toContain('Barrio Bukol')
    expect(wrapper.text()).toContain('2004')
  })

  it('keeps the shared timeline on its default light theme without unsupported superlatives', () => {
    const wrapper = mount(ExplorePage)
    const timeline = wrapper.findComponent(Timeline)
    expect(timeline.exists()).toBe(true)
    // The dark theme is reserved for the homepage deep-green chapter.
    expect(timeline.props('theme')).toBe('light')
    // Superlatives lacking verifiable comparison methodology must NOT be present (spec §21)
    expect(wrapper.text()).not.toContain("Luzon's richest city outside Metro Manila")
  })
})
