<script setup lang="ts">
import { computed } from 'vue'
import { ExternalLink } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    type: 'official' | 'primary' | 'secondary' | 'community'
    organization?: string
    date?: string
    url?: string
    label?: string
  }>(),
  {
    organization: undefined,
    date: undefined,
    url: undefined,
    label: undefined
  }
)

const badgeLabel = computed(() => {
  if (props.label) return props.label
  switch (props.type) {
    case 'official':
      return 'OFFICIAL'
    case 'primary':
      return 'PRIMARY'
    case 'secondary':
      return 'SECONDARY'
    case 'community':
      return 'BETTER SANTA ROSA'
    default:
      return 'SOURCE'
  }
})

const badgeClass = computed(() => {
  switch (props.type) {
    case 'official':
      return 'bg-laguna-green/10 text-laguna-green border-laguna-green/20'
    case 'primary':
      return 'bg-laguna-blue/15 text-laguna-green border-laguna-blue/30'
    case 'secondary':
      return 'bg-charcoal/10 text-charcoal/80 border-charcoal/20'
    case 'community':
      return 'bg-heritage-gold/20 text-charcoal border-heritage-gold/30'
    default:
      return 'bg-charcoal/10 text-charcoal border-charcoal/20'
  }
})
</script>

<template>
  <span class="inline-flex flex-wrap items-center gap-1.5 text-xs">
    <span
      class="inline-flex items-center px-2 py-0.5 rounded font-mono text-[10px] font-bold tracking-wider uppercase border"
      :class="badgeClass"
    >
      {{ badgeLabel }}
    </span>
    <span v-if="organization" class="font-medium text-charcoal/90">
      {{ organization }}
    </span>
    <span v-if="date" class="text-charcoal/60">
      · {{ date }}
    </span>
    <a
      v-if="url"
      :href="url"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-0.5 text-laguna-green hover:underline font-medium ml-0.5"
    >
      <span>Read original</span>
      <ExternalLink :size="12" aria-hidden="true" />
    </a>
  </span>
</template>
