<template>
    <h1>certificates</h1>
    <div class="grid grid-cols-4 gap-5">
      <div v-for="c in certificates.data">
        <CertificateCard :certificate="c"/>
      </div>
    </div>
</template>

<script setup>
  definePageMeta({
    layout: "certificate",
  })
  const { data: certificates } = await useFetch(`http://localhost/api/certificatesTest`);
  if (!certificates) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Certificates not found', 
      // fatal: true 
    })
  }
  console.log("certificates", certificates);
  
  useHead({
    title: 'securealm | Certificates'
  })
</script>