import { describe, it, expect, vi, beforeEach } from 'vitest'
import { registerSearchShortcut } from '~/composables/useSearchShortcut'

describe('Search Keyboard Shortcut', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('triggers callback on Meta+K or Ctrl+K', () => {
    const onTrigger = vi.fn()
    const cleanup = registerSearchShortcut(onTrigger)

    // Meta+K (macOS)
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))
    expect(onTrigger).toHaveBeenCalledTimes(1)

    // Ctrl+K (Windows/Linux)
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))
    expect(onTrigger).toHaveBeenCalledTimes(2)

    // Unrelated key
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'j', metaKey: true }))
    expect(onTrigger).toHaveBeenCalledTimes(2)

    cleanup()
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))
    expect(onTrigger).toHaveBeenCalledTimes(2)
  })

  it('ignores shortcut when user is actively typing in an input or textarea', () => {
    const onTrigger = vi.fn()
    const cleanup = registerSearchShortcut(onTrigger)

    const input = document.createElement('input')
    document.body.appendChild(input)
    input.focus()

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))
    expect(onTrigger).not.toHaveBeenCalled()

    document.body.removeChild(input)
    cleanup()
  })
})
