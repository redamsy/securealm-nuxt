<template>
    <div>
        <p>certificate details for {{ id }}</p>
    </div>
</template>

<script setup>
  const { id } = useRoute().params
  const uri = 'https://fakestoreapi.com/products/' + id

  //  fetch the products
  const { data: product } = await useFetch(uri, { key: id })

  definePageMeta({
    layout: "certificate",
  })
</script>