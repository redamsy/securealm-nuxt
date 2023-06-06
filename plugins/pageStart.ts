export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook('page:start', () => {
        console.log('page:start')
     })
})