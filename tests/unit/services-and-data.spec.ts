// tests/unit/services-and-data.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ServicesIndex from '../../pages/services/index.vue'
import DataIndex from '../../pages/data/index.vue'
import IndexPage from '../../pages/index.vue'

describe('Services & Open Data', () => {
  it('marks all services with official source destination notices', () => {
    const wrapper = mount(ServicesIndex)
    expect(wrapper.text()).toContain('Official Government Service')
  })

  it('provides open dataset catalog for download', () => {
    const wrapper = mount(DataIndex)
    expect(wrapper.text()).toContain('Download Datasets')
  })

  it('keeps homepage services linking out to official municipal pages', () => {
    const wrapper = mount(IndexPage)
    const chapter = wrapper.find('section[aria-label="Services"]')
    expect(chapter.exists()).toBe(true)
    const outbound = chapter.findAll('a[target="_blank"]')
    expect(outbound.length).toBeGreaterThan(0)
    expect(chapter.text()).toContain('Open official page')
  })

  it('links the homepage Data & Downloads chapter to real dataset files', () => {
    const wrapper = mount(IndexPage)
    const chapter = wrapper.find('section[aria-label="Data & Downloads"]')
    expect(chapter.exists()).toBe(true)
    const downloads = chapter.findAll('a[download]')
    expect(downloads.length).toBeGreaterThan(0)
    // JSON badges point at files mirrored under public/data/ by sync-public-data.
    expect(downloads.some(a => a.attributes('href')?.startsWith('/data/'))).toBe(true)
    // CSV badges reuse the generated data: URI mechanism; no invented URLs.
    expect(downloads.some(a => a.attributes('href')?.startsWith('data:text/csv'))).toBe(true)
  })
})
