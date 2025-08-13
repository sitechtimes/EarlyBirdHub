import { defineEventHandler, getRouterParam, setHeader, createError } from "h3";

export default defineEventHandler(async (event) => {
  // Handle Chrome DevTools well-known requests
  const url = getRouterParam(event, "path");

  if (url === "com.chrome.devtools.json") {
    setHeader(event, "Content-Type", "application/json");
    return {
      name: "EarlyBirdHub",
      version: "1.0.0",
      description: "Staten Island Tech Morning Broadcast Hub",
      devtools_page: "devtools.html",
    };
  }

  // Return 404 for other requests
  throw createError({
    statusCode: 404,
    statusMessage: "Not Found",
  });
});
