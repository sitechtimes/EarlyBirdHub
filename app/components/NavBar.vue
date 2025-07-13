<template>
  <nav
    class="h-screen w-fit text-white bg-black absolute top-0 left-0 flex flex-col shadow-lg navbar"
    :class="{ 'navbar-slide-out': isClosing }"
    v-if="isOpen"
  >
    <ul class="list-none p-0 m-0 pt-14">
      <li class="mb-6">
        <a href="#" class="block px-4 py-2 rounded hover:bg-gray-700 transition"
          >Home</a
        >
      </li>
    </ul>
  </nav>
  <div
    class="absolute top-4 left-0 z-50 flex items-center justify-center cursor-pointer"
    @click="toggleNavbar"
  >
    <button
      class="p-2 rounded transition duration-150"
      :class="{ spin: isOpening, spinOut: isClosing }"
      aria-label="Open Navbar"
    >
      <span class="block w-7 h-1 bg-white mb-1"></span>
      <span class="block w-7 h-1 bg-white mb-1"></span>
      <span class="block w-7 h-1 bg-white"></span>
    </button>
    <p class="text-white font-bold" v-if="windowWidth > 600">Menu</p>
  </div>
</template>

<script setup>
const navbarStore = useNavbarStore();
const { windowWidth } = useWindowSize();

const isOpening = ref(false);
const isClosing = ref(false);
const isOpen = computed(() => navbarStore.isOpen);

function toggleNavbar() {
  if (isOpen.value) {
    isClosing.value = true;

    setTimeout(() => {
      navbarStore.toggleNavbar();
      isClosing.value = false;
    }, 300);
  } else {
    isOpening.value = true;
    navbarStore.toggleNavbar();
    setTimeout(() => {
      isOpening.value = false;
    }, 300);
  }
}
</script>
