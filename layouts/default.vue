<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { registerSearchShortcut } from '~/composables/useSearchShortcut'
import { useSearchModal } from '~/composables/useSearchModal'
import SearchModal from '~/components/search/SearchModal.vue'

const { toggle: toggleSearchModal } = useSearchModal()

let cleanupShortcut: (() => void) | undefined

onMounted(() => {
  cleanupShortcut = registerSearchShortcut(() => {
    toggleSearchModal()
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
    <SearchModal />
  </div>
</template>
