/**
 * Register a global keyboard shortcut (Cmd+K / Ctrl+K / "/") to trigger search.
 * Ignores keypresses when focus is inside an input, textarea, select, or
 * contenteditable element.
 *
 * Suppression reads document.activeElement rather than e.target: events
 * dispatched directly on window report window as the target even while an
 * input holds focus.
 *
 * preventDefault runs on every Cmd+K/Ctrl+K chord so the browser's own
 * search/URL bar never steals it, even while typing; for "/" it runs only
 * when unsuppressed so typing "/" into a field still works.
 */
export function registerSearchShortcut(callback: () => void): () => void {
  function handleKeyDown(e: KeyboardEvent) {
    const isChord = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'
    const isSlash = e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey

    if (!isChord && !isSlash) return
    if (isChord) e.preventDefault()

    const active = document.activeElement as HTMLElement | null
    const isInput = active && (
      active.tagName === 'INPUT' ||
      active.tagName === 'TEXTAREA' ||
      active.tagName === 'SELECT' ||
      active.isContentEditable
    )

    if (!isInput) {
      if (isSlash) e.preventDefault()
      callback()
    }
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }

  return () => {}
}
