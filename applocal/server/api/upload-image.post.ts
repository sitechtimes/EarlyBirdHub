import { defineEventHandler, readMultipartFormData, createError } from "h3";
import { createClient } from "@sanity/client";

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event);

    if (!formData || !formData.length) {
      throw createError({
        statusCode: 400,
        statusMessage: "No file uploaded",
      });
    }

    const fileData = formData.find((item) => item.name === "file");

    if (!fileData || !fileData.data) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid file data",
      });
    }

    // Check if it's an image
    if (!fileData.type?.startsWith("image/")) {
      throw createError({
        statusCode: 400,
        statusMessage: "File must be an image",
      });
    }

    const config = useRuntimeConfig();

    const client = createClient({
      projectId: config.sanityProjectId,
      dataset: config.sanityDataset,
      apiVersion: "2025-08-11",
      useCdn: false,
      token: config.sanityWriteToken,
    });

    // Upload to Sanity
    const asset = await client.assets.upload("image", fileData.data, {
      filename: fileData.filename || "uploaded-image",
      contentType: fileData.type,
    });

    return {
      _id: asset._id,
      url: asset.url,
    };
  } catch (error) {
    console.error("🔥 API error in POST /api/upload-image:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to upload image",
    });
  }
});
