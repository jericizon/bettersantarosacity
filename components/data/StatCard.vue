<script setup lang="ts">
defineProps<{
  value: string | number
  label: string
  source?: string
  note?: string
}>()
</script>

<template>
  <div class="rounded-lg border border-charcoal/10 bg-white p-5 shadow-sm">
    <p class="font-serif text-3xl font-bold text-laguna-green tracking-tight">{{ value }}</p>
    <p class="mt-1 text-sm font-medium text-charcoal">{{ label }}</p>
    <p v-if="note" class="mt-1 text-xs text-charcoal/70">{{ note }}</p>
    <p v-if="source" class="mt-3 border-t border-charcoal/10 pt-2 text-[11px] text-charcoal/80">
      Source: <span class="font-medium">{{ source }}</span>
    </p>
  </div>
</template>
