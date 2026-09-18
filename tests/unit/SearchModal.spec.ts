// tests/unit/SearchModal.spec.ts
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import SearchModal from '../../components/search/SearchModal.vue'
import { useSearchModal } from '../../composables/useSearchModal'
import barangaysData from '../../data/barangays.json'

const { isOpen, open, close } = useSearchModal()

// The watcher awaits a nextTick before focusing, so two ticks settle
// open + render + autofocus in tests.
async function settle() {
  await nextTick()
  await nextTick()
}

describe('SearchModal', () => {
  let wrapper: VueWrapper | undefined

  beforeEach(() => {
    close()
  })

  afterEach(() => {
    close()
    wrapper?.unmount()
    wrapper = undefined
    document.body.style.overflow = ''
    vi.unstubAllGlobals()
  })

  it('renders nothing while closed', () => {
    wrapper = mount(SearchModal)
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })

  it('opens an accessible dialog and autofocuses the input', async () => {
    wrapper = mount(SearchModal, { attachTo: document.body })
    open()
    await settle()

    const dialog = wrapper.find('[role="dialog"]')
    expect(dialog.exists()).toBe(true)
    expect(dialog.attributes('aria-modal')).toBe('true')
    expect(document.activeElement).toBe(wrapper.find('#search-modal-input').element)
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('shows quick links before any query is typed', async () => {
    wrapper = mount(SearchModal, { attachTo: document.body })
    open()
    await settle()

    expect(wrapper.text()).toContain('Quick links')
    expect(wrapper.find('a[href="/services"]').exists()).toBe(true)
    expect(wrapper.find('a[href="/laws"]').exists()).toBe(true)
  })

  it('groups autocomplete matches by category with counts and highlights', async () => {
    wrapper = mount(SearchModal, { attachTo: document.body })
    open()
    await settle()

    await wrapper.find('#search-modal-input').setValue('barangay')

    const groups = wrapper.findAll('ul[role="group"]')
    expect(groups.length).toBeGreaterThanOrEqual(1)
    expect(wrapper.find('ul[aria-label="Barangays"]').exists()).toBe(true)
    // Every barangay title starts with "Barangay …" so the group count
    // equals the dataset size; only a capped slice is rendered.
    expect(wrapper.text()).toContain(String(barangaysData.length))

    // A specific query surfaces its exact record with a <mark> highlight.
    await wrapper.find('#search-modal-input').setValue('balibago')
    expect(wrapper.find('a[href="/barangays#balibago"]').exists()).toBe(true)
    expect(wrapper.find('mark').exists()).toBe(true)
  })

  it('caps each group at three items', async () => {
    wrapper = mount(SearchModal, { attachTo: document.body })
    open()
    await settle()

    await wrapper.find('#search-modal-input').setValue('barangay')
    const barangayGroup = wrapper.find('ul[aria-label="Barangays"]')
    expect(barangayGroup.findAll('a').length).toBe(3)
  })

  it('submits to /search?q=… when Enter is pressed with no selection', async () => {
    const navigateTo = vi.fn()
    vi.stubGlobal('navigateTo', navigateTo)

    wrapper = mount(SearchModal, { attachTo: document.body })
    open()
    await settle()

    await wrapper.find('#search-modal-input').setValue('balibago')
    await wrapper.find('form').trigger('submit')

    expect(navigateTo).toHaveBeenCalledWith('/search?q=balibago')
    expect(isOpen.value).toBe(false)
  })

  it('moves selection with arrow keys and opens the active result on Enter', async () => {
    const navigateTo = vi.fn()
    vi.stubGlobal('navigateTo', navigateTo)

    wrapper = mount(SearchModal, { attachTo: document.body })
    open()
    await settle()

    const input = wrapper.find('#search-modal-input')
    await input.setValue('balibago')
    await input.trigger('keydown', { key: 'ArrowDown' })

    const selected = wrapper.find('a[aria-selected="true"]')
    expect(selected.exists()).toBe(true)
    const href = selected.attributes('href')
    expect(input.attributes('aria-activedescendant')).toBe(selected.attributes('id'))

    await input.trigger('keydown', { key: 'Enter' })
    expect(navigateTo).toHaveBeenCalledWith(href)
    expect(isOpen.value).toBe(false)
  })

  it('closes on Escape and returns focus to the previous element', async () => {
    const trigger = document.createElement('button')
    document.body.appendChild(trigger)
    trigger.focus()

    wrapper = mount(SearchModal, { attachTo: document.body })
    open()
    await settle()
    expect(document.activeElement).toBe(wrapper.find('#search-modal-input').element)

    await wrapper.find('#search-modal-input').trigger('keydown', { key: 'Escape' })
    await settle()

    expect(isOpen.value).toBe(false)
    expect(document.activeElement).toBe(trigger)
    expect(document.body.style.overflow).toBe('')
    trigger.remove()
  })

  it('closes on backdrop click and on ⌘K inside the dialog', async () => {
    wrapper = mount(SearchModal, { attachTo: document.body })
    open()
    await settle()
    await wrapper.find('div[aria-hidden="true"]').trigger('click')
    await settle()
    expect(isOpen.value).toBe(false)

    open()
    await settle()
    await wrapper.find('#search-modal-input').trigger('keydown', { key: 'k', metaKey: true })
    await settle()
    expect(isOpen.value).toBe(false)
  })

  it('shows a no-match hint and keeps the view-all-results link pointed at /search', async () => {
    wrapper = mount(SearchModal, { attachTo: document.body })
    open()
    await settle()

    await wrapper.find('#search-modal-input').setValue('zzzznothing')
    expect(wrapper.text()).toContain('No quick matches')
    expect(wrapper.find('a[href="/search?q=zzzznothing"]').exists()).toBe(true)
  })
})
