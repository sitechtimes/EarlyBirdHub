<template>
  <div class="min-h-screen bg-black text-gold p-6">
    <!-- Login Form -->
    <div v-if="!loggedIn" class="min-h-screen flex items-center justify-center">
      <form
        @submit.prevent="handleLogin"
        class="bg-zinc-900 p-6 rounded-xl border border-gold w-full max-w-md space-y-4"
      >
        <h2 class="text-2xl font-bold text-center border-b border-gold pb-2">
          Login
        </h2>
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="w-full bg-black border border-gold p-2 rounded"
          required
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="w-full bg-black border border-gold p-2 rounded"
          required
        />
        <div v-if="error" class="text-red-400 text-sm">{{ error }}</div>
        <button
          type="submit"
          class="w-full bg-gold text-black font-bold py-2 px-4 rounded"
        >
          Login
        </button>
      </form>
    </div>

    <!-- Main Dashboard -->
    <div v-else class="space-y-6">
      <!-- Header -->
      <h1 class="text-3xl font-bold border-b border-gold pb-3">
        Manage Daily Links
      </h1>

      <!-- Mode Toggle -->
      <div class="flex gap-4">
        <button @click="switchToStaff" :class="toggleButtonClass('staff')">
          👥 Staff View
        </button>
        <button @click="switchToAdmin" :class="toggleButtonClass('admin')">
          🔧 Admin View
        </button>
        <button
          @click="switchToRejected"
          :class="toggleButtonClass('rejected')"
        >
          ❌ Rejected Items
        </button>
        <button
          @click="cleanupOldRejected"
          class="px-4 py-2 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors"
        >
          🗑️ Cleanup Old
        </button>
      </div>

      <!-- Messages -->
      <div
        v-if="error"
        class="bg-red-900/50 border border-red-500 text-red-200 px-4 py-2 rounded"
      >
        {{ error }}
      </div>
      <div
        v-if="success"
        class="bg-green-900/50 border border-green-500 text-green-200 px-4 py-2 rounded"
      >
        {{ success }}
      </div>

      <!-- Staff View -->
      <div v-if="userMode === 'staff'" class="space-y-6">
        <!-- Create Form -->
        <div class="bg-zinc-900 p-6 rounded-xl border border-gold">
          <h2 class="text-2xl font-semibold mb-4">Create New Link</h2>
          <form
            @submit.prevent="handleCreate"
            class="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              v-model="form.title"
              type="text"
              placeholder="Title"
              class="bg-black border border-gold p-2 rounded"
              required
            />
            <input
              v-model="form.url"
              type="url"
              placeholder="URL"
              class="bg-black border border-gold p-2 rounded"
              required
            />
            <input
              v-model="form.description"
              type="text"
              placeholder="Description"
              class="bg-black border border-gold p-2 rounded"
            />
            <input
              v-model="form.date"
              type="date"
              class="bg-black border border-gold p-2 rounded"
            />
            <div class="md:col-span-2">
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                @change="handleFileSelect"
                required
                class="w-full bg-black border border-gold p-2 rounded text-gold file:bg-gold file:text-black file:border-none file:rounded file:px-2 file:py-1 file:mr-2"
              />
              <div v-if="selectedFile" class="text-sm text-green-400 mt-1">
                Selected: {{ selectedFile.name }}
              </div>
            </div>
            <button
              type="submit"
              :disabled="isUploading"
              class="md:col-span-2 bg-gold text-black font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {{ isUploading ? "Uploading..." : "Submit for Approval" }}
            </button>
          </form>
        </div>

        <!-- Existing Links -->
        <div v-if="staffLinks.length" class="space-y-4">
          <h2 class="text-2xl font-semibold">Approved Links</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div
              v-for="link in staffLinks"
              :key="link._id"
              class="border border-gold p-3 rounded-xl bg-zinc-950"
            >
              <img
                v-if="link.imageUrl"
                :src="link.imageUrl"
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
                  @click="startEdit(link)"
                  class="bg-blue-600 text-white px-2 py-1 rounded text-sm"
                >
                  Edit
                </button>
                <button
                  @click="handleDelete(link._id)"
                  class="bg-red-600 text-white px-2 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Admin View -->
      <div v-if="userMode === 'admin'" class="space-y-4">
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
                <span
                  class="inline-block bg-blue-600 px-2 py-1 rounded text-xs capitalize"
                  >{{ action.action_type }}</span
                >
                <p
                  v-if="action.target_document_id"
                  class="text-xs text-gray-400"
                >
                  Target: {{ action.target_document_id }}
                </p>
              </div>
              <div class="flex gap-2">
                <button
                  @click="handleApprove(action._id)"
                  :disabled="isProcessing"
                  class="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ isProcessing ? "⏳" : "✅" }} Approve
                </button>
                <button
                  @click="handleReject(action._id)"
                  :disabled="isProcessing"
                  class="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ isProcessing ? "⏳" : "❌" }} Reject
                </button>
              </div>
            </div>

            <!-- For Edit Requests: Show Original vs Proposed Changes -->
            <div
              v-if="action.action_type === 'edit' && action.originalDocument"
              class="mb-4"
            >
              <h4 class="text-lg font-semibold text-gold mb-2">
                📝 Proposed Changes
              </h4>
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <!-- Original Document -->
                <div class="border border-gray-600 p-3 rounded bg-zinc-800">
                  <h5 class="text-sm font-semibold text-gray-300 mb-2">
                    🔵 Current Version
                  </h5>
                  <div class="space-y-2">
                    <div class="text-sm">
                      <strong>Name:</strong> {{ action.originalDocument.name }}
                    </div>
                    <div
                      v-if="action.originalDocument.description"
                      class="text-sm"
                    >
                      <strong>Description:</strong>
                      {{ action.originalDocument.description }}
                    </div>
                    <div v-if="action.originalDocument.url" class="text-sm">
                      <strong>URL:</strong>
                      <a
                        :href="action.originalDocument.url"
                        target="_blank"
                        class="text-blue-400 hover:underline break-all"
                      >
                        {{ action.originalDocument.url }}
                      </a>
                    </div>
                    <div
                      v-if="action.originalDocument.date_end"
                      class="text-sm"
                    >
                      <strong>End Date:</strong>
                      {{ action.originalDocument.date_end }}
                    </div>
                    <img
                      v-if="action.originalDocument.imageUrl"
                      :src="action.originalDocument.imageUrl"
                      alt="Current Image"
                      class="w-20 h-20 object-cover rounded border border-gray-500 mt-2"
                    />
                  </div>
                </div>

                <!-- Proposed Changes -->
                <div class="border border-gold p-3 rounded bg-zinc-800">
                  <h5 class="text-sm font-semibold text-gold mb-2">
                    🟡 Proposed Changes
                  </h5>
                  <div class="space-y-2">
                    <div class="text-sm">
                      <strong>Name:</strong>
                      <span
                        :class="
                          action.name !== action.originalDocument.name
                            ? 'text-yellow-400 font-semibold'
                            : ''
                        "
                      >
                        {{ action.name }}
                      </span>
                    </div>
                    <div v-if="action.description" class="text-sm">
                      <strong>Description:</strong>
                      <span
                        :class="
                          action.description !==
                          action.originalDocument.description
                            ? 'text-yellow-400 font-semibold'
                            : ''
                        "
                      >
                        {{ action.description }}
                      </span>
                    </div>
                    <div v-if="action.url" class="text-sm">
                      <strong>URL:</strong>
                      <a
                        :href="action.url"
                        target="_blank"
                        :class="[
                          'hover:underline break-all',
                          action.url !== action.originalDocument.url
                            ? 'text-yellow-400 font-semibold'
                            : 'text-blue-400',
                        ]"
                      >
                        {{ action.url }}
                      </a>
                    </div>
                    <div v-if="action.date_end" class="text-sm">
                      <strong>End Date:</strong>
                      <span
                        :class="
                          action.date_end !== action.originalDocument.date_end
                            ? 'text-yellow-400 font-semibold'
                            : ''
                        "
                      >
                        {{ action.date_end }}
                      </span>
                    </div>
                    <img
                      v-if="action.imageUrl"
                      :src="action.imageUrl"
                      alt="Proposed Image"
                      class="w-20 h-20 object-cover rounded border border-gold mt-2"
                    />
                    <div
                      v-else-if="action.originalDocument.imageUrl"
                      class="text-sm text-gray-400 mt-2"
                    >
                      No image changes proposed
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- For Create/Delete Requests: Show Standard Info -->
            <div v-else>
              <!-- Special handling for delete requests -->
              <div
                v-if="action.action_type === 'delete'"
                class="border border-red-500 p-3 rounded bg-red-950/20 mb-3"
              >
                <h5 class="text-sm font-semibold text-red-400 mb-2">
                  🗑️ Document to be Deleted
                </h5>
                <div class="text-sm text-red-200">
                  This action will permanently remove the following approved
                  document:
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
              <div v-if="action.date_end" class="text-sm mb-2">
                <strong>End Date:</strong> {{ action.date_end }}
              </div>
              <img
                v-if="action.imageUrl"
                :src="action.imageUrl"
                alt="Preview"
                class="w-20 h-20 object-cover rounded border border-gold"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Rejected View -->
      <div v-if="userMode === 'rejected'" class="space-y-4">
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
                <span
                  class="inline-block bg-red-600 px-2 py-1 rounded text-xs capitalize"
                  >{{ action.action_type }} (Rejected)</span
                >
                <p
                  v-if="action.target_document_id"
                  class="text-xs text-gray-400"
                >
                  Target: {{ action.target_document_id }}
                </p>
                <p class="text-xs text-gray-400">
                  Rejected:
                  {{ new Date(action._updatedAt).toLocaleDateString() }}
                </p>
              </div>
              <div class="flex gap-2">
                <button
                  @click="handleUnreject(action._id)"
                  :disabled="isProcessing"
                  class="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ isProcessing ? "⏳" : "↩️" }} Unreject
                </button>
                <button
                  @click="handlePermanentDelete(action._id)"
                  :disabled="isProcessing"
                  class="bg-red-800 text-white px-3 py-1 rounded text-sm hover:bg-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ isProcessing ? "⏳" : "🗑️" }} Delete Forever
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
              v-if="action.imageUrl"
              :src="action.imageUrl"
              alt="Preview"
              class="w-20 h-20 object-cover rounded border border-gold"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div
      v-if="editing"
      class="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
    >
      <div
        class="bg-zinc-900 p-6 rounded-xl border border-gold w-[90%] max-w-lg"
      >
        <h2 class="text-xl font-bold border-b border-gold pb-2 mb-4">
          Edit Link
        </h2>
        <form @submit.prevent="handleUpdateLink" class="space-y-4">
          <input
            v-model="form.title"
            type="text"
            placeholder="Title"
            class="w-full bg-black border border-gold p-2 rounded"
            required
          />
          <input
            v-model="form.url"
            type="url"
            placeholder="URL"
            class="w-full bg-black border border-gold p-2 rounded"
            required
          />
          <input
            v-model="form.description"
            type="text"
            placeholder="Description"
            class="w-full bg-black border border-gold p-2 rounded"
          />
          <input
            v-model="form.date"
            type="date"
            class="w-full bg-black border border-gold p-2 rounded"
          />
          <input
            type="file"
            accept="image/*"
            @change="handleFileSelect"
            class="w-full bg-black border border-gold p-2 rounded text-gold file:bg-gold file:text-black file:border-none file:rounded file:px-2 file:py-1 file:mr-2"
          />
          <div class="flex gap-2">
            <button
              type="submit"
              :disabled="isUploading"
              class="bg-gold text-black font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {{ isUploading ? "Updating..." : "Submit Edit" }}
            </button>
            <button
              type="button"
              @click="cancelEdit"
              class="bg-gray-600 text-white py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useDailyLinks } from "~/composables/useDailyLinks";
