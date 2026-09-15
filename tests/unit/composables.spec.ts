// tests/unit/composables.spec.ts
import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import { useReducedMotion } from '~/composables/useReducedMotion'
import { useScrollReveal } from '~/composables/useScrollReveal'

describe('Motion Composables', () => {
  it('provides a reactive reduced motion indicator', () => {
    const isReduced = useReducedMotion()
    expect(typeof isReduced.value).toBe('boolean')
  })

  it('exposes useScrollReveal with isVisible state', () => {
    const el = ref<HTMLElement | null>(null)
    const { isVisible } = useScrollReveal(el)
    expect(typeof isVisible.value).toBe('boolean')
  })
})
