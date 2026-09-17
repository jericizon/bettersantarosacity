// tests/unit/projects.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProjectsIndex from '../../pages/projects/index.vue'
import IndexPage from '../../pages/index.vue'

describe('Projects Explorer', () => {
  it('renders filters for status and barangay', () => {
    const wrapper = mount(ProjectsIndex)
    expect(wrapper.text()).toContain('Status')
    expect(wrapper.text()).toContain('Barangay')
  })
})

describe('Building the City chapter', () => {
  it('renders Building the City chapter with SectionHeader and project stories', () => {
    const wrapper = mount(IndexPage)
    expect(wrapper.text()).toContain('Building the City')
    expect(wrapper.text()).toContain('Projects tracked against official and reported records')
    expect(wrapper.text()).toContain('Civic Facilities')
  })

  it('graduates into a full-bleed white chapter linking the project registry', () => {
    const wrapper = mount(IndexPage)
    const chapter = wrapper.find('section[aria-label="Building the City"]')
    expect(chapter.exists()).toBe(true)
    expect(chapter.classes()).toContain('w-full')
    expect(chapter.classes()).toContain('section-white')
    expect(chapter.text()).toContain('Explore all public projects')
  })
})
