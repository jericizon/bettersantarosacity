// tests/unit/shell-transitions.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CivicFooter from '~/components/civic/CivicFooter.vue'

describe('Shell Navigation & Footer', () => {
  it('includes link to /about/media in CivicFooter', () => {
    const wrapper = mount(CivicFooter)
    const mediaLink = wrapper.find('a[href="/about/media"]')
    expect(mediaLink.exists()).toBe(true)
  })
})
