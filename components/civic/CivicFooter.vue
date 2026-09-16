<script setup lang="ts">
</script>

<template>
  <footer class="bg-charcoal text-parchment mt-20 border-t border-charcoal/20 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div class="md:col-span-2 space-y-4">
        <div class="flex items-center gap-2">
          <div class="w-9 h-9 rounded-full bg-parchment flex items-center justify-center p-0.5 shrink-0" aria-hidden="true">
            <img src="/images/bettersantarosacity-logo.svg" alt="" width="32" height="32" class="w-full h-full object-contain">
          </div>
          <h3 class="font-serif font-bold text-lg text-white">Better Santa Rosa City</h3>
        </div>
        <p class="text-xs text-parchment/70 leading-relaxed max-w-md">
          An independent, community-maintained civic intelligence and open-data portal. Our mission is to make public documents, municipal budgets, and city projects understandable and discoverable for every citizen of Santa Rosa, Laguna.
        </p>
        <p class="text-[11px] text-parchment/60 leading-relaxed border-l-2 border-heritage-gold/60 pl-3">
          <strong class="font-semibold text-parchment/80">Independent community project.</strong>
          This website is not affiliated with, endorsed by, or operated by the City Government of Santa Rosa or any government agency. All information is compiled from public sources for civic transparency. For official municipal services and announcements, visit <a href="https://santarosacity.gov.ph" target="_blank" rel="noopener noreferrer" class="underline text-heritage-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-heritage-gold rounded-sm">santarosacity.gov.ph</a>.
        </p>
      </div>

      <div>
        <h4 class="font-bold text-xs uppercase tracking-wider text-heritage-gold mb-3">Public Data</h4>
        <ul class="space-y-2 text-xs text-parchment/80">
          <li><NuxtLink to="/barangays" class="hover:text-white rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-heritage-gold">18 Barangays</NuxtLink></li>
          <li><NuxtLink to="/government" class="hover:text-white rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-heritage-gold">City Officials</NuxtLink></li>
          <li><NuxtLink to="/money" class="hover:text-white rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-heritage-gold">Annual Budget</NuxtLink></li>
          <li><NuxtLink to="/projects" class="hover:text-white rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-heritage-gold">Public Projects</NuxtLink></li>
          <li><NuxtLink to="/laws" class="hover:text-white rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-heritage-gold">City Ordinances</NuxtLink></li>
        </ul>
      </div>

      <div>
        <h4 class="font-bold text-xs uppercase tracking-wider text-heritage-gold mb-3">Transparency</h4>
        <ul class="space-y-2 text-xs text-parchment/80">
          <li><NuxtLink to="/sources" class="hover:text-white rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-heritage-gold">Sources & Methodology</NuxtLink></li>
          <li><a href="/about/media" class="hover:text-white rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-heritage-gold">Media & Image Credits</a></li>
          <li><NuxtLink to="/data" class="hover:text-white rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-heritage-gold">Open Data Downloads</NuxtLink></li>
          <li><NuxtLink to="/services" class="hover:text-white rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-heritage-gold">Official Services Directory</NuxtLink></li>
          <li><a href="https://github.com/bettersantarosa" target="_blank" rel="noopener noreferrer" class="hover:text-white rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-heritage-gold">GitHub Repository ↗</a></li>
        </ul>
      </div>
    </div>
  </footer>
</template>
