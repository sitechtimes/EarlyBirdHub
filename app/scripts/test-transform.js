import {
  transformImageUrl,
  transformDailyLinkImages,
} from "../utils/imageTransform.ts";

// Test data with various Supabase URL formats
const testUrls = [
  "http://192.168.1.152:8000/storage/v1/object/public/daily-links-images/b82b34d6-d30d-4d4d-8605-9e700a3c2b48",
  "http://192.168.1.152:8000/storage/v1/object/public/daily-links-images/daily-links/eb6457e9-d4ea-4b22-8903-35b74e6dc600",
  "/daily-links-images/already-relative.png",
  "https://example.com/external-image.jpg",
];

const testLink = {
  id: 1,
  title: "Test Link",
  img: "http://192.168.1.152:8000/storage/v1/object/public/daily-links-images/b82b34d6-d30d-4d4d-8605-9e700a3c2b48",
  image:
    "http://192.168.1.152:8000/storage/v1/object/public/daily-links-images/daily-links/another-image.png",
  description: "Test description",
};

console.log("🧪 Testing Image URL Transformation\n");

// Test individual URL transformation
console.log("📍 Individual URL Transformations:");
testUrls.forEach((url) => {
  const transformed = transformImageUrl(url);
  console.log(`  Input:  ${url}`);
  console.log(`  Output: ${transformed}\n`);
});

// Test link object transformation
console.log("📦 Link Object Transformation:");
console.log("  Original:", JSON.stringify(testLink, null, 2));

const transformedLink = transformDailyLinkImages(
  testLink,
  "http://192.168.1.152:8000"
);
console.log("  Transformed:", JSON.stringify(transformedLink, null, 2));

console.log("\n✅ Transformation test completed!");
