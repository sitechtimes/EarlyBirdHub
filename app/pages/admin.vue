<template>
  <div class="min-h-screen bg-black text-gold p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold border-b border-gold pb-3">
        Admin Dashboard
      </h1>
      <button
        @click="authStore.signOut"
        class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>

    <!-- Mode Toggle -->
    <div class="flex gap-4 mb-6">
      <button @click="switchToPending" :class="toggleButtonClass('pending')">
        ⏳ Pending Actions
      </button>
      <button @click="switchToRejected" :class="toggleButtonClass('rejected')">
        ❌ Rejected Items
      </button>
      <button @click="switchToAll" :class="toggleButtonClass('all')">
        📋 All Links
      </button>
    </div>

    <!-- Messages -->
    <div
      v-if="error"
      class="bg-red-900/50 border border-red-500 text-red-200 px-4 py-2 rounded mb-4"
    >
      {{ error }}
    </div>
    <div
      v-if="success"
      class="bg-green-900/50 border border-green-500 text-green-200 px-4 py-2 rounded mb-4"
    >
      {{ success }}
    </div>

    <!-- Pending Actions View -->
    <div v-if="adminMode === 'pending'" class="space-y-4">
      <h2 class="text-2xl font-semibold">Pending Actions</h2>
      <div
        v-if="pendingActions.length === 0"
        class="text-center py-8 text-gray-400"
      >
        No pending actions
      </div>
      <div v-else class="space-y-4">
        <div
          v-for="action in pendingActions"
          :key="action._id"
          class="border border-gold p-4 rounded-xl bg-zinc-950"
        >
          <div class="flex justify-between items-start mb-3">
            <div>
              <h3 class="text-xl font-semibold text-gold">
                {{ action.name }}
              </h3>
              <span class="text-sm text-gray-400 uppercase">
                {{ action.action_type }}
              </span>
              <p class="text-xs text-gray-400">
                {{ new Date(action.created_at).toLocaleString() }}
              </p>
            </div>
            <div class="flex gap-2">
              <button
                @click="handleApprove(action.id)"
                :disabled="isProcessing"
                class="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ✓ Approve
              </button>
              <button
                @click="handleReject(action.id)"
                :disabled="isProcessing"
                class="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ✗ Reject
              </button>
            </div>
          </div>

          <div v-if="action.description" class="text-sm mb-2">
            <strong>Description:</strong> {{ action.description }}
          </div>
          <div v-if="action.url" class="text-sm mb-2">
            <strong>URL:</strong>
            <a
              :href="action.url"
              target="_blank"
              class="text-blue-400 hover:underline"
              >{{ action.url }}</a
            >
          </div>
          <div v-if="action.date" class="text-sm mb-2">
            <strong>Date:</strong> {{ action.date }}
          </div>
          <img
            v-if="action.img"
            :src="action.img"
            alt="Preview"
            class="w-20 h-20 object-cover rounded border border-gold"
          />
        </div>
      </div>
    </div>

    <!-- Rejected Items View -->
    <div v-if="adminMode === 'rejected'" class="space-y-4">
      <h2 class="text-2xl font-semibold">Rejected Items</h2>
      <div
        v-if="rejectedActions.length === 0"
        class="text-center py-8 text-gray-400"
      >
        No rejected items
      </div>
      <div v-else class="space-y-4">
        <div
          v-for="action in rejectedActions"
          :key="action._id"
          class="border border-red-500 p-4 rounded-xl bg-zinc-950"
        >
          <div class="flex justify-between items-start mb-3">
            <div>
              <h3 class="text-xl font-semibold text-gold">
                {{ action.name }}
              </h3>
              <span class="text-sm text-gray-400 uppercase">
                {{ action.action_type }}
              </span>
            </div>
            <div class="flex gap-2">
              <button
                @click="handlePermanentDelete(action.id)"
                :disabled="isProcessing"
                class="bg-red-800 text-white px-3 py-1 rounded text-sm hover:bg-red-900"
              >
                🗑️ Delete Forever
              </button>
            </div>
          </div>
          <div v-if="action.description" class="text-sm mb-2">
            <strong>Description:</strong> {{ action.description }}
          </div>
          <div v-if="action.url" class="text-sm mb-2">
            <strong>URL:</strong>
            <a
              :href="action.url"
              target="_blank"
              class="text-blue-400 hover:underline"
              >{{ action.url }}</a
            >
          </div>
          <img
            v-if="action.img"
            :src="action.img"
            alt="Preview"
            class="w-20 h-20 object-cover rounded border border-gold"
          />
        </div>
      </div>
    </div>

    <!-- All Links View -->
    <div v-if="adminMode === 'all'" class="space-y-4">
      <h2 class="text-2xl font-semibold">All Approved Links</h2>
      <div
        v-if="staffLinks.length"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
      >
        <div
          v-for="link in staffLinks"
          :key="link._id"
          class="border border-gold p-3 rounded-xl bg-zinc-950"
        >
          <img
            v-if="link.img"
            :src="link.img"
            alt=""
            class="w-full h-32 object-cover rounded mb-2"
          />
          <h3 class="font-semibold text-gold">{{ link.name }}</h3>
          <p class="text-sm text-gray-300 mb-2">{{ link.description }}</p>
          <a
            :href="link.url"
            target="_blank"
            class="text-blue-400 hover:underline text-sm block mb-3"
            >{{ link.url }}</a
          >
          <div class="flex gap-2">
            <button
              @click="handleDirectDelete(link.id)"
              :disabled="isProcessing"
              class="bg-red-600 text-white px-2 py-1 rounded text-sm hover:bg-red-700"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useDailyLinks } from "~/composables/useDailyLinks";

