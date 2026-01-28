import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Alternative approach: provide instructions for manual copying
async function provideImageCopyInstructions() {
  console.log("📋 Instructions for copying images from Supabase storage:");
  console.log("");
  console.log(
    "Due to Docker volume permissions, please manually copy the images:"
  );
  console.log("");
  console.log("1. Navigate to your Supabase storage directory:");
  console.log(
    "   C:\\Users\\bbern\\OneDrive\\Documents\\GitHub\\EarlyBirdHubBackend\\supabase\\docker\\volumes\\storage\\stub\\stub\\daily-links-images\\daily-links"
  );
  console.log("");
  console.log(
    '2. For each image directory (e.g., "1755063539982-inh48w.png/"), copy the file inside to:'
  );
  console.log(
    "   public\\daily-links-images\\daily-links\\[same-name-without-slash]"
  );
  console.log("");
  console.log("Examples:");
  console.log(
    "   Source: ...\\daily-links\\1755063539982-inh48w.png\\660abf46-b27e-4893-969d-b95031c0806a"
  );
  console.log(
    "   Target: public\\daily-links-images\\daily-links\\1755063539982-inh48w.png"
  );
  console.log("");
  console.log("Or run these PowerShell commands from your app directory:");

  // Try to detect what files need to be copied
  const sourceBase =
    "C:\\Users\\bbern\\OneDrive\\Documents\\GitHub\\EarlyBirdHubBackend\\supabase\\docker\\volumes\\storage\\stub\\stub\\daily-links-images\\daily-links";

  try {
    // Read what images we expect (from the transformation warnings)
    const expectedImages = [
      "1755063539982-inh48w.png",
      "1755064675361-oaf8gl.png",
      "1755062074872-1g2gv.png",
      "1755062838263-01tmkm.svg",
    ];

    console.log("");
    console.log("PowerShell commands to copy your images:");

    for (const imageName of expectedImages) {
      console.log(
        `Get-ChildItem "${sourceBase}\\${imageName}" | ForEach-Object { Copy-Item $_.FullName "public\\daily-links-images\\daily-links\\${imageName}" }`
      );
    }
  } catch (error) {
    console.log("   (Run the copy commands based on your actual files)");
  }

  console.log("");
  console.log("3. After copying, your images will be served correctly!");
}

// Create the directory structure
async function createDirectoryStructure() {
  const outputDir = path.join(
    __dirname,
    "..",
    "public",
    "daily-links-images",
    "daily-links"
  );
  await fs.mkdir(outputDir, { recursive: true });
  console.log(`✅ Created directory: ${outputDir}`);
}

async function main() {
  console.log("🚀 Setting up image directory...");
  await createDirectoryStructure();
  console.log("");
  await provideImageCopyInstructions();
}

main();
