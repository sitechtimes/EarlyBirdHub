export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();

  if (!authStore.hasFullAccess) {
    throw createError({
      statusCode: 403,
      statusMessage: "Access denied. Admin privileges required.",
    });
  }
});
