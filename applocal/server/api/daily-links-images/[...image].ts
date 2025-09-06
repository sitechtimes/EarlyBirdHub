// Catch-all route for image files to prevent router warnings
export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, "image");

  // If it's an image file request, serve it as a static file
  if (path && path.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i)) {
    // Let Nitro handle static file serving
    return sendRedirect(event, `/daily-links-images/${path}`, 301);
  }

  // If not an image, return 404
  throw createError({
    statusCode: 404,
    statusMessage: "Image not found",
  });
});
