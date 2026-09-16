<script setup lang="ts">
import { computed } from 'vue'
import mediaData from '~/data/media.json'
import CivicImage from '~/components/media/CivicImage.vue'
import type { MediaItem } from '~/types/civic'

interface TimelineItem {
  year: string
  title: string
  description: string
}

const props = withDefaults(defineProps<{
  items: TimelineItem[]
  // 'dark' pairs with the deep-green homepage chapter (spec §4); default stays
  // light for the explore page.
  theme?: 'light' | 'dark'
}>(), {
  theme: 'light'
})

// media.json is validated against MediaItemSchema by media-schema.spec.ts;
// the JSON import widens `category` to string, so assert the type once here.
const media = mediaData as MediaItem[]

// Landmark imagery pinned to pivotal years (Spec §14 — magazine timeline).
// Entries without a landmark stay text-only: deliberate editorial whitespace.
const landmarkByYear: Record<string, string> = {
  '1571': 'santa-rosa-arch', // Barrio Bukol — arch at the historic boundary
  '1792': 'santa-rosa-church', // founding — the 1792 parish church
  '1945': 'cuartel-santo-domingo', // Liberation — the Spanish-era barracks
  '2004': 'santa-rosa-cityhall', // cityhood — seat of city government
  '2025': 'nuvali-lake' // Nuvali civic-complex MOU — the eco-corridor
}

const entries = computed(() =>
  props.items.map(item => ({
    ...item,
    landmark: media.find(m => m.id === landmarkByYear[item.year])
  }))
)
</script>

<template>
  <!-- Continuous rule via pseudo-element (ol may only contain li children):
       left rail on mobile, centered spine on md+ -->
  <ol
    :class="[
      'relative space-y-12 md:space-y-16 before:absolute before:top-1 before:bottom-1 before:left-1.5 before:w-0.5 before:-translate-x-1/2 before:rounded-full before:content-[\'\'] md:before:left-1/2',
      theme === 'dark' ? 'before:bg-parchment/25' : 'before:bg-charcoal/15'
    ]"
  >
    <li
      v-for="(entry, i) in entries"
      :key="`${entry.year}-${entry.title}`"
      class="relative pl-8 md:grid md:grid-cols-2 md:items-center md:gap-x-16 md:pl-0"
    >
      <!-- Era marker on the spine; heritage-gold marks entries with landmark imagery -->
      <span
        aria-hidden="true"
        :class="[
          'absolute left-1.5 top-2.5 h-3 w-3 -translate-x-1/2 rounded-full border-2 md:left-1/2 md:top-1/2 md:-translate-y-1/2',
          // Marker ring matches the ground so the dot reads as a break in the spine.
          theme === 'dark' ? 'border-laguna-green' : 'border-parchment',
          entry.landmark ? 'bg-heritage-gold' : 'bg-rose-accent'
        ]"
      />
      <div
        :class="i % 2 === 0
          ? 'md:col-start-1 md:justify-self-end md:text-right'
          : 'md:col-start-2 md:justify-self-start'"
        class="md:max-w-md"
      >
        <p
          :class="[
            'font-serif text-2xl font-bold leading-none tracking-tight md:text-3xl',
            theme === 'dark' ? 'text-heritage-gold' : 'text-rose-accent-dark'
          ]"
        >
          {{ entry.year }}
        </p>
        <h3
          :class="[
            'mt-2 font-serif text-lg font-bold leading-snug',
            theme === 'dark' ? 'text-parchment' : 'text-laguna-green'
          ]"
        >{{ entry.title }}</h3>
        <p
          :class="[
            'mt-1 text-sm leading-relaxed',
            theme === 'dark' ? 'text-parchment/80' : 'text-charcoal/75'
          ]"
        >{{ entry.description }}</p>
      </div>
      <div
        v-if="entry.landmark"
        :class="i % 2 === 0
          ? 'md:col-start-2 md:justify-self-start'
          : 'md:col-start-1 md:justify-self-end'"
        class="mt-5 w-full md:row-start-1 md:mt-0 md:max-w-md"
      >
        <CivicImage :media="entry.landmark" aspect-ratio="4 / 3" />
      </div>
    </li>
  </ol>
</template>
