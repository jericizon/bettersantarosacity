// tests/unit/search.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GlobalSearch from '../../components/search/GlobalSearch.vue'

describe('Universal Search Component', () => {
  it('renders search input with accessibility labels', () => {
    const wrapper = mount(GlobalSearch)
    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
    expect(input.attributes('placeholder')).toContain('Search Santa Rosa')
  })
})
