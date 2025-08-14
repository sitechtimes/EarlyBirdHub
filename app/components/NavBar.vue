<template>
  <nav
    class="h-screen break-words w-fit text-white bg-black absolute top-0 left-0 flex flex-col shadow-lg navbar"
    :class="{ 'navbar-slide-out': isClosing }"
    v-if="isOpen"
  >
    <ul class="list-none p-3 m-0 pt-14 flex flex-col gap-2">
      <li class="flex items-center hover:bg-gray-700 transition p-2 rounded-lg">
        <i class="fa-solid fa-house"></i>
        <NuxtLink to="/" class="px-2">Home</NuxtLink>
      </li>
      <li class="flex items-center hover:bg-gray-700 transition p-2 rounded-lg">
        <i class="fa-solid fa-microphone"></i>
        <a href="#" class="block px-2 rounded">Submit Name Pronunciation</a>
      </li>
      <li class="flex items-center hover:bg-gray-700 transition p-2 rounded-lg">
        <i class="fa-solid fa-crow"></i>
        <a
          href="https://www.youtube.com/playlist?list=PLXdwySAEBRBWocKBDaEE7HCw3rb3EvpeU"
          target="_blank"
          rel="noopener noreferrer"
          class="block px-2 rounded"
          >See past Early Birds</a
        >
      </li>
      <li class="flex items-center hover:bg-gray-700 transition p-2 rounded-lg">
        <i class="fa-solid fa-calendar"></i>
        <a
          href="https://www.siths.org/apps/events/"
          target="_blank"
          class="block px-2 rounded"
          rel="noopener noreferrer"
          >School Calendar</a
        >
      </li>
    </ul>
  </nav>
  <div
    class="absolute top-4 left-0 z-50 flex items-center justify-center cursor-pointer"
    @click="isOpen = !isOpen"
  >
    <button
      class="p-2 flex flex-col rounded transition duration-150"
      aria-label="Toggle Navbar"
    >
      <span
        class="block w-8 h-1 bg-white rounded-sm mb-2 transform transition-all duration-300 origin-center"
        :class="isOpen ? 'rotate-45 translate-y-1.5' : 'rotate-0'"
      ></span>
      <span
        class="block w-8 h-1 bg-white rounded-sm transform transition-all duration-300 origin-center"
        :class="isOpen ? '-rotate-45 -translate-y-1.5' : 'rotate-0'"
      ></span>
    </button>
  </div>
</template>

<script setup>
const isOpen = ref(false);
</script>
