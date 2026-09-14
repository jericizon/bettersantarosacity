<script setup lang="ts">
import { ref } from 'vue'
import { Search, Menu, X } from 'lucide-vue-next'

const isMobileOpen = ref(false)
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

function closeMobile() {
  isMobileOpen.value = false
}
</script>

<template>
  <header class="sticky top-0 z-40 bg-parchment/95 backdrop-blur border-b border-charcoal/10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <NuxtLink to="/" class="flex items-center gap-2 group rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green">
        <div class="w-8 h-8 rounded-full bg-laguna-green flex items-center justify-center text-parchment font-serif font-bold text-sm" aria-hidden="true">
          SR
        </div>
        <div>
          <span class="font-serif font-bold text-lg text-laguna-green tracking-tight group-hover:text-rose-accent-dark transition-colors">
            Better Santa Rosa
          </span>
          <span class="block text-[10px] text-charcoal/80 -mt-1 font-sans">
            Laguna · Public Information
          </span>
        </div>
      </NuxtLink>

      <nav aria-label="Primary" class="hidden md:flex items-center gap-6">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.href"
          :to="link.href"
          class="text-sm font-medium text-charcoal/80 hover:text-laguna-green transition-colors rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
          active-class="text-laguna-green font-bold border-b-2 border-laguna-green pb-1"
        >
          {{ link.name }}
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-3">
        <SearchGlobalSearch class="hidden sm:block" />
        <NuxtLink
          to="/search"
          class="sm:hidden inline-flex items-center p-2 rounded-md bg-white border border-charcoal/20 text-charcoal/70 hover:border-laguna-green transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
          aria-label="Search Santa Rosa public records"
        >
          <Search :size="14" aria-hidden="true" />
        </NuxtLink>

        <button
          type="button"
          @click="isMobileOpen = !isMobileOpen"
          class="md:hidden p-2 rounded text-charcoal hover:bg-charcoal/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
          aria-label="Toggle Navigation Menu"
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
      class="md:hidden border-b border-charcoal/10 bg-parchment px-4 py-3 space-y-2"
      @keydown.escape="closeMobile"
    >
      <NuxtLink
        to="/search"
        @click="closeMobile"
        class="block py-1.5 text-sm font-medium text-laguna-green rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
      >
        Search
      </NuxtLink>
      <NuxtLink
        v-for="link in navLinks"
        :key="link.href"
        :to="link.href"
        @click="closeMobile"
        class="block py-1.5 text-sm font-medium text-charcoal rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
      >
        {{ link.name }}
      </NuxtLink>
    </nav>
  </header>
</template>
