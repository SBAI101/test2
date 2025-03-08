import { defineNuxtConfig } from 'nuxt/config'
import { resolve } from 'path'

export default defineNuxtConfig({
  devtools: false,
  css: ['~/assets/css/tailwind.css'],
  ssr: false,

  modules: [
    '@nuxtjs/supabase',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@nuxt/ui'
  ],

  i18n: {
    locales: ['en', 'fr'],
    defaultLocale: 'fr',
    strategy: 'prefix_except_default'
  },

  supabase: {
    url: process.env.VITE_SUPABASE_URL,
    key: process.env.VITE_SUPABASE_ANON_KEY,
    redirectOptions: {
      login: '/auth/login',
      callback: '/auth/confirm'
    },
    //     cookieOptions: {
    //   secure:  'development',
    //   maxAge: 60 * 60 * 8, // 8 heures
    // }
  },

  typescript: {
    strict: true,
    typeCheck: false
  },

  nitro: {},

  runtimeConfig: {
    public: {
      baseURL: ''
    }
  },

  vite: {
    resolve: {
      alias: {
        '#tailwind-config/theme/colors': resolve(__dirname, 'tailwind-colors.ts')
      }
    }
  },

  app: {
    head: {
      title: 'Admin Platform',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Admin Platform' }
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap'
        },
        { rel: 'preload', as: 'image', href: '/astavest-logo.png' }
      ],
    }
  },

  compatibilityDate: '2025-03-08'
})