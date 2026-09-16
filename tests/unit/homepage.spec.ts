// tests/unit/homepage.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import IndexPage from '../../pages/index.vue'
import HeroSearch from '../../components/civic/HeroSearch.vue'
import MapExplorer from '../../components/civic/MapExplorer.vue'
import Collage from '../../components/civic/Collage.vue'
import Timeline from '../../components/civic/Timeline.vue'
import StatCard from '../../components/data/StatCard.vue'

describe('Homepage Civic Sections', () => {
  it('renders the editorial visual components (HeroSearch, MapExplorer, Collage)', () => {
    const wrapper = mount(IndexPage)
    expect(wrapper.findComponent(HeroSearch).exists()).toBe(true)
    expect(wrapper.findComponent(MapExplorer).exists()).toBe(true)
    expect(wrapper.findComponent(Collage).exists()).toBe(true)
  })

  it('renders hero chapter on parchment ground with search and local image', () => {
    const wrapper = mount(IndexPage)
    const heroSection = wrapper.find('section[aria-labelledby="hero-heading"]')
    expect(heroSection.exists()).toBe(true)
    expect(heroSection.findComponent(HeroSearch).exists()).toBe(true)
    expect(wrapper.text()).toContain('Public information about Santa Rosa, made easier to find.')
    expect(wrapper.text()).toContain('Independent community project')
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
    expect(wrapper.text()).toContain('Last verified by Better Santa Rosa')
  })

  it('renders Laws, Services, Data Downloads, and Data Trust chapters', () => {
    const wrapper = mount(IndexPage)
    expect(wrapper.text()).toContain('Laws & Decisions')
    expect(wrapper.text()).toContain('Services')
    expect(wrapper.text()).toContain('Data & Downloads')
    expect(wrapper.text()).toContain('Data Trust')
    expect(wrapper.text()).toContain('Last verified')
    // The project disclaimer folds into the Data Trust chapter (spec §10).
    expect(wrapper.text()).toContain('About this project')
  })

  it('graduates Laws, Services, Data Downloads and Data Trust into full-bleed chapters', () => {
    const wrapper = mount(IndexPage)

    const lawsChapter = wrapper.find('section[aria-label="Laws & Decisions"]')
    expect(lawsChapter.exists()).toBe(true)
    expect(lawsChapter.classes()).toContain('w-full')
    expect(lawsChapter.classes()).toContain('section-white')

    const servicesChapter = wrapper.find('section[aria-label="Services"]')
    expect(servicesChapter.exists()).toBe(true)
    expect(servicesChapter.classes()).toContain('w-full')
    expect(servicesChapter.classes()).toContain('section-white')

    const downloadsChapter = wrapper.find('section[aria-label="Data & Downloads"]')
    expect(downloadsChapter.exists()).toBe(true)
    expect(downloadsChapter.classes()).toContain('w-full')
    expect(downloadsChapter.classes()).toContain('section-parchment')

    const trustChapter = wrapper.find('section[aria-label="Data Trust"]')
    expect(trustChapter.exists()).toBe(true)
    expect(trustChapter.classes()).toContain('w-full')
    expect(trustChapter.classes()).toContain('section-white')
  })

  it('graduates Explore and City Money into their own full-bleed chapters', () => {
    const wrapper = mount(IndexPage)
    const exploreChapter = wrapper.find('section[aria-label="Explore Santa Rosa"]')
    expect(exploreChapter.exists()).toBe(true)
    expect(exploreChapter.classes()).toContain('w-full')
    expect(exploreChapter.classes()).toContain('section-light-green')
    expect(exploreChapter.findComponent(MapExplorer).exists()).toBe(true)

    const moneyChapter = wrapper.find('section[aria-label="City Money"]')
    expect(moneyChapter.exists()).toBe(true)
    expect(moneyChapter.classes()).toContain('w-full')
    expect(moneyChapter.classes()).toContain('section-parchment')
  })

  it('renders history chapter with neutral source-backed wording without unsupported superlatives', () => {
    const wrapper = mount(IndexPage)
    expect(wrapper.text()).toContain('From Bukol to Today')
    // Superlatives lacking verifiable comparison methodology must NOT be present (spec §21)
    expect(wrapper.text()).not.toContain("Luzon's richest city outside Metro Manila")
    expect(wrapper.text()).not.toContain('Richest city')
    expect(wrapper.text()).toContain('From a lakeside barrio of Biñan to cityhood')
  })

  it('graduates the history chapter into a full-bleed deep-green chapter', () => {
    const wrapper = mount(IndexPage)
    const historyChapter = wrapper.find('section[aria-label="From Bukol to Today"]')
    expect(historyChapter.exists()).toBe(true)
    expect(historyChapter.classes()).toContain('w-full')
    expect(historyChapter.classes()).toContain('section-deep-green')
    // The shared timeline switches to its dark theme on the deep-green ground.
    expect(historyChapter.findComponent(Timeline).props('theme')).toBe('dark')
  })
})
