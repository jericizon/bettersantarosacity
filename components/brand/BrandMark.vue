<script setup lang="ts">
withDefaults(defineProps<{
  size?: number | string
  monochrome?: boolean
}>(), {
  size: 40,
  monochrome: false
})
</script>

<template>
  <div
    class="inline-flex shrink-0 items-center justify-center transition-colors"
    :class="monochrome ? 'brand-monochrome text-charcoal' : 'text-laguna-green'"
    aria-hidden="true"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      :width="size"
      :height="size"
      fill="none"
      stroke="currentColor"
    >
      <rect x="15" y="75" width="16" height="15" fill="currentColor" opacity="0.9" rx="1" />
      <rect x="69" y="75" width="16" height="15" fill="currentColor" opacity="0.9" rx="1" />
      <rect x="20" y="35" width="12" height="40" fill="currentColor" rx="1" />
      <rect x="68" y="35" width="12" height="40" fill="currentColor" rx="1" />
      <path d="M 32 45 A 18 18 0 0 1 68 45 L 68 75 L 32 75 Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round" />
      <rect x="12" y="27" width="76" height="8" fill="currentColor" rx="2" />
      <path d="M 22 27 L 30 15 L 70 15 L 78 27 Z" fill="currentColor" opacity="0.8" />
      <circle cx="50" cy="21" r="3" :fill="monochrome ? 'currentColor' : '#D6A94B'" />
    </svg>
  </div>
</template>
