import { createClient } from "@sanity/client";

export function useSanityUpload() {
  const uploadImage = async (
    file: File
  ): Promise<{ _id: string; url: string }> => {
    try {
      // Upload file to our API endpoint which will handle Sanity upload
      const formData = new FormData();
      formData.append("file", file);

      const response = await $fetch<{ _id: string; url: string }>(
        "/api/upload-image",
        {
          method: "POST",
          body: formData,
        }
      );

      return response;
    } catch (error) {
      console.error("Failed to upload image:", error);
      throw new Error("Failed to upload image");
    }
  };

  return { uploadImage };
}
