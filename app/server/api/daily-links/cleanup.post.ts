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

  try {
    // Calculate date one week ago
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const oneWeekAgoISO = oneWeekAgo.toISOString();

    console.log("Cleaning up rejected items older than:", oneWeekAgoISO);

    // Find rejected items older than one week
    const oldRejectedItems = await client.fetch(
      `
      *[_type == "dailyLink" && status == "rejected" && _updatedAt < $cutoffDate] {
        _id,
        name,
        _updatedAt
      }
    `,
      { cutoffDate: oneWeekAgoISO }
    );

    console.log("Found old rejected items:", oldRejectedItems.length);

    // Delete them
    const deletePromises = oldRejectedItems.map((item: any) => {
      console.log(`Deleting old rejected item: ${item.name} (${item._id})`);
      return client.delete(item._id);
    });

    await Promise.all(deletePromises);

    return {
      success: true,
      deletedCount: oldRejectedItems.length,
      deletedItems: oldRejectedItems.map((item: any) => ({
        id: item._id,
        name: item.name,
        updatedAt: item._updatedAt,
      })),
    };
  } catch (error) {
    console.error("Cleanup error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to cleanup old rejected items",
    });
  }
});
