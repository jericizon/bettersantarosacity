<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  mood?: 'happy' | 'neutral' | 'grumpy'
  tone?: 'white' | 'gray' | 'dark'
}>(), {
  mood: 'happy',
  tone: 'white'
})

const FILL = { white: '#ffffff', gray: '#aebec6', dark: '#7d939c' } as const
const FACE = { white: '#2f4a45', gray: '#2f4347', dark: '#22343a' } as const

const fill = computed(() => FILL[props.tone])
const face = computed(() => FACE[props.tone])
</script>

<template>
  <!-- Fluffy cloud character: overlapping puffs + face. Self-bobbing and
       blinking; the wrapper supplies the travel animation. -->
  <svg viewBox="0 0 100 60" fill="none" aria-hidden="true" class="cc">
    <g :fill="fill">
      <ellipse cx="32" cy="40" rx="17" ry="14" />
      <circle cx="50" cy="28" r="19" />
      <ellipse cx="68" cy="40" rx="16" ry="13" />
      <rect x="16" y="38" width="68" height="14" rx="7" />
    </g>
    <ellipse cx="50" cy="52" rx="30" ry="5" fill="rgba(0, 0, 0, 0.06)" />
    <g class="cc-eyes" :fill="face">
      <circle cx="42" cy="37" r="2.6" />
      <circle cx="58" cy="37" r="2.6" />
    </g>
    <ellipse cx="34" cy="43" rx="3.6" ry="2" fill="#c96a73" opacity="0.35" />
    <ellipse cx="66" cy="43" rx="3.6" ry="2" fill="#c96a73" opacity="0.35" />
    <path
      v-if="mood === 'happy'"
      d="M45 44 Q50 49 55 44"
      :stroke="face" stroke-width="2" stroke-linecap="round"
    />
    <line
      v-else-if="mood === 'neutral'"
      x1="45" y1="45.5" x2="55" y2="45.5"
      :stroke="face" stroke-width="2" stroke-linecap="round"
    />
    <template v-else>
      <path d="M44 47.5 Q50 43.5 56 47.5" :stroke="face" stroke-width="2" stroke-linecap="round" />
      <line x1="37" y1="31" x2="44" y2="33.5" :stroke="face" stroke-width="2" stroke-linecap="round" />
      <line x1="63" y1="31" x2="56" y2="33.5" :stroke="face" stroke-width="2" stroke-linecap="round" />
    </template>
  </svg>
</template>

<style scoped>
.cc {
  display: block;
  width: 100%;
  height: auto;
  animation: cc-bob 4.5s ease-in-out infinite alternate;
}
.cc-eyes {
  transform-box: fill-box;
  transform-origin: center;
  animation: cc-blink 4.8s ease-in-out infinite;
}

@keyframes cc-bob { from { transform: translateY(0); } to { transform: translateY(-5px); } }
@keyframes cc-blink { 0%, 88%, 94%, 100% { transform: scaleY(1); } 91% { transform: scaleY(0.1); } }

@media (prefers-reduced-motion: reduce) {
  .cc, .cc-eyes { animation: none; }
}
</style>
