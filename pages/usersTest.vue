<script setup lang="ts">

  definePageMeta({
      middleware: ['is-admin'],
      layout: false,
  });

  useHead({
      title: `securealm | Users List`,
  });

  const editedUser = ref({
    id: null,
    isApproved: null,
  });

  

  // async function editUser(editedUser: any) {
  //   if(user.value?.userType === IUSER_TYPE.ADMIN) {
      // if(editedUser.value && editedUser.value?.id && editedUser.value?.name) {
      //   const { data } = await updateUser(editedUser.value);
      //   console.log("user.vue: data", data);
      //   // for future better to search the usersList ref and update single user
      //   if(data) getUsers();
      // } else alert("edited User is:", editedUser.value)
  //   }
  // }

  // const { data: users } = await useAsyncData('users', () =>
  //   $fetch(`http://localhost/api/users`)
  // );

  // const { data } = await useFetch('/api/getConfig', {
  //   method: 'post',
  //   body: {
  //     age: 10
  //   }
  // })
  // const { data } = await useFetch('/api/getConfig?name=bla')
  // const { data } = await useFetch('/api/getDynamicInfo/someCode')
</script>
<template>
  <div>
    <h1>Users</h1>
    <!-- <div v-if="usersList" class="grid grid-cols-4 gap-5">
      <div v-for="user in usersList" :key="user.id">
        <UserCard :user="user"/>
      </div>
    </div> -->
  </div>
</template>