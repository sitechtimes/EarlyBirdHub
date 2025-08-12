import { defineEventHandler, readBody } from "h3";
import { createClient } from "@sanity/client";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const client = createClient({
    projectId: config.sanityProjectId,
    dataset: config.sanityDataset,
    apiVersion: "2025-08-11",
    token: config.sanityWriteToken,
    useCdn: false,
  });

  const body = await readBody(event);
  const { target_document_id, ...editData } = body;

  if (!target_document_id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Target document ID is required for edit requests",
    });
  }

  try {
    // Create a new pending edit request
    // Note: Image is already uploaded and processed by frontend, just use the provided data
    const newEditRequest = await client.create({
      _type: "dailyLink",
      ...editData,
      action_type: "edit",
      target_document_id,
      status: "pending",
      is_live: false,
      date_uploaded: new Date().toISOString().split("T")[0],
    });

    return newEditRequest;
  } catch (error) {
    console.error("Edit submission error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to submit edit request",
    });
  }
});
