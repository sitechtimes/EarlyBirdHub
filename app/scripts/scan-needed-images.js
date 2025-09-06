import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "http://192.168.1.152:8000";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";

async function scanNeededImages() {
  try {
    console.log("🔍 Scanning database for image references...");

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Add timeout promise
    const timeout = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Request timeout")), 5000);
    });

    const fetchPromise = supabase.from("daily_links").select("*");

    const { data, error } = await Promise.race([fetchPromise, timeout]);

    if (error) {
      console.error("❌ Database error:", error.message);
      return;
    }

    if (!data || data.length === 0) {
      console.log("📭 No daily links found in database");
      return;
    }

    console.log(`📊 Found ${data.length} daily links`);

    // Extract unique image filenames
    const imageFiles = new Set();

    data.forEach((link) => {
      if (link.image_url && link.image_url.includes("daily-links-images/")) {
        const filename = link.image_url.split("daily-links-images/").pop();
        if (filename) {
          imageFiles.add(filename);
        }
      }
    });

    console.log(`\n📸 Unique images referenced: ${imageFiles.size}`);
    console.log("\nImage files needed:");
    Array.from(imageFiles)
      .sort()
      .forEach((filename) => {
        console.log(`  - ${filename}`);
      });

    return Array.from(imageFiles);
  } catch (error) {
    if (error.message === "Request timeout") {
      console.log(
        "⏱️  Database connection timed out (this is expected if Supabase is not running)"
      );
    } else {
      console.error("❌ Failed to scan images:", error.message);
    }

    console.log("\n💡 Alternative: Check your data directly");
    console.log("   If Supabase is not running, you can still:");
    console.log("   1. Copy images manually to public/daily-links-images/");
    console.log("   2. URLs will transform automatically during build");
  }
}

scanNeededImages();
