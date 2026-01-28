export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();

  // Check if user is authenticated
  if (!authStore.user) {
    return navigateTo("/login");
  }
});
