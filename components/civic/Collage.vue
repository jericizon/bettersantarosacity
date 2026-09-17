<script setup lang="ts">
import mediaData from '~/data/media.json'
import CivicImage from '~/components/media/CivicImage.vue'
import EditorialSectionHeader from '~/components/editorial/SectionHeader.vue'
import type { MediaItem } from '~/types/civic'

// media.json is validated against MediaItemSchema by media-schema.spec.ts;
// the JSON import widens `category` to string, so assert the type once here.
const media = mediaData as MediaItem[]

const archImage = media.find(m => m.id === 'santa-rosa-arch') || media[0]!
const churchImage = media.find(m => m.id === 'santa-rosa-church') || media[1]!
const cuartelImage = media.find(m => m.id === 'cuartel-santo-domingo') || media[4]!
const nuvaliImage = media.find(m => m.id === 'nuvali-lake') || media[3]!
</script>

<template>
  <div>
    <EditorialSectionHeader
      eyebrow="Santa Rosa Life & Heritage"
      title="A city with deep roots and modern horizons."
      description="From the lakeside settlements of Barrio Bukol to high-technology corridors and protected heritage sites, Santa Rosa embodies Philippine municipal transformation."
    />

    <!-- Dark framed gallery panel on the parchment chapter: one large focal
         portrait paired with a staggered secondary rail and a wide landscape
         frame (asymmetrical magazine collage, spec §15). Every figure carries
         a caption and a MediaCredit attribution badge. -->
    <div class="mt-12 rounded-2xl bg-charcoal p-6 text-parchment sm:mt-16 sm:p-10 lg:p-14">
      <div class="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-12 lg:gap-x-10">
        <figure class="sm:col-span-7">
          <CivicImage :media="archImage" aspect-ratio="4 / 5" />
          <figcaption class="mt-4">
            <p class="font-serif text-lg font-bold text-parchment">{{ archImage.title }}</p>
            <p class="mt-1 text-sm leading-relaxed text-parchment/70">{{ archImage.description }}</p>
          </figcaption>
        </figure>

        <!-- Secondary rail drops below the focal's top edge; the second frame
             is indented again so no two column edges align. -->
        <div class="flex flex-col gap-12 sm:col-span-5 sm:pt-20 lg:pt-28">
          <figure>
            <CivicImage :media="churchImage" aspect-ratio="4 / 3" />
            <figcaption class="mt-3">
              <p class="font-serif text-base font-bold text-parchment">{{ churchImage.title }}</p>
              <p class="mt-1 text-xs leading-relaxed text-parchment/70">{{ churchImage.description }}</p>
            </figcaption>
          </figure>
          <figure class="sm:ml-10 lg:ml-14">
            <CivicImage :media="cuartelImage" aspect-ratio="4 / 3" />
            <figcaption class="mt-3">
              <p class="font-serif text-base font-bold text-parchment">{{ cuartelImage.title }}</p>
              <p class="mt-1 text-xs leading-relaxed text-parchment/70">{{ cuartelImage.description }}</p>
            </figcaption>
          </figure>
        </div>

        <figure class="sm:col-span-6 lg:col-span-5">
          <CivicImage :media="nuvaliImage" aspect-ratio="16 / 9" />
          <figcaption class="mt-3">
            <p class="font-serif text-base font-bold text-parchment">{{ nuvaliImage.title }}</p>
            <p class="mt-1 text-xs leading-relaxed text-parchment/70">{{ nuvaliImage.description }}</p>
          </figcaption>
        </figure>
      </div>
    </div>
  </div>
</template>
