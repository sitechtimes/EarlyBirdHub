import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "tm79plee", // from sanity.json / manage.sanity.io
  dataset: "production",
  apiVersion: "2025-08-11", // use today's date
  useCdn: false,
});
