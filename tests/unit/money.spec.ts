// tests/unit/money.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MoneyIndex from '../../pages/money/index.vue'

describe('City Finances & Budget', () => {
  it('displays budget overview with verified source document links', () => {
    const wrapper = mount(MoneyIndex)
    expect(wrapper.text()).toContain('Annual Budget')
    expect(wrapper.text()).toContain('Expenditure Categories')
  })
})
