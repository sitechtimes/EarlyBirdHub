<template>
  <div class="w-full h-full flex flex-col items-center justify-center">
    <h1 class="text-xl font-bold text-error">
      This route is only accessable from the school network
    </h1>
    <NuxtLink
      to="/"
      class="button md:py-2 md:px-4 md:rounded-md flex flex-1 items-center justify-between flex-col text-center font-semibold md:text-xl text-xs border-2 border-gold text-white py-1 px-2 rounded transition-all duration-500 relative"
    >
      <p>Back to main page</p>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: "Staff Dashboard",
});
</script>
