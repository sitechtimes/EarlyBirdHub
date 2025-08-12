import { ref, onMounted } from "vue";

export function useDailyLinks() {
  const staffLinks = ref<Array<any>>([]);
  const pendingActions = ref<Array<any>>([]);
  const rejectedActions = ref<Array<any>>([]);

  // Fetch approved links for staff view
  const fetchStaffLinks = async () => {
    try {
      staffLinks.value = await $fetch<any[]>("/api/daily-links?view=staff");
    } catch (error) {
      console.error("Failed to fetch staff links:", error);
    }
  };

  // Fetch pending actions for admin view
  const fetchPendingActions = async () => {
    try {
      pendingActions.value = await $fetch<any[]>("/api/daily-links?view=admin");
    } catch (error) {
      console.error("Failed to fetch pending actions:", error);
    }
  };

  // Fetch rejected actions for admin view
  const fetchRejectedActions = async () => {
    try {
      rejectedActions.value = await $fetch<any[]>(
        "/api/daily-links?view=rejected"
      );
    } catch (error) {
      console.error("Failed to fetch rejected actions:", error);
    }
  };

  onMounted(fetchStaffLinks);

  // Staff: Create new link (goes to pending)
  async function createLink(payload: {
    name: string;
    description?: string;
    url: string;
    image: any;
    date_end?: string;
    date_uploaded?: string;
  }) {
    if (!payload.image) throw new Error("Image is required");

    const res = await $fetch("/api/daily-links", {
      method: "POST",
      body: {
        ...payload,
        action_type: "create",
        status: "pending",
        is_live: false,
        date_uploaded: new Date().toISOString().split("T")[0],
      },
    });
    return res;
  }

  // Staff: Submit edit request (creates pending edit)
  async function submitEditRequest(
    targetId: string,
    payload: {
      name: string;
      description?: string;
      url: string;
      image?: any;
      date_end?: string;
    }
  ) {
    const res = await $fetch("/api/daily-links/submit-edit", {
      method: "POST",
      body: {
        ...payload,
        target_document_id: targetId,
      },
    });
    return res;
  }

  // Staff: Submit delete request (creates pending delete)
  async function submitDeleteRequest(targetId: string) {
    const res = await $fetch("/api/daily-links/submit-delete", {
      method: "POST",
      body: {
        target_document_id: targetId,
      },
    });
    return res;
  }

  // Admin: Approve pending action
  async function approveAction(actionId: string) {
    const res = await $fetch(`/api/daily-links/${actionId}/approve`, {
      method: "POST",
    });
    await fetchStaffLinks();
    await fetchPendingActions();
    return res;
  }

  // Admin: Reject pending action
  async function rejectAction(actionId: string) {
    const res = await $fetch(`/api/daily-links/${actionId}/reject`, {
      method: "POST",
    });
    await fetchPendingActions();
    await fetchRejectedActions();
    return res;
  }

  // Admin: Unreject action (put back to pending)
  async function unrejectAction(actionId: string) {
    const res = await $fetch(`/api/daily-links/${actionId}/unreject`, {
      method: "POST",
    });
    await fetchPendingActions();
    await fetchRejectedActions();
    return res;
  }

  // Admin: Cleanup old rejected items
  async function cleanupOldRejected() {
    const res = await $fetch("/api/daily-links/cleanup", {
      method: "POST",
    });
    await fetchRejectedActions();
    return res;
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
    unrejectAction,
    cleanupOldRejected,
  };
}
