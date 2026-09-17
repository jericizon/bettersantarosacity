// tests/unit/shell-transitions.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DefaultLayout from '~/layouts/default.vue'
import CivicFooter from '~/components/civic/CivicFooter.vue'

// The layout's chrome components resolve via Nuxt auto-imports at runtime;
// under plain Vitest they are stubbed so the test asserts the shell contract
// (a full-width <main>) without pulling in NuxtLink-dependent markup.
const LAYOUT_STUBS = {
  CivicDisclaimerBanner: true,
  CivicHeader: true,
  CivicFooter: true
}

describe('Shell Navigation & Layout Architecture', () => {
  it('includes link to /about/media in CivicFooter', () => {
    const wrapper = mount(CivicFooter)
    const mediaLink = wrapper.find('a[href="/about/media"]')
    expect(mediaLink.exists()).toBe(true)
  })

  it('renders a full-width main container allowing full-bleed editorial chapters', () => {
    const wrapper = mount(DefaultLayout, {
      global: { stubs: LAYOUT_STUBS },
      slots: {
        default: '<div id="test-content">Chapter Content</div>'
      }
    })
    const main = wrapper.find('main')
    expect(main.exists()).toBe(true)
    expect(main.classes()).toContain('w-full')
    expect(main.classes()).toContain('flex-grow')
    // Must NOT constrain max-width at the <main> wrapper level
    expect(main.classes()).not.toContain('max-w-7xl')
    expect(wrapper.find('#test-content').exists()).toBe(true)
  })
})
