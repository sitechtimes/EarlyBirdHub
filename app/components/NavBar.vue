<template>
  <nav
    class="h-screen break-words z-20 w-fit text-white bg-black absolute top-0 left-0 flex flex-col shadow-lg navbar"
    :class="{ 'navbar-slide-out': isClosing }"
    v-if="isOpen"
  >
    <ul class="list-none p-3 m-0 pt-14 flex flex-col gap-2">
      <NuxtLink
        to="/"
        @click="closeNavbar"
        class="px-2 flex items-center hover:bg-gray-700 transition p-2 rounded-lg gap-2"
      >
        <i class="fa-solid fa-house"></i>
        Home
      </NuxtLink>

      <a
        href="#"
        class="px-2 flex items-center hover:bg-gray-700 transition p-2 rounded-lg gap-2"
      >
        <i class="fa-solid fa-microphone"></i>
        Submit Name Pronunciation
      </a>

      <a
        href="https://www.youtube.com/playlist?list=PLXdwySAEBRBWocKBDaEE7HCw3rb3EvpeU"
        target="_blank"
        rel="noopener noreferrer"
        class="px-2 flex items-center hover:bg-gray-700 transition p-2 rounded-lg gap-2"
      >
        <i class="fa-solid fa-crow"></i>
        See past Early Birds</a
      >
      <a
        href="https://www.siths.org/apps/events/"
        target="_blank"
        class="px-2 flex items-center hover:bg-gray-700 transition p-2 rounded-lg gap-2"
        rel="noopener noreferrer"
      >
        <i class="fa-solid fa-calendar"></i>
        School Calendar
      </a>
    </ul>
  </nav>
  <div
    class="absolute top-4 left-0 z-20 flex items-center justify-center cursor-pointer"
    @click="toggleNavbar"
  >
    <button
      class="p-2 flex flex-col rounded transition duration-150"
      aria-label="Toggle Navbar"
    >
      <span
        class="block w-8 h-1 bg-white rounded-sm mb-2 transform transition-all duration-300 origin-center"
        :class="isOpen && !isClosing ? 'rotate-45 translate-y-1.5' : 'rotate-0'"
      ></span>
      <span
        class="block w-8 h-1 bg-white rounded-sm transform transition-all duration-300 origin-center"
        :class="
          isOpen && !isClosing ? '-rotate-45 -translate-y-1.5' : 'rotate-0'
        "
      ></span>
    </button>
  </div>
</template>

<script setup>
const isOpen = ref(false);
const isClosing = ref(false);
const route = useRoute();

const closeNavbar = () => {
  if (!isOpen.value) return;

  isClosing.value = true;

  // Wait for animation to complete before hiding
  setTimeout(() => {
    isOpen.value = false;
    isClosing.value = false;
  }, 300); // Match animation duration
};

const toggleNavbar = () => {
  if (isOpen.value) {
    closeNavbar();
  } else {
    isOpen.value = true;
    isClosing.value = false;
  }
};

watch(
  () => route.path,
  () => {
    closeNavbar();
  }
);
</script>

<style scoped>
.navbar {
  animation: navbar-slide-in 0.3s ease-in-out;
}

.navbar-slide-out {
  animation: navbar-slide-out 0.3s ease-in-out forwards;
}

@keyframes navbar-slide-in {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes navbar-slide-out {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
}
</style>
