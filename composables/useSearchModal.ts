import { ref } from 'vue'

// Shared open-state for the global search overlay. useState is the Nuxt
// path; the module ref keeps the composable working under plain Vitest.
const fallbackIsOpen = ref(false)

export function useSearchModal() {
  const isOpen = typeof useState === 'function'
    ? useState<boolean>('search-modal:open', () => false)
    : fallbackIsOpen

  function open() { isOpen.value = true }
  function close() { isOpen.value = false }
  function toggle() { isOpen.value = !isOpen.value }

  return { isOpen, open, close, toggle }
}
