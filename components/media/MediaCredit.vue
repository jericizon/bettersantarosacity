<script setup lang="ts">
import type { MediaItem } from '~/types/civic'

const props = withDefaults(defineProps<{
  media: MediaItem
  variant?: 'inline' | 'overlay'
}>(), {
  variant: 'inline'
})
</script>

<template>
  <div
    :class="[
      'text-[11px] font-sans text-charcoal/70 transition-opacity',
      variant === 'overlay'
        ? 'absolute bottom-2 right-2 rounded bg-charcoal/85 px-2.5 py-1 text-parchment/90 backdrop-blur-sm shadow-sm'
        : 'mt-1.5 flex items-center gap-1.5'
    ]"
  >
    <span class="truncate">Photo: {{ media.author }}</span>
    <span class="opacity-50" aria-hidden="true">·</span>
    <a
      :href="media.sourceUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="underline hover:text-laguna-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green rounded-sm"
      :title="`${media.title} · ${media.source}`"
    >
      {{ media.source }} ({{ media.license }})
    </a>
  </div>
</template>
