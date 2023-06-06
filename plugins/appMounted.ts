export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook('app:mounted', () => {
        // runs on client 
        console.log('app:mounted');
     })
})