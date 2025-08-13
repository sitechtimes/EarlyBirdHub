import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.NUXT_PUBLIC_SUPABASE_URL || "http://192.168.1.152:8000";
const SUPABASE_ANON_KEY =
  process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";

console.log("🧪 Testing Supabase connection...");
console.log(`📡 URL: ${SUPABASE_URL}`);

async function testConnection() {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    console.log("📋 Fetching daily links...");
    const { data, error } = await Promise.race([
      supabase.from("daily_links").select("id, img").limit(5),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 10000)
      ),
    ]);

    if (error) {
      console.error("❌ Supabase error:", error);
      return;
    }

    console.log("✅ Connection successful!");
    console.log(`📄 Found ${data.length} links`);

    const linksWithImages = data.filter((link) => link.img);
    console.log(`🖼️  Links with images: ${linksWithImages.length}`);

    if (linksWithImages.length > 0) {
      console.log("📋 Sample image URLs:");
      linksWithImages.slice(0, 3).forEach((link, i) => {
        console.log(`   ${i + 1}. ${link.img}`);
      });
    }
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
  }
}

testConnection();
