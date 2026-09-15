<script setup lang="ts">
withDefaults(defineProps<{
  size?: number
  color?: string
}>(), {
  size: 24,
  color: 'currentColor'
})
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    class="inline-block transition-transform duration-300 ease-out"
  >
    <!-- Geometric abstract rose motif honoring Saint Rose of Lima (Spec §2) -->
    <circle cx="24" cy="24" r="22" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.3" stroke-dasharray="2 3" />
    <path
      d="M24 8C19 14 14 19 8 24C14 29 19 34 24 40C29 34 34 29 40 24C34 19 29 14 24 8Z"
      stroke="currentColor"
      stroke-width="2"
      stroke-linejoin="round"
    />
    <path
      d="M24 14C21 18 18 21 14 24C18 27 21 30 24 34C27 30 30 27 34 24C30 21 27 18 24 14Z"
      fill="currentColor"
      fill-opacity="0.15"
      stroke="currentColor"
      stroke-width="1.5"
    />
    <circle cx="24" cy="24" r="3.5" fill="currentColor" />
  </svg>
</template>
