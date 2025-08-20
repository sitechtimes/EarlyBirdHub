import { createClient } from "@supabase/supabase-js";
import {
  transformDailyLinksArray,
  shouldTransformUrls,
} from "~/utils/imageTransform";

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

  // Transform image URLs to relative paths only for static builds
  const forceTransform = shouldTransformUrls();
  return transformDailyLinksArray(data || [], supabaseUrl, forceTransform);
});
