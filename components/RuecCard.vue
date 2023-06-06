<template>
  <div class="card text-center">
    <p class="font-bold text-gray-500 m-4 truncate">{{ ruec.name }}</p>
    <div v-if="ruec.regularUsers.length">
      <ul v-for="regularUser in ruec.regularUsers" :key="regularUser.id">
        <li class="font-bold text-gray-500 m-4 truncate">User Id: {{ regularUser.id }}</li>
      </ul>
    </div>
  </div>
</template>
  
<script setup lang="ts">
  import { IEducationalCertificateIncludeUsers } from '~/types/educationalCertificate';

  const props = defineProps({
    ruec: {
      type: Object as PropType<IEducationalCertificateIncludeUsers>, 
      required: true,
      validator(value: unknown): boolean {
        return true
      }
    },
  });
  // P.S.for arrays
  // const props = defineProps({
  //   ruecs: {
  //     type: Array as PropType<IEducationalCertificateIncludeUsers[]>, 
  //     required: true,
  //     validator(value: unknown): boolean {
  //       return true
  //     }
  //   },
  // });
  console.log('RuecCard: ruec', props.ruec)
</script>
<!-- id: string;
  userId: string;
  ruecs: any[]; -->
<style scoped>
  .thumb {
    max-height: 120px;
    max-width: 70%;
    margin: 0 auto;
  }
</style>