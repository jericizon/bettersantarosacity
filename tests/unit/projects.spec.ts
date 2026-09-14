// tests/unit/projects.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProjectsIndex from '../../pages/projects/index.vue'

describe('Projects Explorer', () => {
  it('renders filters for status and barangay', () => {
    const wrapper = mount(ProjectsIndex)
    expect(wrapper.text()).toContain('Status')
    expect(wrapper.text()).toContain('Barangay')
  })
})
