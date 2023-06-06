<script setup lang="ts">
  import { storeToRefs } from 'pinia'; 
  import { IEducationalCertificateIncludeUsers } from '~/types/educationalCertificate';
  import { IUSER_TYPE } from '~/types/user';

  // https://dev.to/rafaelmagalhaes/authentication-in-nuxt-3-375o
  const { checkStatus, user } = storeToRefs(useAuthStore()); 
  definePageMeta({
      middleware: ['is-admin'],
      layout: false,
  });

  useHead({
      title: `securealm | Users List`,
  });

  const ruecsList = ref<IEducationalCertificateIncludeUsers[]>([]);

  async function getRuecs() {
      console.log("ruecs.vue: user.value", user.value);
    if(user.value?.userType === IUSER_TYPE.ADMIN) {
      const data  = await getRuecsList(checkStatus.value);
      console.log("ruecs.vue: data", data);
      ruecsList.value = data;
    }
  }

  getRuecs();
</script>
<template>
  <div>
    <NuxtLink class="text-indigo-600" to="/profile">
        Profile Page
    </NuxtLink>
    <NuxtLink v-if="user?.userType===IUSER_TYPE.ADMIN" class="text-indigo-600" to="/usersTable">
        Users Page
    </NuxtLink>
    <h1>certificates</h1>
    <div v-if="ruecsList" class="grid grid-cols-4 gap-5">
      <div v-for="ruec in ruecsList"  :key="ruec.id">
        <RuecCard :ruec="ruec"/>
      </div>
    </div>
  </div>
</template>