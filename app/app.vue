<template>
  <div class="p-3 h-full w-full flex flex-row">
    <NuxtPage />
    <NavBar />
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
console.log(authStore.user);
</script>
