// tests/unit/link-anchors.spec.ts
// Regression: search results and map/explore links point at #anchors on the
// list pages (a forward contract set by laws/services). Every emitted anchor
// must resolve to a real element id on the target page.
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import barangaysData from '../../data/barangays.json'
import officialsData from '../../data/officials.json'
import departmentsData from '../../data/departments.json'
import projectsData from '../../data/projects.json'
import BarangaysIndex from '../../pages/barangays/index.vue'
import GovernmentIndex from '../../pages/government/index.vue'
import ProjectsIndex from '../../pages/projects/index.vue'

describe('List-page anchor targets', () => {
  it('resolves /barangays#<slug> anchors from search, explore, and the map', () => {
    const wrapper = mount(BarangaysIndex)
    for (const b of barangaysData) {
      expect(wrapper.find(`[id="${b.slug}"]`).exists(), `missing #${b.slug}`).toBe(true)
    }
  })

  it('resolves /government#<id> anchors from search', () => {
    const wrapper = mount(GovernmentIndex)
    for (const o of officialsData) {
      expect(wrapper.find(`[id="${o.id}"]`).exists(), `missing #${o.id}`).toBe(true)
    }
    for (const d of departmentsData) {
      expect(wrapper.find(`[id="${d.id}"]`).exists(), `missing #${d.id}`).toBe(true)
    }
  })

  it('resolves /projects#<slug> anchors from search', () => {
    const wrapper = mount(ProjectsIndex)
    for (const p of projectsData) {
      expect(wrapper.find(`[id="${p.slug}"]`).exists(), `missing #${p.slug}`).toBe(true)
    }
  })
})
