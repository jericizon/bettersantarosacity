<script setup lang="ts">
interface TimelineItem {
  year: string
  title: string
  description: string
}

defineProps<{
  items: TimelineItem[]
}>()
</script>

<template>
  <ol class="relative ml-2 space-y-8 border-l-2 border-charcoal/15 sm:ml-4">
    <li v-for="item in items" :key="`${item.year}-${item.title}`" class="relative pl-8">
      <span
        aria-hidden="true"
        class="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full border-2 border-parchment bg-rose-accent"
      />
      <p class="font-serif text-sm font-bold tracking-wide text-rose-accent-dark">{{ item.year }}</p>
      <h3 class="mt-0.5 font-serif text-lg font-bold leading-snug text-laguna-green">{{ item.title }}</h3>
      <p class="mt-1 max-w-3xl text-sm leading-relaxed text-charcoal/75">{{ item.description }}</p>
    </li>
  </ol>
</template>
