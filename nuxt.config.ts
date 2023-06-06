// https://nuxt.com/docs/api/configuration/nuxt-config
// import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  modules: [
    [
        '@pinia/nuxt',
        {
            autoImports: ['defineStore', 'acceptHMRUpdate'],
        },
    ],
    '@nuxtjs/tailwindcss',
    '@element-plus/nuxt'
  ],

  imports: {
      dirs: ['stores'],
  },

  tailwindcss: {
      cssPath: '~/assets/css/tailwind.css',
      configPath: 'tailwind.config',
      exposeConfig: false,
      injectPosition: 0,
      viewer: true,
  },

  app: {
    head: {
      title: 'securealm',
      meta: [
        {name: 'description', content: 'Everything about Nuxt 3'}
      ],
      link: [
        {rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons'}
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  runtimeConfig: {
      anySecret: process.env.ANY_SECRET,
      public: {
          laravelApiUrl: process.env.LARAVEL_API_URL,
      }
  },

  devtools: {
    enabled: true
  }
})
