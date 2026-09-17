// tests/unit/money.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FinancesIndex from '../../pages/finances/index.vue'
import IndexPage from '../../pages/index.vue'

describe('City Finances & Budget', () => {
  it('displays verified revenue overview at /finances', () => {
    const wrapper = mount(FinancesIndex)
    expect(wrapper.text()).toContain('City Finances')
    expect(wrapper.text()).toContain('All Verified Annual Records')
  })

  it('renders data storytelling headline "How city revenue has changed"', () => {
    const wrapper = mount(IndexPage)
    expect(wrapper.text()).toContain('How city revenue has changed')
    expect(wrapper.text()).toContain('₱6.251B')
    expect(wrapper.text()).toContain('Commission on Audit')
  })

  it('renders the verified revenue trend for earlier fiscal years', () => {
    const wrapper = mount(IndexPage)
    const moneyChapter = wrapper.find('section[aria-label="City Money"]')
    expect(moneyChapter.exists()).toBe(true)
    // FY2022 and FY2016 verified revenue figures appear in the trend treatment.
    expect(moneyChapter.text()).toContain('₱4.99B')
    expect(moneyChapter.text()).toContain('₱2.302B')
    expect(moneyChapter.text()).toContain('Verified city revenue')
    // Chapter links through to the detailed finances page.
    expect(moneyChapter.text()).toContain('Explore detailed city finances')
  })
})
