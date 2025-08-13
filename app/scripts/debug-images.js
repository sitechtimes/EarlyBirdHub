// Debug script to test URL transformation
import { transformImageUrl } from "../utils/imageTransform.ts";

const testUrls = [
  "http://192.168.1.152:8000/storage/v1/object/public/daily-links-images/daily-links/1755063539982-inh48w.png",
  "http://192.168.1.152:8000/storage/v1/object/public/daily-links-images/daily-links/1755064675361-oaf8gl.png",
];

console.log("🔍 Testing URL transformations:");
testUrls.forEach((url) => {
  const transformed = transformImageUrl(url, "http://192.168.1.152:8000", true);
  console.log(`Original:    ${url}`);
  console.log(`Transformed: ${transformed}`);
  console.log("---");
});

// Test if files exist locally
import fs from "fs";
import path from "path";

const publicDir = path.join(process.cwd(), "public");
console.log("\n📁 Checking local files:");
console.log(`Public directory: ${publicDir}`);

const imageFiles = [
  "daily-links-images/daily-links/1755063539982-inh48w.png",
  "daily-links-images/daily-links/1755064675361-oaf8gl.png",
];

imageFiles.forEach((file) => {
  const fullPath = path.join(publicDir, file);
  const exists = fs.existsSync(fullPath);
  console.log(`${exists ? "✅" : "❌"} ${file}`);
});
