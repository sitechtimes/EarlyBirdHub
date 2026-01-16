import { createClient } from "@supabase/supabase-js";
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import { fileURLToPath } from "url";
import https from "https";
import http from "http";
import { config } from "dotenv";

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from parent directory
const envPath = path.join(__dirname, "..", ".env");
config({ path: envPath });

// Configuration - get from environment
const SUPABASE_URL = process.env.NUXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY;
const BUCKET_NAME = "daily-links-images";
const OUTPUT_DIR = path.join(__dirname, "..", "public", "daily-links-images");

// Validate required environment variables
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("❌ Missing required environment variables:");
  console.error("   NUXT_PUBLIC_SUPABASE_URL:", SUPABASE_URL ? "✅" : "❌");
  console.error(
    "   NUXT_PUBLIC_SUPABASE_ANON_KEY:",
    SUPABASE_ANON_KEY ? "✅" : "❌"
  );
  process.exit(1);
}

console.log("🖼️  Starting image download script...");
console.log(`📡 Supabase URL: ${SUPABASE_URL}`);
console.log(`📁 Output directory: ${OUTPUT_DIR}`);

// Simple download function
function downloadFile(url, destination) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https:") ? https : http;

    const file = fsSync.createWriteStream(destination);

    const request = protocol.get(url, (response) => {
      if (response.statusCode !== 200) {
        file.close();
        try {
          fsSync.unlinkSync(destination);
        } catch {}
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }

      response.pipe(file);

      file.on("finish", () => {
        file.close();
        resolve();
      });
    });

    request.setTimeout(30000); // 30 second timeout

    request.on("error", (err) => {
      file.close();
      try {
        fsSync.unlinkSync(destination);
      } catch {}
      reject(err);
    });

    request.on("timeout", () => {
      request.destroy();
      file.close();
      try {
        fsSync.unlinkSync(destination);
      } catch {}
      reject(new Error("Download timeout"));
    });

    file.on("error", (err) => {
      file.close();
      try {
        fsSync.unlinkSync(destination);
      } catch {}
      reject(err);
    });
  });
}

async function downloadImages() {
  try {
    console.log("� Fetching daily links to identify required images...");

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // First, get all daily links to know which images we need
    const { data: links, error: linksError } = await supabase
      .from("daily_links")
      .select("*")
      .not("img", "is", null);

    if (linksError) {
      console.error("❌ Failed to fetch links:", linksError);
      return false;
    }

    console.log(`✅ Found ${links.length} links with images`);

    if (links.length === 0) {
      console.log("ℹ️  No images to download");
      return true;
    }

    // Extract unique image URLs
    const imageUrls = [
      ...new Set(
        links
          .map((link) => link.img)
          .filter((img) => img && img.includes("/storage/v1/object/public/"))
      ),
    ];

    console.log(`📥 Need to download ${imageUrls.length} unique images`);

    // Create output directory
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    let downloadCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const imageUrl of imageUrls) {
      try {
        // Extract the file path from the URL
        const urlParts = new URL(imageUrl);
        const pathParts = urlParts.pathname.split("/");
        const bucketIndex = pathParts.indexOf(BUCKET_NAME);

        if (bucketIndex === -1) {
          console.warn(`⚠️  Could not parse bucket path for: ${imageUrl}`);
          errorCount++;
          continue;
        }

        // Get the relative path within the bucket
        const relativePath = pathParts.slice(bucketIndex + 1).join("/");
        const filename = path.basename(relativePath);
        const subdir = path.dirname(relativePath);

        // Create subdirectory if needed
        const targetDir = path.join(OUTPUT_DIR, subdir);
        await fs.mkdir(targetDir, { recursive: true });

        // Target file path
        const targetPath = path.join(targetDir, filename);

        // Check if file already exists
        try {
          await fs.access(targetPath);
          console.log(`⏭️  Skipping existing: ${relativePath}`);
          skipCount++;
          continue;
        } catch {
          // File doesn't exist, download it
        }

        console.log(`⬇️  Downloading: ${relativePath}`);
        await downloadFile(imageUrl, targetPath);
        downloadCount++;
        console.log(`✅ Downloaded: ${relativePath}`);
      } catch (error) {
        console.error(`❌ Failed to download ${imageUrl}:`, error.message);
        errorCount++;
      }
    }

    console.log(`\n📊 Download Summary:`);
    console.log(`   📥 Downloaded: ${downloadCount} new images`);
    console.log(`   ⏭️  Skipped: ${skipCount} existing images`);
    console.log(`   ❌ Errors: ${errorCount} failed downloads`);
    console.log(`   📁 Images saved to: ${OUTPUT_DIR}`);

    return errorCount === 0;
  } catch (error) {
    console.error("❌ Image download process failed:", error);
    return false;
  }
}

async function main() {
  try {
    const success = await downloadImages();

    if (success) {
      console.log("\n🎉 Image download completed successfully!");
      process.exit(0);
    } else {
      console.log("\n⚠️  Image download completed with errors");
      process.exit(0); // Don't fail the build process
    }
  } catch (error) {
    console.error("❌ Download process failed:", error);
    process.exit(0); // Don't fail the build process
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
