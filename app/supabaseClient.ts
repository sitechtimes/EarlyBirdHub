import { createClient } from "@supabase/supabase-js";
import { useRuntimeConfig } from "#app";
const config = useRuntimeConfig();

const supabaseUrl = config.public.supabaseUrl;
const supabaseAnonKey = config.public.supabaseAnonKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