import { useSanityUpload } from "~/composables/useSanityUpload";

// Composables
const {
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
} = useDailyLinks();

const { uploadImage } = useSanityUpload();
const authStore = useAuthStore();
const loggedIn = computed(() => authStore.user !== null);

// State
const userMode = ref<"staff" | "admin" | "rejected">("staff");
const error = ref("");
const success = ref("");
const email = ref("");
const password = ref("");
const editing = ref(false);
const isUploading = ref(false);
const isProcessing = ref(false); // Add processing state
const selectedFile = ref<File | null>(null);

const form = ref({
  id: null as string | null,
  title: "",
  url: "",
  description: "",
  date: "",
});

// Methods
function toggleButtonClass(mode: "staff" | "admin" | "rejected") {
  return [
    "px-4 py-2 rounded-lg font-semibold transition-colors",
    userMode.value === mode
      ? "bg-gold text-black"
      : "bg-black border border-gold text-gold hover:bg-gold hover:text-black",
  ];
}

function switchToStaff() {
  userMode.value = "staff";
  clearMessages();
  fetchStaffLinks();
}

function switchToAdmin() {
  userMode.value = "admin";
  clearMessages();
  fetchPendingActions();
}

function switchToRejected() {
  userMode.value = "rejected";
  clearMessages();
  fetchRejectedActions();
}

