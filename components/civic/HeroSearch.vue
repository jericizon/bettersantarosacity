<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Search } from 'lucide-vue-next'
import { useReducedMotion } from '~/composables/useReducedMotion'

const query = ref('')
const searchInput = ref<HTMLInputElement | null>(null)
const isReduced = useReducedMotion()

const placeholders = [
  'Search Santa Rosa...',
  'Search budgets...',
  'Search projects...',
  'Search ordinances...',
  'Search barangays...',
  'Search officials...'
]

const currentPlaceholder = ref(placeholders[0])
let intervalId: ReturnType<typeof setInterval> | null = null

function cyclePlaceholder() {
  let idx = 0
  intervalId = setInterval(() => {
    if (!query.value) {
      idx = (idx + 1) % placeholders.length
      currentPlaceholder.value = placeholders[idx]
    }
  }, 3500)
}

function handleGlobalKeydown(e: KeyboardEvent) {
  if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== 'k') return
  // Don't yank focus while the user is typing in another field — e.g. the
  // header GlobalSearch input, which also binds ⌘K on this page.
  const t = e.target
  if (t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement || t instanceof HTMLSelectElement) return
  e.preventDefault()
  searchInput.value?.focus()
}

function onSubmit() {
  const q = query.value.trim()
  const target = q ? `/search?q=${encodeURIComponent(q)}` : '/search'
  // navigateTo is a Nuxt auto-import at runtime; the guard keeps this
  // component mountable in a plain Vitest environment too.
  if (typeof navigateTo === 'function') {
    void navigateTo(target)
  } else if (typeof window !== 'undefined') {
    window.location.assign(target)
  }
}

onMounted(() => {
  if (!isReduced.value) cyclePlaceholder()
  window.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
  window.removeEventListener('keydown', handleGlobalKeydown)
})
</script>

<template>
  <form role="search" class="w-full max-w-2xl" @submit.prevent="onSubmit">
    <div class="relative group">
      <label for="hero-search-input" class="sr-only">Search Santa Rosa public records</label>
      <Search
        :size="20"
        aria-hidden="true"
        class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/50 group-focus-within:text-laguna-green transition-colors"
      />
      <input
        id="hero-search-input"
        ref="searchInput"
        v-model="query"
        type="search"
        name="q"
        autocomplete="off"
        :placeholder="currentPlaceholder"
        class="w-full rounded-xl border-2 border-charcoal/15 bg-white py-4 pl-12 pr-24 text-base text-charcoal shadow-sm placeholder:text-charcoal/60 transition-all focus:border-laguna-green focus:outline-none focus:ring-4 focus:ring-laguna-green/15 focus:shadow-md"
      />
      <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
        <kbd
          class="hidden sm:inline-flex items-center gap-0.5 rounded border border-charcoal/20 bg-parchment px-2 py-0.5 text-[11px] font-mono text-charcoal/70"
          title="Press Command/Ctrl + K to search"
        >
          <span class="text-xs">⌘</span>K
        </kbd>
        <button
          type="submit"
          class="rounded-lg bg-laguna-green px-4 py-2 text-sm font-semibold text-parchment transition hover:bg-laguna-green/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
        >
          Search
        </button>
      </div>
    </div>
  </form>
</template>
