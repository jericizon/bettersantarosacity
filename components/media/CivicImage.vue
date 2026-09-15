<script setup lang="ts">
import type { MediaItem } from '~/types/civic'
import MediaCredit from './MediaCredit.vue'

const props = withDefaults(defineProps<{
  media: MediaItem
  alt?: string
  priority?: boolean
  showCredit?: boolean
  creditVariant?: 'inline' | 'overlay'
  aspectRatio?: string
  /** Extra classes applied to the <img> itself (e.g. 'animate-ken-burns'). */
  imgClass?: string
}>(), {
  alt: undefined,
  priority: false,
  showCredit: true,
  creditVariant: 'overlay',
  aspectRatio: '16 / 10',
  imgClass: undefined
})
</script>

<template>
  <figure class="relative overflow-hidden rounded-lg bg-charcoal/5 group">
    <img
      :src="media.file"
      :alt="alt ?? media.title"
      :width="media.width"
      :height="media.height"
      :loading="priority ? 'eager' : 'lazy'"
      :fetchpriority="priority ? 'high' : 'auto'"
      :style="{ aspectRatio }"
      :class="['w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]', imgClass]"
    />
    <!-- Optional overlay slot for tone treatments (e.g. hero gradient). -->
    <slot />
    <MediaCredit
      v-if="showCredit"
      :media="media"
      :variant="creditVariant"
    />
  </figure>
</template>
