import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function prebuild() {
  console.log("🔧 Running prebuild tasks...");

  try {
    // Copy images from local Supabase storage
    console.log("� Copying images from local storage...");
    execSync("node scripts/copy-local-images.js", {
      stdio: "inherit",
      cwd: path.join(__dirname, ".."),
    });

    console.log("✅ Prebuild tasks completed successfully!");
  } catch (error) {
    console.error("❌ Prebuild failed:", error.message);
    // Don't exit with error - allow build to continue even if image copy fails
    console.log("⚠️  Continuing build without copied images...");
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  prebuild();
}
