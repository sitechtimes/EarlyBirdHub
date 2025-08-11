<template>
  <nav
    class="h-screen break-words w-36 text-white bg-black absolute top-0 left-0 flex flex-col shadow-lg navbar"
    :class="{ 'navbar-slide-out': isClosing }"
    v-if="isOpen"
  >
    <ul class="list-none p-0 m-0 pt-14">
      <li>
        <NuxtLink
          to="/"
          class="block px-4 py-2 rounded hover:bg-gray-700 transition"
          >Home</NuxtLink
        >
      </li>
      <li class="border-t-2 border-gray-700">
        <a href="#" class="block px-4 py-2 rounded hover:bg-gray-700 transition"
          >Submit Name Pronunciation</a
        >
      </li>
      <li class="border-t-2 border-gray-700">
        <a
          href="https://www.youtube.com/playlist?list=PLXdwySAEBRBWocKBDaEE7HCw3rb3EvpeU"
          target="_blank"
          rel="noopener noreferrer"
          class="block px-4 py-2 rounded hover:bg-gray-700 transition"
          >See past Early Birds</a
        >
      </li>
      <li class="border-t-2 border-gray-700">
        <a
          href="_blank"
          class="block px-4 py-2 rounded hover:bg-gray-700 transition"
          rel="noopener noreferrer"
          >School Calander</a
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
        :class="isOpen ? 'rotate-45 translate-y-1.5' : 'rotate-0 '"
      ></span>
      <span
        class="block w-8 h-1 bg-white rounded-sm transform transition-all duration-300 origin-center"
        :class="isOpen ? '-rotate-45 -translate-y-1.5' : 'rotate-0'"
      ></span>
    </button>
    <p class="text-white font-bold" v-if="windowWidth > 600">Menu</p>
  </div>
</template>

<script setup>
const isOpen = ref(false);
const { windowWidth } = useWindowSize();
</script>
