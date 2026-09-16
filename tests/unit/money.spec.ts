// tests/unit/money.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MoneyIndex from '../../pages/money/index.vue'
import IndexPage from '../../pages/index.vue'

describe('City Finances & Budget', () => {
  it('displays budget overview with verified source document links', () => {
    const wrapper = mount(MoneyIndex)
    expect(wrapper.text()).toContain('Annual Budget')
    expect(wrapper.text()).toContain('Expenditure Categories')
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
