<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { Search, X } from 'lucide-vue-next'
import { useSearchModal } from '~/composables/useSearchModal'
import {
  SEARCH_CATEGORIES,
  matchSearchDocs,
  buildExcerpt,
  markHtml,
  type SearchDoc,
  type SearchResultCategory
} from '~/utils/search-docs'

const { isOpen, close } = useSearchModal()

const query = ref('')
const inputEl = ref<HTMLInputElement | null>(null)
const panelEl = ref<HTMLElement | null>(null)
const activeIndex = ref(-1)

let previouslyFocused: HTMLElement | null = null

const PER_GROUP = 3
const GROUP_ORDER = SEARCH_CATEGORIES
  .map(c => c.id)
  .filter((id): id is SearchResultCategory => id !== 'all')

const QUICK_LINKS = [
  { name: 'Explore the city', href: '/explore' },
  { name: 'Elected officials', href: '/government' },
  { name: 'Public services', href: '/services' },
  { name: 'Ordinances & laws', href: '/laws' },
  { name: 'City finances', href: '/finances' },
  { name: 'Open data', href: '/data' }
]

interface ResultGroup {
  id: SearchResultCategory
  label: string
  count: number
  items: SearchDoc[]
}

const matched = computed<SearchDoc[]>(() => matchSearchDocs(query.value))
const totalCount = computed(() => matched.value.length)

// Per-group top hits, in SEARCH_CATEGORIES order. flatItems is the same
// set flattened in render order — it backs arrow-key navigation.
const groups = computed<ResultGroup[]>(() => {
  const byType = new Map<SearchResultCategory, SearchDoc[]>()
  for (const d of matched.value) {
    const list = byType.get(d.type)
    if (list) list.push(d)
    else byType.set(d.type, [d])
  }
  return GROUP_ORDER
    .filter(id => byType.has(id))
    .map(id => {
      const docs = byType.get(id) ?? []
      return {
        id,
        label: SEARCH_CATEGORIES.find(c => c.id === id)?.label ?? 'Pages',
        count: docs.length,
        items: docs.slice(0, PER_GROUP)
      }
    })
})

const flatItems = computed<SearchDoc[]>(() => groups.value.flatMap(g => g.items))

const flatIndex = computed(() => {
  const map = new Map<SearchDoc, number>()
  flatItems.value.forEach((d, i) => map.set(d, i))
  return map
})

const searchPageHref = computed(() => {
  const q = query.value.trim()
  return q ? `/search?q=${encodeURIComponent(q)}` : '/search'
})

function navigate(url: string) {
  close()
  // navigateTo is a Nuxt auto-import at runtime; the guard keeps this
  // component mountable in a plain Vitest environment too.
  if (typeof navigateTo === 'function') {
    void navigateTo(url)
  } else if (typeof window !== 'undefined') {
    window.location.assign(url)
  }
}

function onSubmit() {
  navigate(searchPageHref.value)
}

function moveActive(delta: number) {
  const n = flatItems.value.length
  if (!n) return
  activeIndex.value = (activeIndex.value + delta + n) % n
}

function trapFocus(e: KeyboardEvent) {
  const panel = panelEl.value
  if (!panel) return
  const focusables = Array.from(
    panel.querySelectorAll<HTMLElement>('input, a[href], button')
  )
  if (!focusables.length) return
  const first = focusables[0]!
  const last = focusables[focusables.length - 1]!
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

function onPanelKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.preventDefault()
    close()
  } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    close()
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    moveActive(1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    moveActive(-1)
  } else if (e.key === 'Enter' && activeIndex.value >= 0) {
    e.preventDefault()
    const item = flatItems.value[activeIndex.value]
    if (item) navigate(item.url)
  } else if (e.key === 'Tab') {
    trapFocus(e)
  }
}

watch(query, () => {
  activeIndex.value = -1
})

watch(isOpen, async (open) => {
  if (open) {
    previouslyFocused = document.activeElement as HTMLElement | null
    query.value = ''
    activeIndex.value = -1
    document.body.style.overflow = 'hidden'
    await nextTick()
    inputEl.value?.focus()
  } else {
    document.body.style.overflow = ''
    previouslyFocused?.focus()
    previouslyFocused = null
  }
})

