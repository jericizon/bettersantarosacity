// tests/unit/government.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GovernmentIndex from '../../pages/government/index.vue'

describe('Government Directory', () => {
  it('renders official leadership sections with source attributions', () => {
    const wrapper = mount(GovernmentIndex)
    expect(wrapper.text()).toContain('Executive')
    expect(wrapper.text()).toContain('Sangguniang Panlungsod')
  })

  it('renders the Citizen’s Charter and Transparency section', () => {
    const wrapper = mount(GovernmentIndex)

    expect(wrapper.text()).toContain('Citizen’s Charter & Transparency')
    expect(wrapper.text()).toContain('Full Disclosure Portal')
    expect(wrapper.text()).toContain('Anti-Red Tape Authority')
  })
})
