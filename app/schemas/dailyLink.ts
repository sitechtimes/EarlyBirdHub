import { defineType } from "sanity";

export default defineType({
  name: "dailyLink",
  title: "Daily Link",
  type: "document",
  fields: [
    { name: "name", title: "Name", type: "string" },
    { name: "description", title: "Description", type: "text" },
    { name: "url", title: "URL", type: "url" },
    { name: "image", title: "Image", type: "image" },
    {
      name: "date_end",
      title: "Date to End",
      type: "date",
      options: { dateFormat: "YYYY/MM/DD" },
    },
    {
      name: "date_uploaded",
      title: "Date Uploaded",
      type: "date",
      options: { dateFormat: "YYYY/MM/DD" },
    },
    {
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Approved", value: "approved" },
          { title: "Rejected", value: "rejected" },
        ],
        layout: "radio",
      },
      initialValue: "pending",
    },
    {
      name: "action_type",
      title: "Action Type",
      type: "string",
      options: {
        list: [
          { title: "Create New", value: "create" },
          { title: "Edit Existing", value: "edit" },
          { title: "Delete Existing", value: "delete" },
        ],
        layout: "radio",
      },
      initialValue: "create",
    },
    {
      name: "target_document_id",
      title: "Target Document ID",
      type: "string",
      description: "For edits/deletes: ID of the document to modify",
      hidden: ({ document }) => document?.action_type === "create",
    },
    {
      name: "original_data",
      title: "Original Data (for rollback)",
      type: "object",
      fields: [
        { name: "name", type: "string" },
        { name: "description", type: "text" },
        { name: "url", type: "url" },
        { name: "image", type: "image" },
        { name: "date_end", type: "date" },
      ],
      hidden: ({ document }) => document?.action_type !== "edit",
    },
    {
      name: "is_live",
      title: "Is Live Content",
      type: "boolean",
      description: "Approved content that is publicly visible",
      initialValue: false,
      readOnly: true,
    },
  ],
});
