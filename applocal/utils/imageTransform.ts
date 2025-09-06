/**
 * Transform relative image paths back to Supabase URLs for local development
 * Example:
 * From: /daily-links-images/daily-links/image.png
 * To: http://192.168.1.152:8000/storage/v1/object/public/daily-links-images/daily-links/image.png
 */
export function transformImageUrl(
  url: string | null | undefined,
  supabaseUrl?: string,
  forceTransform = false
): string | null {
  if (!url || typeof url !== "string") {
    return null;
  }

  // If it's already a full Supabase URL, return as-is
  if (url.startsWith("http") && url.includes("/storage/v1/object/public/")) {
    return url;
  }

  // Transform relative paths to Supabase URLs for local development
  // This ensures we always use the live Supabase instance

  // Check if it's a relative path to daily-links-images
  if (url.startsWith("/daily-links-images/")) {
    if (supabaseUrl) {
      // Convert relative path to full Supabase URL
      const cleanUrl = supabaseUrl.endsWith("/")
        ? supabaseUrl.slice(0, -1)
        : supabaseUrl;
      const cleanPath = url.startsWith("/") ? url.slice(1) : url;
      return `${cleanUrl}/storage/v1/object/public/${cleanPath}`;
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