// If the component unmounts while open, don't leave the page scroll-locked.
onBeforeUnmount(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <Transition name="search-modal">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh] pb-8"
      role="dialog"
      aria-modal="true"
      aria-label="Search Santa Rosa public records"
    >
      <div
        class="absolute inset-0 bg-charcoal/60 backdrop-blur-sm"
        aria-hidden="true"
        @click="close"
      />

      <div
        ref="panelEl"
        class="relative flex max-h-[70vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-charcoal/15 bg-parchment shadow-2xl"
        @keydown="onPanelKeydown"
      >
        <form
          role="search"
          class="flex items-center gap-3 border-b border-charcoal/10 px-4"
          @submit.prevent="onSubmit"
        >
          <Search :size="18" aria-hidden="true" class="shrink-0 text-charcoal/50" />
          <label for="search-modal-input" class="sr-only">Search Santa Rosa public records</label>
          <input
            id="search-modal-input"
            ref="inputEl"
            v-model="query"
            type="search"
            name="q"
            autocomplete="off"
            placeholder="Search officials, barangays, projects, laws…"
            role="combobox"
            :aria-expanded="query.trim() ? 'true' : 'false'"
            aria-controls="search-modal-results"
            :aria-activedescendant="activeIndex >= 0 ? `search-modal-item-${activeIndex}` : undefined"
            class="h-14 min-w-0 flex-1 bg-transparent py-3.5 text-base text-charcoal placeholder:text-charcoal/50 focus:outline-none"
          >
          <kbd
            aria-hidden="true"
            class="hidden shrink-0 rounded border border-charcoal/20 bg-white px-1.5 py-0.5 text-[10px] text-charcoal/70 sm:inline-flex"
          >esc</kbd>
          <button
            type="button"
            aria-label="Close search"
            class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-charcoal/60 transition hover:bg-charcoal/5 hover:text-charcoal focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
            @click="close"
          >
            <X :size="16" aria-hidden="true" />
          </button>
        </form>

        <div
          v-if="query.trim()"
          id="search-modal-results"
          role="listbox"
          aria-label="Search suggestions"
          class="overflow-y-auto p-2"
        >
          <template v-for="group in groups" :key="group.id">
            <p class="flex items-baseline justify-between px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wide text-charcoal/50">
              {{ group.label }}
              <span class="rounded bg-charcoal/10 px-1.5 py-0.5 font-medium normal-case tracking-normal">{{ group.count }}</span>
            </p>
            <ul role="group" :aria-label="group.label" class="space-y-0.5">
              <li v-for="item in group.items" :key="`${item.url}::${item.title}`" role="presentation">
                <a
                  :id="`search-modal-item-${flatIndex.get(item)}`"
                  :href="item.url"
                  role="option"
                  :aria-selected="flatIndex.get(item) === activeIndex"
                  class="block rounded-lg px-3 py-2 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
                  :class="flatIndex.get(item) === activeIndex ? 'bg-laguna-green/10' : 'hover:bg-charcoal/5'"
                  @click="close"
                  @mousemove="activeIndex = flatIndex.get(item) ?? -1"
                  @focus="activeIndex = flatIndex.get(item) ?? -1"
                >
                  <span
                    class="block truncate text-sm font-medium text-charcoal [&_mark]:rounded-sm [&_mark]:bg-heritage-gold/40 [&_mark]:px-0.5 [&_mark]:font-semibold"
                    v-html="markHtml(item.title, query.trim())"
                  />
                  <span
                    class="mt-0.5 block truncate text-xs text-charcoal/60 [&_mark]:rounded-sm [&_mark]:bg-heritage-gold/40 [&_mark]:px-0.5"
                    v-html="buildExcerpt(item.description || item.title, query.trim())"
                  />
                </a>
              </li>
            </ul>
          </template>

          <p
            v-if="!flatItems.length"
            class="px-3 py-6 text-center text-sm text-charcoal/70"
          >
            No quick matches for “{{ query.trim() }}” — press
            <kbd class="rounded bg-white px-1.5 py-0.5 text-[10px] text-charcoal/80 border border-charcoal/20">↵</kbd>
            to run a full search.
          </p>
        </div>

        <div v-else class="p-4">
          <p class="px-1 pb-2 text-[11px] font-semibold uppercase tracking-wide text-charcoal/50">
            Quick links
          </p>
          <div class="flex flex-wrap gap-2">
            <a
              v-for="link in QUICK_LINKS"
              :key="link.href"
              :href="link.href"
              class="rounded-full border border-charcoal/15 bg-white px-3 py-1.5 text-xs font-medium text-charcoal/80 transition hover:border-laguna-green hover:text-laguna-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
              @click="close"
            >
              {{ link.name }}
            </a>
          </div>
        </div>

        <div class="mt-auto flex items-center justify-between gap-3 border-t border-charcoal/10 bg-white/60 px-4 py-2.5 text-xs text-charcoal/60">
          <span class="hidden items-center gap-2 sm:flex" aria-hidden="true">
            <kbd class="rounded border border-charcoal/20 bg-parchment px-1.5 py-0.5 text-[10px]">↑↓</kbd> navigate
            <kbd class="rounded border border-charcoal/20 bg-parchment px-1.5 py-0.5 text-[10px]">↵</kbd> open
            <kbd class="rounded border border-charcoal/20 bg-parchment px-1.5 py-0.5 text-[10px]">esc</kbd> close
          </span>
          <a
            :href="searchPageHref"
            class="ml-auto inline-flex items-center gap-1.5 font-medium text-laguna-green underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green rounded-sm"
            @click="close"
          >
            <template v-if="query.trim()">
              View all {{ totalCount }} result{{ totalCount === 1 ? '' : 's' }}
            </template>
            <template v-else>Open search page</template>
          </a>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.search-modal-enter-active,
.search-modal-leave-active {
  transition: opacity 0.15s ease;
}

.search-modal-enter-from,
.search-modal-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .search-modal-enter-active,
  .search-modal-leave-active {
    transition: none;
  }
}
</style>
