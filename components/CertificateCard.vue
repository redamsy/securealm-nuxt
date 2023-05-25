<template>
    <div class="card text-center">
      <!-- <img :src="`${certificate.image}`" class="thumb" /> -->
      <p class="font-bold text-gray-500 m-4 truncate">{{ certificate.name }}</p>
      <NuxtLink :to="`/certificates/${certificate.id}`">
        <p class="btn my-4">View Details</p>
      </NuxtLink>
    </div>
  </template>
  
  <script setup>
    const { certificate } = defineProps(['certificate'])
  </script>
  
  <style scoped>
    .thumb {
      max-height: 120px;
      max-width: 70%;
      margin: 0 auto;
    }
  </style>