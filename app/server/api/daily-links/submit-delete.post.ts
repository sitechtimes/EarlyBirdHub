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
  const { target_document_id } = body;

  if (!target_document_id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Target document ID is required for delete requests",
    });
  }

  try {
    // First, fetch the original document to show what's being deleted
    const originalDocument = await client.fetch(
      `*[_type == "dailyLink" && _id == $targetId][0]`,
      { targetId: target_document_id }
    );

    if (!originalDocument) {
      throw createError({
        statusCode: 404,
        statusMessage: "Target document not found",
      });
    }

    // Create a new pending delete request with original document data
    const newDeleteRequest = await client.create({
      _type: "dailyLink",
      action_type: "delete",
      target_document_id,
      status: "pending",
      is_live: false,
      // Include all original document data so admin can see what's being deleted
      name: originalDocument.name,
      description: originalDocument.description,
      url: originalDocument.url,
      image: originalDocument.image,
      date_end: originalDocument.date_end,
      date_uploaded: new Date().toISOString().split("T")[0],
    });

    return newDeleteRequest;
  } catch (error) {
    console.error("Delete submission error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to submit delete request",
    });
  }
});
