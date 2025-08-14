import { defineStore } from "pinia";

export const useNavbarStore = defineStore("navbar", () => {
  const isOpen = ref(false);

  function toggleNavbar() {
    isOpen.value = !isOpen.value;
  }
  function openNavbar() {
    isOpen.value = true;
  }
  function closeNavbar() {
    isOpen.value = false;
  }

  return {
    isOpen,
    toggleNavbar,
    openNavbar,
    closeNavbar,
  };
});
