// tests/unit/homepage.spec.ts
// maplibre-gl and fetch are stubbed globally in tests/setup.ts.
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import IndexPage from '../../pages/index.vue'
import HeroSearch from '../../components/civic/HeroSearch.vue'
import SantaRosaNow from '../../components/civic/SantaRosaNow.vue'
import MapExplorer from '../../components/civic/MapExplorer.vue'
import Collage from '../../components/civic/Collage.vue'
import Timeline from '../../components/civic/Timeline.vue'
import StatCard from '../../components/data/StatCard.vue'

describe('Homepage Civic Sections & Chapter Architecture', () => {
  it('renders all 12 editorial chapters including Santa Rosa Now', () => {
    const wrapper = mount(IndexPage)
    // 1. Hero
    expect(wrapper.findComponent(HeroSearch).exists()).toBe(true)
    expect(wrapper.text()).toContain('Public information about Santa Rosa, made easier to find.')
    // 2. Santa Rosa Today
    expect(wrapper.text()).toContain('Santa Rosa Today')
    expect(wrapper.findAllComponents(StatCard)).toHaveLength(4)
    // 3. Santa Rosa Now
    expect(wrapper.findComponent(SantaRosaNow).exists()).toBe(true)
    expect(wrapper.text()).toContain('Santa Rosa Now')
    // 4. Explore Santa Rosa
    expect(wrapper.findComponent(MapExplorer).exists()).toBe(true)
    expect(wrapper.text()).toContain('Explore Santa Rosa')
    // 5. City Finances
    expect(wrapper.text()).toContain('City Finances')
    // 6. Projects
    expect(wrapper.text()).toContain('Building the City')
    // 7. History
    expect(wrapper.text()).toContain('From Bukol to Today')
    // 8. Heritage & Places
    expect(wrapper.findComponent(Collage).exists()).toBe(true)
    expect(wrapper.text()).toContain('Santa Rosa Life & Heritage')
    // 9. Laws & Decisions
    expect(wrapper.text()).toContain('Laws & Decisions')
    // 10. Services
    expect(wrapper.text()).toContain('Services')
    // 11. Data & Downloads + Data Trust
    expect(wrapper.text()).toContain('Data & Downloads')
    expect(wrapper.text()).toContain('Data Trust')
    // 12. About / Sources
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

  it('renders the hero chapter on a full-bleed parchment ground with accessible emblem', () => {
    const wrapper = mount(IndexPage)
    const heroSection = wrapper.find('section[aria-labelledby="hero-heading"]')
    expect(heroSection.exists()).toBe(true)
    expect(heroSection.classes()).toContain('w-full')
    expect(heroSection.classes()).toContain('section-parchment')
    expect(heroSection.findComponent(HeroSearch).exists()).toBe(true)
    expect(wrapper.text()).toContain('Public information about Santa Rosa, made easier to find.')
    expect(heroSection.find('img').attributes('alt')).toBeTruthy()
  })

  it('pins each editorial chapter section to its designated full-bleed ground tone', () => {
    const wrapper = mount(IndexPage)
    const chapters: [string, string][] = [
      ['section[aria-labelledby="today-heading"]', 'section-white'],
      ['section[aria-label="Santa Rosa Now"]', 'section-parchment'],
      ['section[aria-label="Explore Santa Rosa"]', 'section-light-green'],
      ['section[aria-label="City Finances"]', 'section-parchment'],
      ['section[aria-label="Building the City"]', 'section-white'],
      ['section[aria-label="From Bukol to Today"]', 'section-deep-green'],
      ['section[aria-label="Santa Rosa Life & Heritage"]', 'section-parchment'],
      ['section[aria-label="Laws & Decisions"]', 'section-white'],
      ['section[aria-label="Services"]', 'section-white'],
      ['section[aria-label="Data & Downloads"]', 'section-parchment'],
      ['section[aria-label="Data Trust"]', 'section-white']
    ]
    for (const [selector, tone] of chapters) {
      const chapter = wrapper.find(selector)
      expect(chapter.exists(), selector).toBe(true)
      expect(chapter.classes(), selector).toContain('w-full')
      expect(chapter.classes(), selector).toContain(tone)
    }
  })

  it('switches the shared timeline to its dark theme on the deep-green history ground', () => {
    const wrapper = mount(IndexPage)
    const historyChapter = wrapper.find('section[aria-label="From Bukol to Today"]')
    expect(historyChapter.exists()).toBe(true)
    expect(historyChapter.findComponent(Timeline).props('theme')).toBe('dark')
  })

  it('keeps history chapter wording neutral and source-backed without broad superlatives', () => {
    const wrapper = mount(IndexPage)
    // Broad class ban — complements the exact-phrase ban above (spec §21).
    expect(wrapper.text()).not.toContain('Richest city')
    expect(wrapper.text()).toContain('From a lakeside barrio of Biñan to cityhood')
  })

  it('renders last-verified freshness stamps across the data chapters', () => {
    const wrapper = mount(IndexPage)
    expect(wrapper.text()).toContain('Last verified by Better Santa Rosa')
    expect(wrapper.text()).toContain('Last verified')
  })
})
