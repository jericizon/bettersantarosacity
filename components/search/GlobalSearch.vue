<script setup lang="ts">
import { Search } from 'lucide-vue-next'
import { useSearchModal } from '~/composables/useSearchModal'

const { open } = useSearchModal()
</script>

<template>
  <button
    type="button"
    class="inline-flex h-11 items-center gap-2 rounded-md border border-charcoal/20 bg-white px-3 text-charcoal/70 transition hover:border-laguna-green hover:text-laguna-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
    aria-label="Search Santa Rosa public records"
    aria-haspopup="dialog"
    @click="open"
  >
    <Search :size="16" aria-hidden="true" />
    <kbd
      aria-hidden="true"
      class="hidden rounded bg-parchment px-1.5 py-0.5 text-[10px] text-charcoal/80 lg:inline-flex"
    >⌘K</kbd>
  </button>
</template>
