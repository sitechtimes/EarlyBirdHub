import type { User } from "@supabase/supabase-js";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);

  const isAdmin = computed(
    () =>
      user.value?.email === "mvanburen@schools.nyc.gov" ||
      user.value?.email === "admin@siths.com"
  );
  const isStaff = computed(
    () =>
      user.value?.email === "earlybird@siths.com" ||
      user.value?.email === "staff@siths.com"
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
    //console.log("User signed in:", user.value);
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
    isAdmin,
    isStaff,
    fetchUser,
    signIn,
    signOut,
    listenToAuthChanges,
  };
});
