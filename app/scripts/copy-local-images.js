import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_DIR =
  "C:\\Users\\bbern\\OneDrive\\Documents\\GitHub\\EarlyBirdHubBackend\\supabase\\docker\\volumes\\storage\\stub\\stub\\daily-links-images\\daily-links";
const OUTPUT_DIR = path.join(
  __dirname,
  "..",
  "public",
  "daily-links-images",
  "daily-links"
);

async function copyImagesFromLocal() {
  try {
    console.log("📁 Copying images from local Supabase storage...");
    console.log(`📂 Source: ${SOURCE_DIR}`);
    console.log(`📁 Destination: ${OUTPUT_DIR}`);

    // Check if source directory exists
    try {
      await fs.access(SOURCE_DIR);
    } catch {
      console.log("⚠️  Local Supabase storage directory not found");
      console.log("   This is normal if Supabase is not running locally");
      console.log("   Images will be transformed to relative URLs anyway");
      return true;
    }

    // Create destination directory
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    // Copy all files recursively
    await copyDirectory(SOURCE_DIR, OUTPUT_DIR);

    console.log("✅ Successfully copied images from local storage!");
    return true;
  } catch (error) {
    console.error("❌ Failed to copy images:", error.message);
    return false;
  }
}

async function copyDirectory(source, destination) {
  const entries = await fs.readdir(source, { withFileTypes: true });
  let fileCount = 0;

  await fs.mkdir(destination, { recursive: true });

  for (const entry of entries) {
    // Skip system files and non-image directories
    if (entry.name.startsWith(".") || entry.name === "node_modules") {
      console.log(`⏭️  Skipped: ${entry.name} (system file)`);
      continue;
    }

    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      // Check if this directory contains actual image files
      const subEntries = await fs.readdir(sourcePath, { withFileTypes: true });

      // If this directory contains files (not subdirectories), copy the first file
      // and rename it to the directory name (which is the image filename)
      const actualFiles = subEntries.filter((e) => e.isFile());

      if (actualFiles.length > 0) {
        // This is a Supabase storage pattern where image "filename" is a directory
        // containing the actual file
        const actualFile = actualFiles[0];
        const actualFilePath = path.join(sourcePath, actualFile.name);

        try {
          await fs.copyFile(actualFilePath, destinationPath);
          console.log(`📄 Copied: ${entry.name} (from ${actualFile.name})`);
          fileCount++;
        } catch (error) {
          console.warn(`⚠️  Failed to copy ${entry.name}:`, error.message);
        }
      } else {
        // Skip directories that don't contain files (avoid infinite recursion)
        console.log(`⏭️  Skipped: ${entry.name} (no files found)`);
      }
    } else {
      try {
        await fs.copyFile(sourcePath, destinationPath);
        console.log(`📄 Copied: ${entry.name}`);
        fileCount++;
      } catch (error) {
        console.warn(`⚠️  Failed to copy ${entry.name}:`, error.message);
      }
    }
  }

  return fileCount;
}

async function main() {
  console.log("🚀 Starting image preparation...");

  const success = await copyImagesFromLocal();

  if (success) {
    console.log("\n🎉 Image preparation completed!");
    console.log("\nℹ️  Your app is now ready to work offline!");
    console.log("   - Images are bundled in public/daily-links-images/");
    console.log("   - URLs will automatically transform to relative paths");
    console.log("   - No Supabase connection required for static site");
  } else {
    console.log("\n⚠️  Image preparation completed with warnings");
    console.log("   The app will still work, but images may not display");
    console.log("   if they're not available at build time");
  }
}

main();
