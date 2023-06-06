export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook('app:created', async() => {
        // runs on server and client 
        console.log('appCreated: app:created');
     })
})
