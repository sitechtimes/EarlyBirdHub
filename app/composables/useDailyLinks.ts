import { ref, onMounted } from "vue";

export function useDailyLinks() {
  const { $supabase } = useNuxtApp();
  const staffLinks = ref<Array<any>>([]);
  const pendingActions = ref<Array<any>>([]);
  const rejectedActions = ref<Array<any>>([]);

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

      staffLinks.value = data || [];
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

      pendingActions.value = data || [];
    } catch (error) {
      console.error("Failed to fetch pending actions:", error);
    }
  };

  // Fetch rejected actions - temporarily empty
  const fetchRejectedActions = async () => {
    try {
      // TODO: Implement when reject functionality is added back
      rejectedActions.value = [];
    } catch (error) {
      console.error("Failed to fetch rejected actions:", error);
    }
  };

  onMounted(fetchStaffLinks);

  // Helper function to upload image files to Supabase Storage
  async function uploadImage(file: File): Promise<string> {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `daily-links/${fileName}`;

      const { data, error } = await $supabase.storage
        .from("images") // Make sure you have an 'images' bucket in Supabase Storage
        .upload(filePath, file);

      if (error) {
        console.error("Upload error:", error);
        throw error;
      }

      // Get the public URL for the uploaded image
      const {
        data: { publicUrl },
      } = $supabase.storage.from("images").getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error("Failed to upload image:", error);
      throw error;
    }
  }

  async function createLink(payload: {
    name: string;
    description?: string;
    url?: string;
    image?: File | string; // Can be either File object or URL string
    date: string;
  }) {
    try {
      let imageUrl = payload.image;

      // If image is a File object, upload it first
      if (payload.image instanceof File) {
        imageUrl = await uploadImage(payload.image);
      }

      const { data, error } = await $supabase
        .from("daily_links")
        .insert([
          {
            name: payload.name,
            description: payload.description,
            url: payload.url,
            img: imageUrl, // Now this will be a URL string
            date: payload.date,
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
      date: string;
    }
  ) {
    try {
      let imageUrl = payload.image;

      // If image is a File object, upload it first
      if (payload.image instanceof File) {
        imageUrl = await uploadImage(payload.image);
      }

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
            date: payload.date,
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

  // Admin: Reject pending action - simply delete the request
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

      // Refresh the pending actions list
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

  return {
    staffLinks,
    pendingActions,
    rejectedActions,
    fetchStaffLinks,
    fetchPendingActions,
    fetchRejectedActions,
    createLink,
    submitEditRequest,
    submitDeleteRequest,
    approveAction,
    rejectAction,
  };
}
