import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FinancesIndex from '../../pages/finances/index.vue'

describe('Finances Route Refactor (/finances)', () => {
  it('renders City Finances heading and prominent revenue vs budget disclaimer', () => {
    const wrapper = mount(FinancesIndex, {
      global: {
        stubs: {
          NuxtLink: { template: '<a><slot /></a>' },
          DataSourceBadge: true,
          DataSourceCitation: true,
          DataLastVerified: true,
          MoneyBudgetChart: true
        }
      }
    })
    expect(wrapper.find('h1').text()).toContain('City Finances')
    expect(wrapper.text()).toContain('Revenue is not the same as the city\'s appropriation budget or total expenditure')
    expect(wrapper.text()).toContain('₱6.251B')
    expect(wrapper.text()).toContain('FY2024')
    expect(wrapper.text()).toContain('FY2016')
  })
})
