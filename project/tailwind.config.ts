import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  theme: {
    extend: {
      colors: {
        green: colors.green,
        gray: colors.gray,
        cool: colors.gray, // Map cool to gray as suggested
        red: colors.red,
        yellow: colors.yellow,
        blue: {
          50: '#E6F1FC',
          100: '#CCE3F9',
          200: '#99C7F3',
          300: '#66ABED',
          400: '#338FE7',
          500: '#0056B3',
          600: '#004C9E',
          700: '#003D7F',
          800: '#002E5F',
          900: '#001F40'
        },
        orange: {
          500: '#F5A333'
        },
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)'
      },
      fontFamily: {
        sans: ['Open Sans', 'system-ui', 'sans-serif'],
      }
    },
  }
} satisfies Config