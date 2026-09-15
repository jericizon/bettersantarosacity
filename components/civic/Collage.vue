<script setup lang="ts">
import mediaData from '~/data/media.json'
import CivicImage from '~/components/media/CivicImage.vue'
import RoseMotif from './RoseMotif.vue'
import type { MediaItem } from '~/types/civic'

// media.json is validated against MediaItemSchema by media-schema.spec.ts;
// the JSON import widens `category` to string, so assert the type once here.
const media = mediaData as MediaItem[]

const archImage = media.find(m => m.id === 'santa-rosa-arch') || media[0]!
const churchImage = media.find(m => m.id === 'santa-rosa-church') || media[1]!
const nuvaliImage = media.find(m => m.id === 'nuvali-lake') || media[3]!
</script>

<template>
  <div class="relative overflow-hidden rounded-2xl bg-charcoal p-8 lg:p-12 text-parchment">
    <div class="max-w-2xl mb-8">
      <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-heritage-gold">
        <RoseMotif :size="16" class="text-heritage-gold" />
        <span>Santa Rosa Life & Heritage</span>
      </div>
      <h2 class="mt-2 font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
        A city with deep roots and modern horizons.
      </h2>
      <p class="mt-3 text-sm text-parchment/75 leading-relaxed">
        From the lakeside settlements of Barrio Bukol to high-technology corridors and protected heritage sites, Santa Rosa embodies Philippine municipal transformation.
      </p>
    </div>

    <!-- Asymmetrical magazine collage layout (Spec §15) -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
      <div class="md:col-span-6">
        <CivicImage :media="archImage" aspect-ratio="4 / 3" />
      </div>
      <div class="md:col-span-6 grid grid-cols-1 gap-6">
        <CivicImage :media="churchImage" aspect-ratio="16 / 9" />
        <CivicImage :media="nuvaliImage" aspect-ratio="16 / 9" />
      </div>
    </div>
  </div>
</template>
