/**
 * Transform Supabase image URLs to relative paths for static builds
 * Example:
 * From: http://your-supabase-url/storage/v1/object/public/daily-links-images/daily-links/image.png
 * To: /daily-links-images/daily-links/image.png
 */
export function transformImageUrl(
  url: string | null | undefined,
  supabaseUrl?: string,
  forceTransform = false
): string | null {
  if (!url || typeof url !== "string") {
    return null;
  }

  // If it's already a relative path, return as-is
  if (url.startsWith("/")) {
    return url;
  }

  // Always transform Supabase URLs to use public routes
  // This ensures consistent behavior in all environments

  // Check if it's a Supabase storage URL
  if (url.includes("/storage/v1/object/public/")) {
    // If supabaseUrl is provided, also check if the URL starts with it
    if (supabaseUrl && !url.startsWith(supabaseUrl)) {
      return url; // Not from our Supabase instance
    }

    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split("/");

      // Find the bucket name (daily-links-images) in the path
      const bucketIndex = pathParts.findIndex(
        (part) => part === "daily-links-images"
      );

      if (bucketIndex !== -1) {
        // Extract everything from bucket name onwards
        const relativePath = pathParts.slice(bucketIndex).join("/");
        // Ensure no trailing slash for image files
        const cleanPath = relativePath.endsWith("/")
          ? relativePath.slice(0, -1)
          : relativePath;
        return `/${cleanPath}`;
      }
    } catch (error) {
      console.warn("Failed to parse image URL:", url, error);
    }
  }

  // If we can't transform it, return the original URL
  return url;
}

/**
 * Transform all image URLs in a daily link object
 */
export function transformDailyLinkImages(
  link: any,
  supabaseUrl?: string,
  forceTransform = true
): any {
  if (!link) return link;

  const transformedLink = { ...link };

  // Transform all possible image field names
  const imageFields = ["img", "image", "imageUrl", "image_url", "thumbnail"];

  imageFields.forEach((field) => {
    if (transformedLink[field]) {
      transformedLink[field] = transformImageUrl(
        transformedLink[field],
        supabaseUrl,
        forceTransform
      );
    }
  });

  // Also ensure img field is populated from other image fields if needed
  if (!transformedLink.img) {
    transformedLink.img =
      transformedLink.image ||
      transformedLink.imageUrl ||
      transformedLink.image_url;
  }

  return transformedLink;
}

/**
 * Transform all image URLs in an array of daily links
 */
export function transformDailyLinksArray(
  links: any[],
  supabaseUrl?: string,
  forceTransform = true
): any[] {
  if (!Array.isArray(links)) return [];

  return links.map((link) =>
    transformDailyLinkImages(link, supabaseUrl, forceTransform)
  );
}

/**
 * Determine if we should transform URLs based on environment
 */
export function shouldTransformUrls(): boolean {
  // Always transform URLs to use public routes for consistency
  return true;
}
