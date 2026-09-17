<script setup lang="ts">
// Shared 44px-tall hit area + visible focus ring for every footer link.
const linkClass = 'flex items-center min-h-11 hover:text-white rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-heritage-gold'
</script>

<template>
  <footer class="bg-charcoal text-parchment mt-20 border-t border-white/10 py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <!-- Brand & Mission -->
        <div class="space-y-4">
          <!-- Dark-green wordmark needs the parchment chip to stay legible on
               the charcoal footer; the lockup already carries the site name. -->
          <div class="inline-flex items-center rounded-lg bg-parchment px-3 py-2">
            <img
              src="/images/bettersantarosa-logo.png"
              alt="Better Santa Rosa City"
              width="477"
              height="176"
              class="h-10 w-auto object-contain"
            >
          </div>
          <p class="text-xs text-parchment/70 leading-relaxed">
            An independent, community-maintained civic intelligence and open-data portal. Our mission is to make public documents, municipal budgets, and city projects understandable and discoverable for every citizen of Santa Rosa, Laguna.
          </p>
        </div>

        <!-- Public Data -->
        <nav aria-label="Public data">
          <h4 class="font-bold text-xs uppercase tracking-wider text-heritage-gold mb-3">Public Data</h4>
          <ul class="text-xs text-parchment/80">
            <li><NuxtLink to="/barangays" :class="linkClass">18 Barangays</NuxtLink></li>
            <li><NuxtLink to="/government" :class="linkClass">City Officials</NuxtLink></li>
            <li><NuxtLink to="/money" :class="linkClass">Annual Budget</NuxtLink></li>
            <li><NuxtLink to="/projects" :class="linkClass">Public Projects</NuxtLink></li>
            <li><NuxtLink to="/laws" :class="linkClass">City Ordinances</NuxtLink></li>
          </ul>
        </nav>

        <!-- Transparency -->
        <nav aria-label="Transparency">
          <h4 class="font-bold text-xs uppercase tracking-wider text-heritage-gold mb-3">Transparency</h4>
          <ul class="text-xs text-parchment/80">
            <li><NuxtLink to="/about" :class="linkClass">About &amp; Disclaimer</NuxtLink></li>
            <li><NuxtLink to="/history" :class="linkClass">City History</NuxtLink></li>
            <li><NuxtLink to="/sources" :class="linkClass">Sources &amp; Methodology</NuxtLink></li>
            <li><NuxtLink to="/about/media" :class="linkClass">Media &amp; Image Credits</NuxtLink></li>
            <li><NuxtLink to="/data" :class="linkClass">Open Data Downloads</NuxtLink></li>
            <li><NuxtLink to="/services" :class="linkClass">Official Services Directory</NuxtLink></li>
            <li><a href="https://github.com/jericizon/bettersantarosacity" target="_blank" rel="noopener noreferrer" :class="linkClass">GitHub Repository ↗</a></li>
          </ul>
        </nav>

        <!-- Legal Status -->
        <div>
          <h4 class="font-bold text-xs uppercase tracking-wider text-heritage-gold mb-3">Legal Status</h4>
          <p class="text-xs text-parchment/80 leading-relaxed">
            <strong class="font-semibold text-parchment">Independent community project.</strong>
            Not an official City Government website.
          </p>
          <p class="mt-3 text-[11px] text-parchment/60 leading-relaxed border-l-2 border-heritage-gold/60 pl-3">
            This site is not affiliated with, endorsed by, or operated by the City Government of Santa Rosa or any government agency. All information is compiled from public sources for civic transparency.
          </p>
          <a
            href="https://santarosacity.gov.ph"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-3 inline-flex items-center min-h-11 text-[11px] underline text-heritage-gold hover:text-white rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-heritage-gold"
          >
            Official city website: santarosacity.gov.ph ↗
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
