<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Search, Menu, X } from 'lucide-vue-next'

const isMobileOpen = ref(false)
const isScrolled = ref(false)
const mobileToggle = ref<HTMLButtonElement | null>(null)
const navLinks = [
  { name: 'Explore', href: '/explore' },
  { name: 'Barangays', href: '/barangays' },
  { name: 'Government', href: '/government' },
  { name: 'Money', href: '/money' },
  { name: 'Projects', href: '/projects' },
  { name: 'Laws', href: '/laws' },
  { name: 'Services', href: '/services' },
  { name: 'Data', href: '/data' },
  { name: 'Sources', href: '/sources' }
]

function onScroll() {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

function closeMobile() {
  isMobileOpen.value = false
  // v-if destroys the drawer; without this, focus inside it drops to <body>.
  mobileToggle.value?.focus()
}
</script>

<template>
  <header
    class="sticky top-0 z-40 backdrop-blur border-b transition-all duration-300"
    :class="isScrolled ? 'bg-parchment shadow-md border-charcoal/15' : 'bg-parchment/95 border-charcoal/10'"
  >
    <div
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-300"
      :class="isScrolled ? 'py-2' : 'py-3'"
    >
      <NuxtLink to="/" class="flex items-center gap-2 group rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green">
        <img
          src="/images/bettersantarosa-logo.png"
          alt="Better Santa Rosa City"
          width="477"
          height="176"
          class="h-12 w-auto sm:h-14 object-contain shrink-0"
        >
      </NuxtLink>

      <nav aria-label="Primary" class="hidden xl:flex items-center gap-4">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.href"
          :to="link.href"
          class="whitespace-nowrap inline-flex items-center min-h-11 text-sm font-medium text-charcoal/80 hover:text-laguna-green transition-colors rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
          active-class="text-laguna-green font-bold underline decoration-2 underline-offset-8"
        >
          {{ link.name }}
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-3">
        <SearchGlobalSearch class="hidden sm:block" />
        <NuxtLink
          to="/search"
          class="sm:hidden inline-flex items-center justify-center h-11 w-11 rounded-md bg-white border border-charcoal/20 text-charcoal/70 hover:border-laguna-green transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
          aria-label="Search Santa Rosa public records"
        >
          <Search :size="18" aria-hidden="true" />
        </NuxtLink>

        <button
          ref="mobileToggle"
          type="button"
          @click="isMobileOpen = !isMobileOpen"
          class="xl:hidden inline-flex items-center justify-center h-11 w-11 rounded text-charcoal hover:bg-charcoal/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
          aria-label="Toggle navigation menu"
          :aria-expanded="isMobileOpen"
          aria-controls="mobile-nav"
        >
          <Menu v-if="!isMobileOpen" :size="20" aria-hidden="true" />
          <X v-else :size="20" aria-hidden="true" />
        </button>
      </div>
    </div>

    <!-- Mobile Drawer -->
    <nav
      v-if="isMobileOpen"
      id="mobile-nav"
      aria-label="Mobile"
      class="xl:hidden border-b border-charcoal/10 bg-parchment px-4 py-3 space-y-1"
      @keydown.escape="closeMobile"
    >
      <NuxtLink
        to="/search"
        @click="closeMobile"
        class="flex items-center min-h-11 text-sm font-medium text-laguna-green rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
      >
        Search
      </NuxtLink>
      <NuxtLink
        v-for="link in navLinks"
        :key="link.href"
        :to="link.href"
        @click="closeMobile"
        class="flex items-center min-h-11 text-sm font-medium text-charcoal rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
      >
        {{ link.name }}
      </NuxtLink>
    </nav>
  </header>
</template>
