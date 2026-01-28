import { createClient } from "@supabase/supabase-js";
import { transformDailyLinksArray } from "~/utils/imageTransform";

const config = useRuntimeConfig();
const supabaseUrl = config.public.supabaseUrl;
const supabaseKey = config.public.supabaseAnonKey;
const supabase = createClient(supabaseUrl, supabaseKey);

export default defineEventHandler(async (event) => {
  const { data, error } = await supabase
    .from("daily_links")
    .select("*")
    .eq("approved", true);

  if (error) {
    console.error("Supabase fetch error:", error);
    return [];
  }

  // Keep full Supabase URLs for cloud storage
  const forceTransform = false;
  return transformDailyLinksArray(data || [], supabaseUrl, forceTransform);
});
