<script setup lang="ts">
import { ref, watch } from 'vue'
import { useReducedMotion } from '~/composables/useReducedMotion'
import { useScrollReveal } from '~/composables/useScrollReveal'

const props = withDefaults(defineProps<{
  end: number
  start?: number
  duration?: number
  prefix?: string
  suffix?: string
  decimals?: number
}>(), {
  start: 0,
  duration: 800,
  prefix: '',
  suffix: '',
  decimals: 0
})

// SSR and no-JS render the final value so static HTML never shows a fake 0;
// the count-up replays from `start` once the element scrolls into view.
const current = ref(props.end)
const isReduced = useReducedMotion()

const root = ref<HTMLElement | null>(null)
const { isVisible } = useScrollReveal(root)

function runAnimation() {
  current.value = props.start

  if (isReduced.value) {
    current.value = props.end
    return
  }

  const startTime = performance.now()
  const step = (now: number) => {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / props.duration, 1)
    // ease-out cubic
    const ease = 1 - Math.pow(1 - progress, 3)
    current.value = props.start + (props.end - props.start) * ease

    if (progress < 1) {
      requestAnimationFrame(step)
    } else {
      current.value = props.end
    }
  }
  requestAnimationFrame(step)
}

watch(isVisible, (visible) => {
  if (visible) runAnimation()
})

watch(() => props.end, () => {
  // Before the element is visible, keep the static value in sync; afterwards
  // replay the animation.
  if (isVisible.value) {
    runAnimation()
  } else {
    current.value = props.end
  }
})
</script>

<template>
  <span ref="root">{{ prefix }}{{ current.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) }}{{ suffix }}</span>
</template>
