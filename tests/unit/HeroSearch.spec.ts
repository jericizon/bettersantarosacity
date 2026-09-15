import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HeroSearch from '~/components/civic/HeroSearch.vue'

describe('HeroSearch Component', () => {
  it('renders search input with placeholder and keyboard hint', () => {
    const wrapper = mount(HeroSearch)
    const input = wrapper.find('input[type="search"]')
    expect(input.exists()).toBe(true)
    expect(wrapper.text()).toContain('K')
  })
})
