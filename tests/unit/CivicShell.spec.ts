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

  it('renders all 6 primary navigation pillars', () => {
    const wrapper = mount(CivicHeader, { global: { stubs: SHELL_STUBS } })
    const nav = wrapper.find('nav[aria-label="Primary"]')
    expect(nav.exists()).toBe(true)
    expect(nav.text()).toContain('Explore')
    expect(nav.text()).toContain('Government')
    expect(nav.text()).toContain('Finances')
    expect(nav.text()).toContain('Projects')
    expect(nav.text()).toContain('Records')
    // Search is the 6th pillar, exposed via the search affordance.
    expect(wrapper.find('a[href="/search"]').exists()).toBe(true)

    // Secondary destinations no longer appear as top-level items.
    expect(nav.text()).not.toContain('Barangays')
    expect(nav.text()).not.toContain('Money')
    expect(nav.text()).not.toContain('Laws')
    expect(nav.text()).not.toContain('Services')
  })

  it('renders CivicHeader with single-line navigation and search trigger', () => {
    const wrapper = mount(CivicHeader, { global: { stubs: SHELL_STUBS } })
    const nav = wrapper.find('nav[aria-label="Primary"]')
    expect(nav.exists()).toBe(true)
    expect(nav.text()).toContain('Explore')
    expect(nav.text()).toContain('Finances')
    expect(nav.text()).toContain('Projects')

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

  it('groups secondary destinations under each pillar in the mobile drawer', async () => {
    const wrapper = mount(CivicHeader, { global: { stubs: SHELL_STUBS } })
    await wrapper.find('button[aria-controls="mobile-nav"]').trigger('click')
    const drawer = wrapper.find('#mobile-nav')
    expect(drawer.exists()).toBe(true)

    // Pillar landing links.
    expect(drawer.find('a[href="/explore"]').exists()).toBe(true)
    expect(drawer.find('a[href="/government"]').exists()).toBe(true)
    expect(drawer.find('a[href="/finances"]').exists()).toBe(true)
    expect(drawer.find('a[href="/projects"]').exists()).toBe(true)
    expect(drawer.find('a[href="/laws"]').exists()).toBe(true)
    expect(drawer.find('a[href="/search"]').exists()).toBe(true)

    // Secondary destinations grouped under their pillars.
    const text = drawer.text()
    for (const label of [
      'Barangays', 'Places', 'History', 'Map',
      'Officials', 'Departments', 'Services', 'City Updates',
      'Revenue', 'Budget',
      'Laws', 'Data', 'Sources'
    ]) {
      expect(text).toContain(label)
    }
    expect(drawer.find('a[href="/barangays"]').exists()).toBe(true)
    expect(drawer.find('a[href="/places"]').exists()).toBe(true)
    expect(drawer.find('a[href="/history"]').exists()).toBe(true)
    expect(drawer.find('a[href="/services"]').exists()).toBe(true)
    expect(drawer.find('a[href="/updates"]').exists()).toBe(true)
    expect(drawer.find('a[href="/finances/budget"]').exists()).toBe(true)
    expect(drawer.find('a[href="/data"]').exists()).toBe(true)
    expect(drawer.find('a[href="/sources"]').exists()).toBe(true)

    // Every drawer link keeps a >= 44px touch target.
    drawer.findAll('a').forEach((link) => {
      expect(link.classes()).toContain('min-h-11')
    })
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
