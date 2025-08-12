import { defineEventHandler, getRouterParam } from "h3";
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

  const actionId = getRouterParam(event, "id");

  if (!actionId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Action ID is required",
    });
  }

  try {
    console.log("Unrejecting action:", actionId);

    // Get the rejected action
    const rejectedAction = await client.getDocument(actionId);

    if (!rejectedAction) {
      throw createError({
        statusCode: 404,
        statusMessage: "Action not found",
      });
    }

    if (rejectedAction.status !== "rejected") {
      throw createError({
        statusCode: 400,
        statusMessage: "Action is not in rejected status",
      });
    }

    // Update status back to pending
    const updatedAction = await client
      .patch(actionId)
      .set({
        status: "pending",
        _updatedAt: new Date().toISOString(),
      })
      .commit();

    console.log("Action unrejected successfully:", updatedAction._id);
    return updatedAction;
  } catch (error) {
    console.error("Unreject error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to unreject action",
    });
  }
});