function clearMessages() {
  error.value = "";
  success.value = "";
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0];
  }
}

function resetForm() {
  form.value = { id: null, title: "", url: "", description: "", date: "" };
  selectedFile.value = null;
}

function startEdit(link: any) {
  form.value = {
    id: link._id,
    title: link.name,
    url: link.url,
    description: link.description || "",
    date: link.date_end || "",
  };
  editing.value = true;
}

function cancelEdit() {
  editing.value = false;
  resetForm();
}

async function handleLogin() {
  try {
    await authStore.signIn({ email: email.value, password: password.value });
    clearMessages();
  } catch (err) {
    error.value = "Login failed. Please check your credentials.";
  }
}

async function handleCreate() {
  if (!selectedFile.value) {
    error.value = "Please select an image";
    return;
  }

  isUploading.value = true;
  try {
    const uploadResult = await uploadImage(selectedFile.value);
    await createLink({
      name: form.value.title,
      description: form.value.description,
      url: form.value.url,
      date_end: form.value.date,
      image: {
        _type: "image",
        asset: { _type: "reference", _ref: uploadResult._id },
      },
    });
    success.value = "Link submitted for approval";
    resetForm();
  } catch (err) {
    error.value = "Failed to create link";
  } finally {
    isUploading.value = false;
  }
}

