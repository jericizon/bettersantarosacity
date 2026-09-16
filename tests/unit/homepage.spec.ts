// tests/unit/homepage.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import IndexPage from '../../pages/index.vue'
import HeroSearch from '../../components/civic/HeroSearch.vue'
import MapExplorer from '../../components/civic/MapExplorer.vue'
import Collage from '../../components/civic/Collage.vue'
import StatCard from '../../components/data/StatCard.vue'

describe('Homepage Civic Sections', () => {
  it('renders the editorial visual components (HeroSearch, MapExplorer, Collage)', () => {
    const wrapper = mount(IndexPage)
    expect(wrapper.findComponent(HeroSearch).exists()).toBe(true)
    expect(wrapper.findComponent(MapExplorer).exists()).toBe(true)
    expect(wrapper.findComponent(Collage).exists()).toBe(true)
  })

  it('shows the site emblem as the hero image', () => {
    const wrapper = mount(IndexPage)
    const heroImg = wrapper.find('section[aria-labelledby="hero-heading"] img')
    expect(heroImg.exists()).toBe(true)
    expect(heroImg.attributes('src')).toBe('/images/bettersantarosacity-logo.svg')
    expect(heroImg.attributes('alt')).toBeTruthy()
    // Every photograph must carry a source credit (spec §5 / §26).
    expect(wrapper.text()).toContain('Photo:')
  })

  it('contains core city facts as count-up stat cards', () => {
    const wrapper = mount(IndexPage)
    const cards = wrapper.findAllComponents(StatCard)
    expect(cards).toHaveLength(4)
    // numericValue props drive the viewport count-up (spec §10); the rendered
    // number animates asynchronously so assert the prop contract, not "0".
    expect(cards.map(c => c.props('numericValue'))).toEqual(
      expect.arrayContaining([18, 5543])
    )
    expect(wrapper.text()).toContain('Barangays')
    expect(wrapper.text()).toContain('Land area')
    // Cityhood stays a static value — a year must not render as "2,004".
    expect(wrapper.text()).toContain('Cityhood')
    expect(wrapper.text()).toContain('2004')
  })

  it('renders trust statement and source verification indicators', () => {
    const wrapper = mount(IndexPage)
    expect(wrapper.text()).toContain('Independent community project')
    expect(wrapper.text()).toContain('Last checked')
  })
})
