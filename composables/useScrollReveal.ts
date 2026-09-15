import { ref, onMounted, onUnmounted, type Ref } from 'vue'
import { useReducedMotion } from './useReducedMotion'

export interface ScrollRevealOptions {
  threshold?: number
  rootMargin?: string
  once?: boolean
}

export function useScrollReveal(
  target: Ref<HTMLElement | null>,
  options: ScrollRevealOptions = {}
) {
  const { threshold = 0.15, rootMargin = '0px', once = true } = options
  const isVisible = ref(false)
  const isReduced = useReducedMotion()

  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (isReduced.value) {
      isVisible.value = true
      return
    }

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      isVisible.value = true
      return
    }

    if (!target.value) return

    observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          isVisible.value = true
          if (once && observer && target.value) {
            observer.unobserve(target.value)
          }
        } else if (!once) {
          isVisible.value = false
        }
      }
    }, { threshold, rootMargin })

    observer.observe(target.value)
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  return { isVisible }
}
