<template>
    <div>
      <h1>Users</h1>
      <ul v-for="user in users.data" :key="user.id">
        <li>Id: {{ user.id }}</li>
        <li>Name: {{ user.name }}</li>
        <li>Email: {{ user.email }}</li>
        <li>Blood Type: {{ user.bloodType }}</li>
        <li>Gender: {{ user.gender }}</li>
      </ul>
    </div>
  </template>
  <script setup>
  // const { data: users } = await useAsyncData('users', () =>
  //   $fetch(`http://localhost/api/users`)
  // );
  const { data: users } = await useFetch(`http://localhost/api/users`);
  console.log("users", users);
  // const { data } = await useFetch('/api/getConfig', {
  //   method: 'post',
  //   body: {
  //     age: 10
  //   }
  // })
  // const { data } = await useFetch('/api/getConfig?name=bla')
  // const { data } = await useFetch('/api/getDynamicInfo/someCode')
  </script>