import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export function useReducedMotion(): Ref<boolean> {
  const prefersReduced = ref(false)

  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return prefersReduced
  }

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  prefersReduced.value = mediaQuery.matches

  const onChange = (e: MediaQueryListEvent) => {
    prefersReduced.value = e.matches
  }

  onMounted(() => {
    mediaQuery.addEventListener('change', onChange)
  })

  onUnmounted(() => {
    mediaQuery.removeEventListener('change', onChange)
  })

  return prefersReduced
}
