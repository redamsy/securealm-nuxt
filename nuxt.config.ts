// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: ['@nuxtjs/tailwindcss'],
    app: {
        head: {
          title: 'securealm',
          meta: [
            {name: 'description', content: 'Everything about Nuxt 3'}
          ],
          link: [
            {rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons'}
          ]
        }
      },
    runtimeConfig: {
        anySecret: process.env.ANY_SECRET,
        public: {
            laravelApiUrl: process.env.LARAVEL_API_URL,
        }
    }
})
