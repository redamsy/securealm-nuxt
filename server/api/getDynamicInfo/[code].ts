export default defineEventHandler(async (event) => {

  // const { code } = event.context.params
  const { anySecret } = useRuntimeConfig()

//   const uri = `https://api.currencyapi.com/v3/latest?currencies=${code}&apikey=${anySecret}`
  
//   const { data } = await $fetch(uri)

//   return data
})