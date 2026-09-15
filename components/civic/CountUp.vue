<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useReducedMotion } from '~/composables/useReducedMotion'

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

const current = ref(props.start)
const isReduced = useReducedMotion()

function runAnimation() {
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

onMounted(() => {
  runAnimation()
})

watch(() => props.end, () => {
  runAnimation()
})
</script>

<template>
  <span>{{ prefix }}{{ current.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) }}{{ suffix }}</span>
</template>
