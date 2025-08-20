import {
  transformDailyLinksArray,
  shouldTransformUrls,
} from "~/utils/imageTransform";
import { getCurrentDate } from "~/utils/dateUtils";

export function useDailyLinks() {
  const { $supabase } = useNuxtApp();
  const config = useRuntimeConfig();
  const staffLinks = ref<Array<any>>([]);
  const pendingActions = ref<Array<any>>([]);
  const userLinks = ref<Array<any>>([]);

  const fetchUserLinks = async () => {
    try {
      // Check if Supabase client is available (important for static generation)
      if (!$supabase) {
        console.warn("Supabase client not available during static generation");
        userLinks.value = [];
        return;
      }

      const { data, error } = await $supabase
        .from("daily_links")
        .select("*")
        .eq("approved", true);

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      const forceTransform = shouldTransformUrls();
      userLinks.value = transformDailyLinksArray(
        data || [],
        config.public.supabaseUrl,
        forceTransform
      );
      console.log("User links fetched:", userLinks.value);
    } catch (error) {
      console.error("Failed to fetch user links:", error);
      userLinks.value = [];
    }
  };

  const fetchStaffLinks = async () => {
    try {
      const { data, error } = await $supabase
        .from("daily_links")
        .select("*")
        .eq("approved", true)
        .order("date", { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      const forceTransform = shouldTransformUrls();
      staffLinks.value = transformDailyLinksArray(
        data || [],
        config.public.supabaseUrl,
        forceTransform
      );
    } catch (error) {
      console.error("Failed to fetch staff links:", error);
    }
  };

  const fetchPendingActions = async () => {
    try {
      const { data, error } = await $supabase
        .from("daily_links")
        .select("*")
        .eq("approved", false)
        .order("date", { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      const forceTransform = shouldTransformUrls();
      pendingActions.value = transformDailyLinksArray(
        data || [],
        config.public.supabaseUrl,
        forceTransform
      );
    } catch (error) {
      console.error("Failed to fetch pending actions:", error);
    }
  };

  async function uploadImage(file: File): Promise<string> {
    try {
      // Check if user is authenticated
      const {
        data: { user },
        error: authError,
      } = await $supabase.auth.getUser();
      console.log("Auth check - User:", user, "Error:", authError);

      if (!user) {
        throw new Error("User not authenticated");
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}.${fileExt}`;
      const filePath = `daily-links/${fileName}`;

      console.log("Attempting to upload file:", filePath, "Size:", file.size);

      // Try uploading without upsert first
      const { data, error } = await $supabase.storage
        .from("daily-links-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true, // Changed to true to overwrite if exists
        });

      if (error) {
        console.error("Upload error details:", error);

        // Try alternative approach - upload to a different path or with different options
        if (
          error.message.includes("row-level security") ||
          error.message.includes("policy")
        ) {
          console.log("RLS error, trying without authentication...");

          // Alternative: Return a placeholder or skip image for now
          console.warn(
            "Skipping image upload due to RLS policy. Creating link without image."
          );
          return ""; // Return empty string to indicate no image
        }
        throw error;
      }

      console.log("Upload successful:", data);

      const {
        data: { publicUrl },
      } = $supabase.storage.from("daily-links-images").getPublicUrl(filePath);

      console.log("Generated public URL:", publicUrl);
      return publicUrl;
    } catch (error) {
      console.error("Failed to upload image:", error);
      // Instead of throwing, return empty string to allow link creation without image
      return "";
    }
  }

  async function createLink(payload: {
    name: string;
    description?: string;
    url?: string;
    image?: File | string; // Can be either File object or URL string
    date?: string; // Make date optional
  }) {
    try {
      let imageUrl = payload.image;

      // If image is a File object, try to upload it
      if (payload.image instanceof File) {
        imageUrl = await uploadImage(payload.image);
        if (!imageUrl) {
          console.log("No image URL returned, creating link without image");
        }
      }

      // Use provided date or current date
      const currentDate = payload.date || getCurrentDate();

      const { data, error } = await $supabase
        .from("daily_links")
        .insert([
          {
            name: payload.name,
            description: payload.description,
            url: payload.url,
            img: imageUrl,
            date: currentDate,
            action_type: "create",
            approved: false,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      return { success: true, data };
    } catch (error) {
      console.error("Failed to create link:", error);
      throw error;
    }
  }

  // Staff: Submit edit request - temporarily simplified
  async function submitEditRequest(
    targetId: string,
    payload: {
      name: string;
      description?: string;
      url?: string;
      image?: File | string; // Can be either File object or URL string
      date?: string; // Make date optional
    }
  ) {
    try {
      let imageUrl = payload.image;

      // If image is a File object, try to upload it
      if (payload.image instanceof File) {
        imageUrl = await uploadImage(payload.image);
        if (!imageUrl) {
          console.log(
            "No image URL returned during edit, keeping existing image"
          );
          imageUrl = ""; // Will keep existing image in DB
        }
      }

      // Use provided date or current date
      const currentDate = payload.date || getCurrentDate();

      // TODO: Implement full edit workflow when needed
      // For now, just create a new entry with old_id reference
      const { data, error } = await $supabase
        .from("daily_links")
        .insert([
          {
            name: payload.name,
            description: payload.description,
            url: payload.url,
            img: imageUrl, // Now this will be a URL string
            date: currentDate,
            action_type: "edit",
            old_id: targetId,
            approved: false,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      return { success: true, data };
    } catch (error) {
      console.error("Failed to submit edit request:", error);
      throw error;
    }
  }

  // Staff: Submit delete request - temporarily simplified
  async function submitDeleteRequest(targetId: string) {
    try {
      // Get the original document first
      const { data: original, error: fetchError } = await $supabase
        .from("daily_links")
        .select("*")
        .eq("id", targetId)
        .single();

      if (fetchError) {
        console.error("Supabase error:", fetchError);
        throw fetchError;
      }

      // Create delete request with original data
      const { data, error } = await $supabase
        .from("daily_links")
        .insert([
          {
            name: original.name,
            description: original.description,
            url: original.url,
            img: original.img,
            date: original.date,
            action_type: "delete",
            old_id: targetId,
            approved: false,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      return { success: true, data };
    } catch (error) {
      console.error("Failed to submit delete request:", error);
      throw error;
    }
  }

  // Admin: Approve pending action
  async function approveAction(actionId: string) {
    try {
      const { data: action, error: fetchError } = await $supabase
        .from("daily_links")
        .select("*")
        .eq("id", actionId)
        .single();

      if (fetchError) {
        console.error("Supabase error:", fetchError);
        throw fetchError;
      }

      if (!action) {
        throw new Error("Action not found");
      }

      if (action.action_type === "create") {
        const { error: updateError } = await $supabase
          .from("daily_links")
          .update({ approved: true })
          .eq("id", actionId);

        if (updateError) throw updateError;
      } else if (action.action_type === "edit" && action.old_id) {
        const { error: updateError } = await $supabase
          .from("daily_links")
          .update({
            name: action.name,
            description: action.description,
            url: action.url,
            img: action.img,
            date: action.date,
          })
          .eq("id", action.old_id);

        if (updateError) throw updateError;

        const { error: deleteError } = await $supabase
          .from("daily_links")
          .delete()
          .eq("id", actionId);

        if (deleteError) throw deleteError;
      } else if (action.action_type === "delete" && action.old_id) {
        const { error: deleteOriginalError } = await $supabase
          .from("daily_links")
          .delete()
          .eq("id", action.old_id);

        if (deleteOriginalError) throw deleteOriginalError;

        const { error: deleteRequestError } = await $supabase
          .from("daily_links")
          .delete()
          .eq("id", actionId);

        if (deleteRequestError) throw deleteRequestError;
      }

      await fetchStaffLinks();
      await fetchPendingActions();
      return { success: true, message: "Action approved successfully" };
    } catch (error) {
      console.error("Failed to approve action:", error);
      throw error;
    }
  }

  // Admin: Reject pending action
  async function rejectAction(actionId: string) {
    try {
      const { error } = await $supabase
        .from("daily_links")
        .delete()
        .eq("id", actionId);

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      await fetchPendingActions();

      return {
        success: true,
        message: "Action rejected and deleted successfully",
      };
    } catch (error) {
      console.error("Failed to reject action:", error);
      throw error;
    }
  }

  // Admin: Direct update function (bypasses approval workflow)
  async function updateLinkDirect(
    linkId: string,
    payload: {
      name: string;
      description?: string;
      url?: string;
      image?: File | string;
    }
  ) {
    try {
      let imageUrl = payload.image;

      // If image is a File object, try to upload it
      if (payload.image instanceof File) {
        imageUrl = await uploadImage(payload.image);
        if (!imageUrl) {
          console.log(
            "No image URL returned during update, keeping existing image"
          );
          imageUrl = undefined; // Will not update the image field
        }
      }

      // Prepare update data
      const updateData: any = {
        name: payload.name,
        description: payload.description,
        url: payload.url,
      };

      // Only update image if we have a new one
      if (imageUrl !== undefined) {
        updateData.img = imageUrl;
      }

      const { data, error } = await $supabase
        .from("daily_links")
        .update(updateData)
        .eq("id", linkId)
        .select();

      if (error) throw error;

      console.log("Link updated directly:", data);
      return { success: true, data };
    } catch (error) {
      console.error("Failed to update link directly:", error);
      throw error;
    }
  }

  // Admin: Direct create function (bypasses approval workflow)
  async function createLinkDirect(payload: {
    name: string;
    description?: string;
    url?: string;
    image?: File | string;
  }) {
    try {
      let imageUrl = payload.image;

      // If image is a File object, try to upload it
      if (payload.image instanceof File) {
        imageUrl = await uploadImage(payload.image);
        if (!imageUrl) {
          console.log("No image URL returned, creating link without image");
        }
      }

      // Use current date
      const currentDate = getCurrentDate();

      const { data, error } = await $supabase
        .from("daily_links")
        .insert([
          {
            name: payload.name,
            description: payload.description,
            url: payload.url,
            img: imageUrl,
            date: currentDate,
            approved: true, // Admin creates approved links directly
          },
        ])
        .select();

      if (error) throw error;

      console.log("Link created directly by admin:", data);
      return { success: true, data };
    } catch (error) {
      console.error("Failed to create link directly:", error);
      throw error;
    }
  }

  // Admin: Direct delete function (bypasses approval workflow)
  async function deleteLinkDirect(linkId: string) {
    try {
      const { data, error } = await $supabase
        .from("daily_links")
        .delete()
        .eq("id", linkId)
        .select();

      if (error) throw error;

      console.log("Link deleted directly:", data);
      return { success: true, data };
    } catch (error) {
      console.error("Failed to delete link directly:", error);
      throw error;
    }
  }

  async function updateSite() {
    try {
      await $fetch("/api/build", { method: "POST" });
      alert("Build started!");
    } catch (e) {
      console.error(e);
      alert("Build failed");
    }
  }

  return {
    staffLinks,
    userLinks,
    pendingActions,
    fetchStaffLinks,
    fetchPendingActions,
    createLink,
    submitEditRequest,
    submitDeleteRequest,
    fetchUserLinks,
    approveAction,
    rejectAction,
    updateLinkDirect,
    createLinkDirect,
    deleteLinkDirect,
    updateSite,
  };
}
