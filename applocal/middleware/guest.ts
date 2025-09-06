export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();

  // If user is already authenticated, redirect them away from login page
  if (authStore.user && !authStore.isAdmin && !authStore.isStaff) {
    return navigateTo("/");
  }
});
