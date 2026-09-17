<script setup lang="ts">
import { SITE_URL } from '~/utils/seo'

// Legacy route: content moved to /finances/budget. The meta refresh and
// visible link carry readers; public/_redirects issues the true HTTP 301 at
// the edge. useHead is a Nuxt auto-import; the guard keeps this stub
// mountable under plain Vitest.
if (typeof useHead === 'function') {
  useHead({
    title: 'Moved to /finances/budget · Better Santa Rosa City',
    meta: [
      { 'http-equiv': 'refresh', content: '0;url=/finances/budget' },
      { name: 'robots', content: 'noindex' }
    ],
    link: [{ rel: 'canonical', href: `${SITE_URL}/finances/budget` }]
  })
}
</script>

<template>
  <div data-pagefind-ignore class="max-w-3xl mx-auto px-4 py-16 text-center text-sm text-charcoal/70">
    This page has moved to <NuxtLink to="/finances/budget" class="text-laguna-green font-semibold underline">/finances/budget</NuxtLink>.
  </div>
</template>
