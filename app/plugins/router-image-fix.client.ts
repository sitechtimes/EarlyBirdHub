export default defineNuxtPlugin(() => {
  // Prevent Vue Router from trying to navigate to image URLs
  const router = useRouter();

  router.beforeEach((to, from, next) => {
    // Only handle daily-links-images paths, not all SVG files
    if (to.path.startsWith("/daily-links-images/")) {
      // Don't handle as a route, let the browser handle it as a static file
      if (process.client) {
        window.location.href = to.path;
      }
      return false; // Prevent navigation
    }

    next();
  });
});
