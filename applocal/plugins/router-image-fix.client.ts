export default defineNuxtPlugin(() => {
  // Prevent Vue Router from trying to navigate to image URLs
  const router = useRouter();

  router.beforeEach((to, from, next) => {
    // Check if the route path looks like an image file
    if (to.path.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i)) {
      // Don't handle as a route, let the browser handle it as a static file
      if (process.client) {
        window.location.href = to.fullPath;
      }
      return;
    }

    // Check if it's a daily-links-images path
    if (to.path.startsWith("/daily-links-images/")) {
      // Don't handle as a route, let the browser handle it as a static file
      if (process.client) {
        window.location.href = to.fullPath;
      }
      return;
    }

    next();
  });
});
