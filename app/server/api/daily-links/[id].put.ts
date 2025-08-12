import { defineEventHandler, readBody, createError } from "h3";
import { createClient } from "@sanity/client";

export default defineEventHandler(async (event) => {
  const { id } = event.context.params || {};
  if (!id) throw createError({ statusCode: 400, statusMessage: "missing id" });

  const body = await readBody(event);
  const config = useRuntimeConfig();

  const client = createClient({
    projectId: config.sanityProjectId,
    dataset: config.sanityDataset,
    apiVersion: "2025-08-11",
    useCdn: false,
    token: config.sanityWriteToken,
  });

  const patchData: Record<string, any> = {};
  if (body.name) patchData.name = String(body.name);
  if (body.description) patchData.description = String(body.description);
  if (body.url) patchData.url = String(body.url);
  if (body.image) patchData.image = body.image;
  if (body.date_end) patchData.date_end = body.date_end;
  if (body.date_uploaded) patchData.date_uploaded = body.date_uploaded;
  if (
    body.status &&
    ["pending", "approved", "rejected"].includes(body.status)
  ) {
    patchData.status = body.status;
  }

  if (Object.keys(patchData).length === 0) {
    throw createError({ statusCode: 400, statusMessage: "nothing to update" });
  }

  const updated = await client
    .patch(id)
    .set(patchData)
    .commit({ autoGenerateArrayKeys: true });
  return { success: true, result: updated };
});
