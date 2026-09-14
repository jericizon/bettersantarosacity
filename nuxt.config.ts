export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  future: {
    compatibilityVersion: 4
  },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },
  typescript: {
    strict: true
  },
  app: {
    head: {
      title: 'Better Santa Rosa City — Civic Information Layer',
      meta: [
        { name: 'description', content: 'Independent, community-maintained public information portal for Santa Rosa, Laguna.' }
      ]
    }
  }
})
