<!-- components/editorial/SectionHeader.vue -->
<script setup lang="ts">
import RoseMotif from '~/components/civic/RoseMotif.vue'

withDefaults(defineProps<{
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  theme?: 'light' | 'dark'
}>(), {
  align: 'left',
  theme: 'light'
})
</script>

<template>
  <div
    :class="[
      'max-w-3xl space-y-3',
      align === 'center' ? 'mx-auto text-center' : 'text-left'
    ]"
  >
    <div
      v-if="eyebrow"
      :class="[
        'inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em]',
        theme === 'dark' ? 'text-heritage-gold' : 'text-rose-accent-dark'
      ]"
    >
      <RoseMotif :size="14" :class="theme === 'dark' ? 'text-heritage-gold' : 'text-rose-accent'" />
      <span>{{ eyebrow }}</span>
    </div>

    <h2
      :class="[
        'font-serif text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl leading-tight',
        theme === 'dark' ? 'text-parchment' : 'text-laguna-green'
      ]"
    >
      {{ title }}
    </h2>

    <p
      v-if="description"
      :class="[
        'text-base leading-relaxed sm:text-lg',
        theme === 'dark' ? 'text-parchment/80' : 'text-charcoal/75'
      ]"
    >
      {{ description }}
    </p>
  </div>
</template>
