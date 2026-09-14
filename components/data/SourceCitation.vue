<script setup lang="ts">
import type { SourceReference } from '~/types/civic'

const props = defineProps<{
  source: SourceReference
  verifiedDate?: string
}>()
</script>

<template>
  <div class="inline-flex items-center gap-1.5 text-xs text-charcoal/80 bg-parchment px-2 py-1 rounded border border-charcoal/10">
    <span class="font-medium text-laguna-green">{{ source.title }}</span>
    <span v-if="verifiedDate" class="text-charcoal/70">· Verified {{ verifiedDate }}</span>
    <a
      v-if="source.url"
      :href="source.url"
      target="_blank"
      rel="noopener noreferrer"
      class="text-rose-accent-dark hover:underline inline-flex items-center ml-0.5 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
      aria-label="View original official document (opens in new tab)"
    >
      ↗
    </a>
  </div>
</template>
