import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import CivicHeader from '~/components/civic/CivicHeader.vue'
import CivicFooter from '~/components/civic/CivicFooter.vue'
import DisclaimerBanner from '../../components/civic/DisclaimerBanner.vue'
import SourceBadge from '../../components/data/SourceBadge.vue'

// NuxtLink and SearchGlobalSearch resolve via Nuxt auto-imports at runtime;
// under plain Vitest, NuxtLink is stubbed as a real anchor so href and
// class assertions stay meaningful. defineComponent keeps the stub
// assignable to VTU's Stub type under vue-tsc.
const NuxtLinkStub = defineComponent({
  props: { to: { type: String, default: '' } },
  setup(props, { slots }) {
    return () => h('a', { href: props.to }, slots.default?.())
  }
})

const SHELL_STUBS = {
  NuxtLink: NuxtLinkStub,
  SearchGlobalSearch: true
}

describe('Civic Shell Components', () => {
  it('renders disclaimer stating non-governmental status', () => {
    const wrapper = mount(DisclaimerBanner)
    expect(wrapper.text()).toContain('not an official City Government of Santa Rosa website')
  })

  it('renders official vs community presentation badge', () => {
    const wrapper = mount(SourceBadge, {
      props: { type: 'official' }
    })
    expect(wrapper.text()).toContain('OFFICIAL')
  })

  it('renders CivicHeader with single-line navigation and search trigger', () => {
    const wrapper = mount(CivicHeader, { global: { stubs: SHELL_STUBS } })
    const nav = wrapper.find('nav[aria-label="Primary"]')
    expect(nav.exists()).toBe(true)
    expect(wrapper.text()).toContain('Explore')
    expect(wrapper.text()).toContain('Barangays')
    expect(wrapper.text()).toContain('Money')
    expect(wrapper.text()).toContain('Projects')

    // Single-line desktop nav: links never wrap mid-phrase and keep
    // >= 44px touch targets.
    const links = nav.findAll('a')
    expect(links.length).toBeGreaterThanOrEqual(4)
    links.forEach((link) => {
      expect(link.classes()).toContain('whitespace-nowrap')
      expect(link.classes()).toContain('min-h-11')
    })

    // Sticky bar with a restrained bottom border.
    const header = wrapper.find('header')
    expect(header.classes()).toContain('sticky')
    expect(header.classes()).toContain('border-b')

    // Search affordance: mobile search link routes to /search.
    expect(wrapper.find('a[href="/search"]').exists()).toBe(true)
  })

  it('CivicHeader exposes an accessible mobile drawer toggle', async () => {
    const wrapper = mount(CivicHeader, { global: { stubs: SHELL_STUBS } })
    const toggle = wrapper.find('button[aria-controls="mobile-nav"]')
    expect(toggle.exists()).toBe(true)
    expect(toggle.attributes('aria-expanded')).toBe('false')

    await toggle.trigger('click')
    expect(toggle.attributes('aria-expanded')).toBe('true')
    const drawer = wrapper.find('#mobile-nav')
    expect(drawer.exists()).toBe(true)
    expect(drawer.findAll('a').length).toBeGreaterThanOrEqual(4)
  })

  it('returns focus to the nav toggle when the drawer closes via Escape', async () => {
    const wrapper = mount(CivicHeader, {
      attachTo: document.body,
      global: { stubs: SHELL_STUBS }
    })
    const toggle = wrapper.find('button[aria-controls="mobile-nav"]')
    await toggle.trigger('click')

    const drawer = wrapper.find('#mobile-nav')
    expect(drawer.exists()).toBe(true)

    // Simulate a keyboard user focused inside the drawer.
    const firstLink = drawer.find('a')
    ;(firstLink.element as HTMLElement).focus()
    expect(document.activeElement).toBe(firstLink.element)

    await drawer.trigger('keydown', { key: 'Escape' })
    expect(wrapper.find('#mobile-nav').exists()).toBe(false)
    expect(document.activeElement).toBe(toggle.element)

    wrapper.unmount()
  })

  it('renders CivicFooter with distinct legal disclaimer and media credits link', () => {
    const wrapper = mount(CivicFooter, { global: { stubs: SHELL_STUBS } })
    expect(wrapper.text()).toContain('Independent community project')
    expect(wrapper.text()).toContain('Not an official City Government website')
    expect(wrapper.find('a[href="/about/media"]').exists()).toBe(true)

    // Dark charcoal ground and the required column structure.
    const footer = wrapper.find('footer')
    expect(footer.classes()).toContain('bg-charcoal')
    expect(footer.classes()).toContain('text-parchment')
    expect(footer.classes()).toContain('py-16')
    expect(wrapper.text()).toContain('Legal Status')
    expect(wrapper.text()).toContain('Sources & Methodology')
  })
})
