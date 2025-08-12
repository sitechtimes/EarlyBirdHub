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

  const { id } = getRouterParams(event);
  const actionId = id;

  console.log("Action ID:", actionId); // Debug log

  try {
    // First, get the pending action details
    const pendingAction = await client.fetch(
      `*[_type == "dailyLink" && _id == $actionId][0]`,
      { actionId }
    );

    if (!pendingAction) {
      throw createError({
        statusCode: 404,
        statusMessage: "Pending action not found",
      });
    }

    if (pendingAction.status !== "pending") {
      throw createError({
        statusCode: 400,
        statusMessage: "Action is not pending",
      });
    }

    const { action_type, target_document_id } = pendingAction;

    if (action_type === "create") {
      // Simply approve the create - set status to approved and is_live to true
      await client
        .patch(actionId)
        .set({
          status: "approved",
          is_live: true,
        })
        .commit();
    } else if (action_type === "edit") {
      // Update the target document and delete the pending one
      if (!target_document_id) {
        throw createError({
          statusCode: 400,
          statusMessage: "Target document ID required for edit action",
        });
      }

      // Update the original document with new data
      const updateData: any = {
        name: pendingAction.name,
        description: pendingAction.description,
        url: pendingAction.url,
        date_end: pendingAction.date_end,
        date_uploaded: pendingAction.date_uploaded,
      };

      if (pendingAction.image) {
        updateData.image = pendingAction.image;
      }

      await client.patch(target_document_id).set(updateData).commit();

      // Delete the pending edit request
      await client.delete(actionId);
    } else if (action_type === "delete") {
      // Delete both the pending action and the target document
      if (!target_document_id) {
        throw createError({
          statusCode: 400,
          statusMessage: "Target document ID required for delete action",
        });
      }

      // Delete the target document first
      await client.delete(target_document_id);

      // Then delete the pending delete request
      await client.delete(actionId);
    }

    return {
      success: true,
      message: `${action_type} action approved successfully`,
      action_type,
    };
  } catch (error) {
    console.error("Approval error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to approve action",
    });
  }
});
