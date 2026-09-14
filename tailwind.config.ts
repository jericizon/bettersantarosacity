import type { Config } from 'tailwindcss'

export default <Config>{
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './app.vue'
  ],
  theme: {
    extend: {
      colors: {
        'laguna-green': '#164A3D',
        'rose-accent': '#C96A73',
        'laguna-blue': '#5E9FA5',
        'heritage-gold': '#D6A94B',
        'parchment': '#F6F3EA',
        'charcoal': '#182421'
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'sans-serif'],
        serif: ['Source Serif 4', 'Georgia', 'serif']
      }
    }
  },
  plugins: []
}
