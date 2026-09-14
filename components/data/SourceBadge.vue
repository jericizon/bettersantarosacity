<script setup lang="ts">
defineProps<{
  type: 'official' | 'community' | 'external'
}>()
</script>

<template>
  <span
    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
    :class="{
      'bg-laguna-green/10 text-laguna-green border border-laguna-green/20': type === 'official',
      'bg-heritage-gold/20 text-charcoal border border-heritage-gold/30': type === 'community',
      'bg-charcoal/10 text-charcoal border border-charcoal/20': type === 'external'
    }"
  >
    {{ type === 'official' ? 'Official source' : type === 'community' ? 'Community presentation' : 'External source' }}
  </span>
</template>
