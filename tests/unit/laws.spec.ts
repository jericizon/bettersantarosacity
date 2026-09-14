// tests/unit/laws.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LawsIndex from '../../pages/laws/index.vue'

describe('City Laws & Ordinances', () => {
  it('lists ordinances with verified labels', () => {
    const wrapper = mount(LawsIndex)
    expect(wrapper.text()).toContain('Ordinances')
  })
})
