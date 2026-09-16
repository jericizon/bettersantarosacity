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
  nitro: {
    preset: 'cloudflare-pages-static'
  },
  app: {
    head: {
      title: 'Better Santa Rosa City · Civic Information Layer',
      meta: [
        { name: 'description', content: 'Independent, community-maintained public information portal for Santa Rosa, Laguna.' },
        { name: 'theme-color', content: '#164A3D' }
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', href: '/icon.png', type: 'image/png' },
        { rel: 'apple-touch-icon', href: '/icon.png' }
      ]
    }
  }
})
