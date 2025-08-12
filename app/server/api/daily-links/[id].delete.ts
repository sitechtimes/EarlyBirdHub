import { defineEventHandler, createError } from "h3";
import { createClient } from "@sanity/client";

export default defineEventHandler(async (event) => {
  const { id } = event.context.params || {};
  if (!id) throw createError({ statusCode: 400, statusMessage: "missing id" });

  const config = useRuntimeConfig();

  const client = createClient({
    projectId: config.sanityProjectId,
    dataset: config.sanityDataset,
    apiVersion: "2025-08-11",
    useCdn: false,
    token: config.sanityWriteToken,
  });

  try {
    const deleted = await client.delete(id);
    return { success: true, result: deleted };
  } catch (error) {
    console.error("🔥 API error in DELETE /api/daily-links/[id]:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to delete daily link",
    });
  }
});
