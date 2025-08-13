export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();

  // If user is already authenticated, redirect them away from login page
  if (authStore.user) {
    // Redirect based on role
    if (authStore.isAdmin) {
      return navigateTo("/admin");
    } else if (authStore.isStaff) {
      return navigateTo("/dailymanagement");
    } else {
      return navigateTo("/");
    }
  }
});
