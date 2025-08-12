import { defineEventHandler, readBody, createError } from "h3";
import { createClient } from "@sanity/client";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const config = useRuntimeConfig();

    const client = createClient({
      projectId: config.sanityProjectId,
      dataset: config.sanityDataset,
      apiVersion: "2025-08-11",
      useCdn: false,
      token: config.sanityWriteToken,
    });

    if (!body.name || !body.url || !body.image) {
      throw createError({
        statusCode: 400,
        statusMessage: "name, url, and image required",
      });
    }

    const doc = {
      _type: "dailyLink",
      name: body.name,
      description: body.description,
      url: body.url,
      image: body.image,
      date_end: body.date_end,
      date_uploaded: body.date_uploaded,
      status: body.status || "pending",
      action_type: body.action_type || "create", // Add action_type
      is_live: body.is_live || false, // Add is_live
    };

    const created = await client.create(doc);
    return { success: true, result: created };
  } catch (error) {
    console.error("🔥 API error in POST /api/daily-links:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
