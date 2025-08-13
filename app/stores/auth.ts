import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<any>(null);

  const userRole = computed(() => {
    if (!user.value?.email) return null;

    if (user.value.email === "admin@siths.com") {
      return "admin";
    } else if (user.value.email === "staff@siths.com") {
      return "staff";
    }
    return null;
  });

  const isAdmin = computed(() => userRole.value === "admin");
  const isStaff = computed(() => userRole.value === "staff");
  const hasFullAccess = computed(() => userRole.value === "admin");
  const hasBasicAccess = computed(
    () => userRole.value === "staff" || userRole.value === "admin"
  );

  const fetchUser = async () => {
    const { $supabase } = useNuxtApp();
    const { data } = await $supabase.auth.getUser();
    user.value = data.user;
  };

  const signIn = async (email: string, password: string) => {
    const { $supabase } = useNuxtApp();
    const { data, error } = await $supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    user.value = data.user;
    console.log("User signed in:", user.value);
  };

  const signOut = async () => {
    const { $supabase } = useNuxtApp();
    await $supabase.auth.signOut();
    user.value = null;
  };

  const listenToAuthChanges = () => {
    const { $supabase } = useNuxtApp();
    $supabase.auth.onAuthStateChange((_, session) => {
      user.value = session?.user ?? null;
    });
  };

  return {
    user,
    userRole,
    isAdmin,
    isStaff,
    hasFullAccess,
    hasBasicAccess,
    fetchUser,
    signIn,
    signOut,
    listenToAuthChanges,
  };
});
