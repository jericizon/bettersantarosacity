<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Search } from 'lucide-vue-next'

const query = ref('')
const inputEl = ref<HTMLInputElement | null>(null)

function goToSearch(q?: string) {
  const trimmed = q?.trim() ?? ''
  const target = trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search'
  // navigateTo is a Nuxt auto-import at runtime; the guard keeps this
  // component mountable in a plain Vitest environment too.
  if (typeof navigateTo === 'function') {
    void navigateTo(target)
  } else if (typeof window !== 'undefined') {
    window.location.assign(target)
  }
}

function onSubmit() {
  goToSearch(query.value)
}

// Cmd/Ctrl+K focuses the box; on small screens the input is hidden, so
// jump straight to the search page instead.
function onGlobalKeydown(event: KeyboardEvent) {
  if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 'k') return
  event.preventDefault()
  const el = inputEl.value
  if (!el) return
  if (el.offsetParent === null) {
    goToSearch()
    return
  }
  el.focus()
  el.select()
}

onMounted(() => window.addEventListener('keydown', onGlobalKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onGlobalKeydown))
</script>

<template>
  <form role="search" class="relative w-44 lg:w-64" @submit.prevent="onSubmit">
    <label for="global-search-input" class="sr-only">
      Search Santa Rosa public records
    </label>
    <Search
      :size="14"
      aria-hidden="true"
      class="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-charcoal/50"
    />
    <input
      id="global-search-input"
      ref="inputEl"
      v-model="query"
      type="search"
      name="q"
      autocomplete="off"
      placeholder="Search Santa Rosa..."
      class="w-full rounded-md border border-charcoal/20 bg-white py-1.5 pl-8 pr-10 text-xs text-charcoal placeholder:text-charcoal/50 focus:border-laguna-green focus:outline-none focus:ring-2 focus:ring-laguna-green/30"
    />
    <kbd
      aria-hidden="true"
      class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded bg-parchment px-1.5 py-0.5 text-[10px] text-charcoal/60"
    >⌘K</kbd>
  </form>
</template>
