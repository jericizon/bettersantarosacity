// tests/unit/StatCard.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatCard from '~/components/data/StatCard.vue'

describe('StatCard Editorial Component', () => {
  it('renders numeric count-up value and source citation', () => {
    const wrapper = mount(StatCard, {
      props: {
        value: '18',
        numericValue: 18,
        label: 'Barangays',
        source: 'City Government of Santa Rosa'
      }
    })

    expect(wrapper.text()).toContain('Barangays')
    expect(wrapper.text()).toContain('Source: City Government of Santa Rosa')
  })

  it('supports open editorial layout variant without card boundary box', () => {
    const wrapper = mount(StatCard, {
      props: {
        value: '5,543 ha',
        numericValue: 5543,
        suffix: ' ha',
        label: 'Land area',
        variant: 'open'
      }
    })

    // Open variant should not have bordered card styling
    expect(wrapper.classes()).toContain('stat-card-open')
    expect(wrapper.classes()).not.toContain('shadow-sm')
  })
})
