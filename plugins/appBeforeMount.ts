export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook('app:beforeMount', () => {
        // runs on client 
        console.log('app:beforeMount');
     })
})