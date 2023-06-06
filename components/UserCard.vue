<template>
  <div class="card text-center">
    <!-- <img :src="`${user.image}`" class="thumb" /> -->
    <p class="font-bold text-gray-500 m-4 truncate">{{ user.name }}</p>
    <p class="font-bold text-gray-500 m-4 truncate">Id: {{ user.id }}</p>
    <p class="font-bold text-gray-500 m-4 truncate">Name: {{ user.name }}</p>
    <p class="font-bold text-gray-500 m-4 truncate">Email: {{ user.email }}</p>
    <p class="font-bold text-gray-500 m-4 truncate">Email verification At: {{ user.emailVerifiedAt || 'False' }}</p>
    <p class="font-bold text-gray-500 m-4 truncate">Role: {{ user.userType }}</p>
    <p class="font-bold text-gray-500 m-4 truncate">Blood Type: {{ user.bloodType.name }}</p>
    <p class="font-bold text-gray-500 m-4 truncate">Gender: {{ user.gender.name }}</p>
    <h2 class="font-bold text-gray-500 m-4 truncate">Certificates:</h2>
    <ul v-for="educationalCertificate in user.educationalCertificates" :key="educationalCertificate.id">
        <li class="font-bold text-gray-500 m-4 truncate">Name: {{ educationalCertificate.name }}</li>
    </ul>
    <!-- <NuxtLink :to="`/certificates/${certificate.id}`">
        <p class="btn my-4">View Details</p>
      </NuxtLink> -->
  </div>
</template>

<script setup lang="ts">
  import { IUserProfile } from '~/types/user';

  const props = defineProps({
    user: {
      type: Object as PropType<IUserProfile>, 
      required: true,
      validator(value: unknown): boolean {
        return true
      }
    },
  });
</script>

<style scoped>
  .thumb {
    max-height: 120px;
    max-width: 70%;
    margin: 0 auto;
  }
</style>