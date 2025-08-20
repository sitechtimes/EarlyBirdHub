export const useWindowSize = () => {
  const windowWidth = ref(0);
  const windowHeight = ref(0);

  const updateWindowSize = () => {
    if (process.client) {
      windowWidth.value = window.innerWidth;
      windowHeight.value = window.innerHeight;
    }
  };

  onMounted(() => {
    updateWindowSize();
    window.addEventListener("resize", updateWindowSize);
  });

  onUnmounted(() => {
    if (process.client) {
      window.removeEventListener("resize", updateWindowSize);
    }
  });

  const isMobile = computed(() => windowWidth.value < 768);
  const isTablet = computed(
    () => windowWidth.value >= 768 && windowWidth.value < 1024
  );
  const isDesktop = computed(() => windowWidth.value >= 1024);

  return {
    windowWidth: readonly(windowWidth),
    windowHeight: readonly(windowHeight),
    isMobile: readonly(isMobile),
    isTablet: readonly(isTablet),
    isDesktop: readonly(isDesktop),
  };
};