// Add middleware to protect this page
definePageMeta({
  middleware: ["auth", "admin"],
});

// Composables
const {
  staffLinks,
  pendingActions,
  rejectedActions,
  fetchStaffLinks,
  fetchPendingActions,
  fetchRejectedActions,
  approveAction,
  rejectAction,
} = useDailyLinks();

const authStore = useAuthStore();

// State
const adminMode = ref<"pending" | "rejected" | "all">("pending");
const error = ref("");
const success = ref("");
const isProcessing = ref(false);

// Methods
function toggleButtonClass(mode: "pending" | "rejected" | "all") {
  return [
    "px-4 py-2 rounded-lg font-semibold transition-colors",
    adminMode.value === mode
      ? "bg-gold text-black"
      : "bg-black border border-gold text-gold hover:bg-gold hover:text-black",
  ];
}

function switchToPending() {
  adminMode.value = "pending";
  clearMessages();
  fetchPendingActions();
}

function switchToRejected() {
  adminMode.value = "rejected";
  clearMessages();
  fetchRejectedActions();
}

function switchToAll() {
  adminMode.value = "all";
  clearMessages();
  fetchStaffLinks();
}

function clearMessages() {
  error.value = "";
  success.value = "";
}

async function handleApprove(actionId: string) {
  if (isProcessing.value) return;

  isProcessing.value = true;
  clearMessages();

  try {
    console.log("Approving action:", actionId);
    const result = await approveAction(actionId);
    console.log("Approval result:", result);

    success.value = "Action approved successfully";

    // Refresh views
    setTimeout(async () => {
      await Promise.all([fetchStaffLinks(), fetchPendingActions()]);
      console.log("Views refreshed after approval");
    }, 500);
  } catch (err) {
    error.value = "Failed to approve action";
    console.error("Approve error:", err);
  } finally {
    isProcessing.value = false;
  }
}

async function handleReject(actionId: string) {
  if (isProcessing.value) return;

  isProcessing.value = true;
  clearMessages();

  try {
    console.log("Rejecting action:", actionId);
    await rejectAction(actionId);
    success.value = "Action rejected successfully";

    setTimeout(async () => {
      await fetchPendingActions();
      console.log("Pending actions refreshed after rejection");
    }, 500);
  } catch (err) {
    error.value = "Failed to reject action";
    console.error("Reject error:", err);
  } finally {
    isProcessing.value = false;
  }
}

async function handlePermanentDelete(actionId: string) {
  if (isProcessing.value) return;

  if (
    !confirm(
      "Are you sure you want to permanently delete this item? This cannot be undone."
    )
  ) {
    return;
  }

  isProcessing.value = true;
  clearMessages();

  try {
    console.log("Permanently deleting action:", actionId);
    await $fetch(`/api/daily-links/${actionId}`, { method: "DELETE" });
    success.value = "Item permanently deleted";

    setTimeout(async () => {
      await fetchRejectedActions();
      console.log("Rejected actions refreshed after permanent delete");
    }, 500);
  } catch (err) {
    error.value = "Failed to permanently delete item";
    console.error("Permanent delete error:", err);
  } finally {
    isProcessing.value = false;
  }
}

async function handleDirectDelete(linkId: string) {
  if (isProcessing.value) return;

  if (!confirm("Are you sure you want to delete this approved link?")) {
    return;
  }

  isProcessing.value = true;
  clearMessages();

  try {
    const { $supabase } = useNuxtApp();
    const { error } = await $supabase
      .from("daily_links")
      .delete()
      .eq("id", linkId);

    if (error) throw error;

    success.value = "Link deleted successfully";

    setTimeout(async () => {
      await fetchStaffLinks();
    }, 500);
  } catch (err) {
    error.value = "Failed to delete link";
    console.error("Delete error:", err);
  } finally {
    isProcessing.value = false;
  }
}

// Initialize on mount
onMounted(async () => {
  try {
    await authStore.fetchUser();
    authStore.listenToAuthChanges();
    await fetchPendingActions(); // Default view
  } catch (error) {
    console.error("Failed to initialize admin page:", error);
  }
});
</script>
