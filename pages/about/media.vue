<script setup lang="ts">
import mediaData from '~/data/media.json'
import { buildSeoHead } from '~/utils/seo'
import type { MediaItem } from '~/types/civic'

if (typeof useHead === 'function') {
  useHead(buildSeoHead({
    title: 'Media & Photography Credits — Better Santa Rosa City',
    description: 'Complete licensing, provenance, and attribution details for all media assets used across Better Santa Rosa City.',
    path: '/about/media'
  }))
}

const mediaList = mediaData as MediaItem[]
</script>

<template>
  <div data-pagefind-filter="type:pages" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
    <div>
      <p class="text-xs font-semibold uppercase tracking-widest text-rose-accent-dark">
        Provenance & Transparency
      </p>
      <h1 class="mt-2 font-serif text-3xl sm:text-4xl font-bold text-laguna-green">
        Media & Photography Credits
      </h1>
      <p class="mt-3 text-sm text-charcoal/80 leading-relaxed">
        Better Santa Rosa City is committed to copyright integrity and open licensing. Every media asset displayed across this site is an original illustration created for this project and released under an open license — credited below.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <article
        v-for="item in mediaList"
        :key="item.id"
        class="rounded-xl border border-charcoal/10 bg-white p-5 shadow-sm space-y-3"
      >
        <img
          :src="item.file"
          :alt="item.title"
          :width="item.width"
          :height="item.height"
          loading="lazy"
          class="w-full h-44 object-cover rounded-lg border border-charcoal/10"
        />
        <div>
          <h2 class="font-serif text-lg font-bold text-charcoal">{{ item.title }}</h2>
          <p v-if="item.description" class="text-xs text-charcoal/70 mt-1">{{ item.description }}</p>
        </div>
        <div class="pt-3 border-t border-charcoal/10 text-xs space-y-1 text-charcoal/80">
          <p><strong>Author:</strong> {{ item.author }}</p>
          <p>
            <strong>License:</strong>
            <a :href="item.licenseUrl" target="_blank" rel="noopener noreferrer" class="ml-1 text-laguna-green underline hover:text-rose-accent-dark rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green">
              {{ item.license }}
            </a>
          </p>
          <p>
            <strong>Source:</strong>
            <a :href="item.sourceUrl" target="_blank" rel="noopener noreferrer" class="ml-1 text-laguna-green underline hover:text-rose-accent-dark rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green">
              {{ item.source }} ↗
            </a>
          </p>
        </div>
      </article>
    </div>
  </div>
</template>
