import { defineEventHandler } from "h3";
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

  const { id } = getRouterParams(event);
  const actionId = id;

  try {
    // Simply mark the action as rejected
    await client.patch(actionId).set({ status: "rejected" }).commit();

    return {
      success: true,
      message: "Action rejected successfully",
    };
  } catch (error) {
    console.error("Rejection error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to reject action",
    });
  }
});
