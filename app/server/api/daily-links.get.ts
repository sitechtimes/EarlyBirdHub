import { defineEventHandler, getQuery } from "h3";
import { createClient } from "@sanity/client";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const client = createClient({
    projectId: config.sanityProjectId,
    dataset: config.sanityDataset,
    apiVersion: "2025-08-11",
    useCdn: false, // Ensure no caching for real-time updates
  });

  const query_params = getQuery(event);
  const view = query_params.view; // 'staff', 'admin', or 'rejected'

  let query;

  if (view === "staff") {
    // Staff sees only approved content (live links)
    query = `*[_type == "dailyLink" && status == "approved"] | order(_createdAt desc) {
      _id,
      name,
      description,
      url,
      date_end,
      date_uploaded,
      status,
      action_type,
      "imageUrl": image.asset->url
    }`;
  } else if (view === "admin") {
    // Admin sees all pending items for approval with original document data for edits
    query = `*[_type == "dailyLink" && status == "pending"] | order(_createdAt desc) {
      _id,
      name,
      description,
      url,
      date_end,
      date_uploaded,
      status,
      action_type,
      target_document_id,
      "imageUrl": image.asset->url,
      "originalDocument": *[_type == "dailyLink" && _id == ^.target_document_id && status == "approved"][0] {
        _id,
        name,
        description,
        url,
        date_end,
        date_uploaded,
        "imageUrl": image.asset->url
      },
      _createdAt,
      _updatedAt
    }`;
  } else if (view === "rejected") {
    // Admin sees all rejected items
    query = `*[_type == "dailyLink" && status == "rejected"] | order(_updatedAt desc) {
      _id,
      name,
      description,
      url,
      date_end,
      date_uploaded,
      status,
      action_type,
      target_document_id,
      "imageUrl": image.asset->url,
      _createdAt,
      _updatedAt
    }`;
  } else {
    // Default: return all
    query = `*[_type == "dailyLink"] | order(_createdAt desc) {
      _id,
      name,
      description,
      url,
      date_end,
      date_uploaded,
      status,
      action_type,
      target_document_id,
      "imageUrl": image.asset->url
    }`;
  }

  return await client.fetch(query);
});
