/**
 * Register a global keyboard shortcut (Cmd+K / Ctrl+K) to trigger search.
 * Ignores keypresses when focus is inside an input, textarea, select, or
 * contenteditable element.
 *
 * Suppression reads document.activeElement rather than e.target: events
 * dispatched directly on window report window as the target even while an
 * input holds focus.
 */
export function registerSearchShortcut(callback: () => void): () => void {
  function handleKeyDown(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      const active = document.activeElement as HTMLElement | null
      const isInput = active && (
        active.tagName === 'INPUT' ||
        active.tagName === 'TEXTAREA' ||
        active.tagName === 'SELECT' ||
        active.isContentEditable
      )

      if (!isInput) {
        e.preventDefault()
        callback()
      }
    }
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }

  return () => {}
}