async function handleUpdateLink() {
  if (!form.value.id) return;

  isUploading.value = true;
  try {
    let updateData: any = {
      name: form.value.title,
      url: form.value.url,
      description: form.value.description,
      date_end: form.value.date,
    };

    if (selectedFile.value) {
      const uploadResult = await uploadImage(selectedFile.value);
      updateData.image = {
        _type: "image",
        asset: { _type: "reference", _ref: uploadResult._id },
      };
    }

    await submitEditRequest(form.value.id, updateData);
    success.value = "Edit request submitted for approval";
    editing.value = false;
    resetForm();
  } catch (err) {
    error.value = "Failed to submit edit request";
  } finally {
    isUploading.value = false;
  }
}

async function handleDelete(id: string) {
  if (confirm("Submit this link for deletion? It will need admin approval.")) {
    try {
      await submitDeleteRequest(id);
      success.value = "Delete request submitted for approval";
    } catch (err) {
      error.value = "Failed to submit delete request";
    }
  }
}

async function handleApprove(actionId: string) {
  if (isProcessing.value) return; // Prevent double-clicks

  isProcessing.value = true;
  clearMessages();

  try {
    console.log("Approving action:", actionId);
    const result = await approveAction(actionId);
    console.log("Approval result:", result);

    success.value = "Action approved successfully";

    // Force refresh both views with a small delay to ensure backend is updated
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
  if (isProcessing.value) return; // Prevent double-clicks

  isProcessing.value = true;
  clearMessages();

  try {
    console.log("Rejecting action:", actionId);
    await rejectAction(actionId);
    success.value = "Action rejected successfully";

    // Refresh pending actions
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

async function handleUnreject(actionId: string) {
  if (isProcessing.value) return;

  isProcessing.value = true;
  clearMessages();

  try {
    console.log("Unrejecting action:", actionId);
    await unrejectAction(actionId);
    success.value = "Action moved back to pending successfully";

    // Refresh both pending and rejected actions
    setTimeout(async () => {
      await fetchPendingActions();
      await fetchRejectedActions();
      console.log("Actions refreshed after unreject");
    }, 500);
  } catch (err) {
    error.value = "Failed to unreject action";
    console.error("Unreject error:", err);
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

    // Refresh rejected actions
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
</script>
