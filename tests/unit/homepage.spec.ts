// tests/unit/homepage.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import IndexPage from '../../pages/index.vue'
import HeroSearch from '../../components/civic/HeroSearch.vue'
import MapExplorer from '../../components/civic/MapExplorer.vue'
import Collage from '../../components/civic/Collage.vue'
import StatCard from '../../components/data/StatCard.vue'

describe('Homepage Civic Sections & Chapter Architecture', () => {
  it('renders all 10 editorial chapters with their designated components', () => {
    const wrapper = mount(IndexPage)
    // 1. Hero
    expect(wrapper.findComponent(HeroSearch).exists()).toBe(true)
    // 2. Santa Rosa Today
    expect(wrapper.text()).toContain('Santa Rosa Today')
    expect(wrapper.findAllComponents(StatCard)).toHaveLength(4)
    // 3. Explore Santa Rosa
    expect(wrapper.findComponent(MapExplorer).exists()).toBe(true)
    // 4. City Money
    expect(wrapper.text()).toContain('How city revenue has changed')
    // 5. Building the City
    expect(wrapper.text()).toContain('Building the City')
    // 6. From Bukol to Today
    expect(wrapper.text()).toContain('From Bukol to Today')
    // 7. Life & Heritage
    expect(wrapper.findComponent(Collage).exists()).toBe(true)
    // 8. Laws & Services
    expect(wrapper.text()).toContain('Laws & Decisions')
    expect(wrapper.text()).toContain('Services')
    // 9. Data & Downloads
    expect(wrapper.text()).toContain('Data & Downloads')
    // 10. Data Trust & Sources
    expect(wrapper.text()).toContain('Data Trust')
    expect(wrapper.text()).toContain('About this project')
  })

  it('verifies absence of unverified superlatives and enforces neutral civic language', () => {
    const wrapper = mount(IndexPage)
    expect(wrapper.text()).not.toContain("Luzon's richest city outside Metro Manila")
    expect(wrapper.text()).toContain('Independent community project')
  })

  it('contains core city facts as count-up stat cards with numeric contracts', () => {
    const wrapper = mount(IndexPage)
    const cards = wrapper.findAllComponents(StatCard)
    expect(cards).toHaveLength(4)
    expect(cards.map(c => c.props('numericValue'))).toEqual(
      expect.arrayContaining([18, 5543])
    )
    expect(wrapper.text()).toContain('Barangays')
    expect(wrapper.text()).toContain('Land area')
    expect(wrapper.text()).toContain('Cityhood')
    expect(wrapper.text()).toContain('2004')
  })

  it('shows the site emblem as the hero image and verifies photo attribution', () => {
    const wrapper = mount(IndexPage)
    const heroImg = wrapper.find('section[aria-labelledby="hero-heading"] img')
    expect(heroImg.exists()).toBe(true)
    expect(heroImg.attributes('src')).toBe('/images/bettersantarosacity-logo.svg')
    expect(wrapper.text()).toContain('Photo:')
  })
})
