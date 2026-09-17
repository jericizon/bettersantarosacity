<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { registerSearchShortcut } from '~/composables/useSearchShortcut'

let cleanupShortcut: (() => void) | undefined

onMounted(() => {
  cleanupShortcut = registerSearchShortcut(() => {
    // Priority: homepage hero input, then the visible header input, else
    // the search page (e.g. small screens where the header input is hidden).
    const hero = document.getElementById('hero-search-input')
    if (hero) {
      hero.focus()
      return
    }
    const global = document.getElementById('global-search-input')
    if (global && global.offsetParent !== null) {
      global.focus()
      ;(global as HTMLInputElement).select()
      return
    }
    // navigateTo is a Nuxt auto-import at runtime; the guard keeps this
    // layout mountable in a plain Vitest environment too.
    if (typeof navigateTo === 'function') {
      void navigateTo('/search')
    } else if (typeof window !== 'undefined') {
      window.location.assign('/search')
    }
  })
})

onUnmounted(() => {
  cleanupShortcut?.()
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-parchment font-sans text-charcoal">
    <CivicDisclaimerBanner />
    <CivicHeader />
    <main class="flex-grow w-full">
      <slot />
    </main>
    <CivicFooter />
  </div>
</template>

