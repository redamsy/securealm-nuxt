export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook('app:rendered', () => {
        // runs on server (cmd)
        console.log('app:rendered')
     })
})