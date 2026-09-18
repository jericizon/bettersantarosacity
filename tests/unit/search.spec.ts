// tests/unit/search.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GlobalSearch from '../../components/search/GlobalSearch.vue'
import { useSearchModal } from '../../composables/useSearchModal'

describe('GlobalSearch trigger', () => {
  it('renders a search button with an accessible label', () => {
    const wrapper = mount(GlobalSearch)
    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    expect(button.attributes('aria-label')).toContain('Search Santa Rosa')
    expect(button.attributes('aria-haspopup')).toBe('dialog')
  })

  it('opens the search modal on click', async () => {
    const { isOpen, close } = useSearchModal()
    close()
    const wrapper = mount(GlobalSearch)
    await wrapper.find('button').trigger('click')
    expect(isOpen.value).toBe(true)
    close()
  })
})
