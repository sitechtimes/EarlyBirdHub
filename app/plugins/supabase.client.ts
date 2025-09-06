import { defineNuxtPlugin } from "#app";
import { createClient } from "@supabase/supabase-js";
import { ref } from "vue";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const supabase = createClient(
    config.public.supabaseUrl,
    config.public.supabaseAnonKey,
    {
      auth: { persistSession: true, detectSessionInUrl: false },
    }
  );

  const user = ref<any>(null);

  supabase.auth.getSession().then(({ data }) => {
    user.value = data.session?.user ?? null;
  });

  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user ?? null;
  });

  return {
    provide: {
      supabase,
      supabaseUser: user,
    },
  };
});
