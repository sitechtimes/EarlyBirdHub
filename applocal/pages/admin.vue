<template>
  <div class="w-full h-full flex flex-col items-center">
    <!-- Dropdown -->
    <div class="w-full flex justify-center relative mt-5">
      <button
        @click="open = !open"
        class="w-1/2 flex justify-between items-center bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-700 shadow-sm hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      >
        {{ selected || "Pending" }}
        <i
          class="fa-solid fa-caret-up text-gold transition-transform"
          :class="{ 'rotate-180': open }"
        ></i>
      </button>
      <transition name="fade">
        <div
          v-if="open"
          class="absolute top-full mt-2 w-1/2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50"
        >
          <div
            v-for="(option, index) in options"
            :key="index"
            @click="selectOption(option)"
            :class="[
              'px-4 py-2 cursor-pointer select-none font-medium',
              option.disabled
                ? 'text-gray-400 cursor-not-allowed'
                : 'hover:bg-gray-100 text-gray-700 font-medium',
            ]"
          >
            {{ option.label }}
          </div>
        </div>
      </transition>
    </div>
    <button
      @click="updateStatic"
      v-if="selected === 'Update'"
      class="p-2 bg-white rounded-lg text-gold w-1/2 mt-5"
    >
      Update Website
    </button>

    <!-- Create Form -->
    <div v-if="selected === 'Create'" class="w-full max-w-2xl mt-8">
      <dailyform :form="createForm" @submit="handleCreateLink" />
    </div>

    <!-- Cards -->
    <div v-if="selected !== 'Create'" class="p-16">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div v-for="link in links" :key="link.id" class="min-w-[300px]">
          <cardTemplate
            :link="link"
            :page="page"
            :admin="true"
            @approve="handleApprove"
            @reject="handleReject"
            @edit="editLink"
            @delete="handleDelete"
          />
        </div>
      </div>
    </div>

    <!-- Create Form Messages -->
    <div v-if="selected === 'Create'" class="w-full max-w-2xl px-4">
      <!-- Error and Success Messages for Create Form -->
      <div v-if="error" class="bg-red-600 text-white p-4 rounded-lg mb-4">
        {{ error }}
      </div>
      <div v-if="success" class="bg-green-600 text-white p-4 rounded-lg mb-4">
        {{ success }}
      </div>
    </div>
    <div
      v-if="editing"
      class="fixed inset-0 bg-black/60 flex items-center justify-center"
    >
      <edit :form="form" @edit="updateLink" @cancel="cancelEdit" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import cardTemplate from "~/components/cardTemplate.vue";
import dailyform from "~/components/dailyform.vue";
import { useDailyLinks } from "~/composables/useDailyLinks";

definePageMeta({
  middleware: ["auth", "admin"],
});

const {
  staffLinks,
  pendingActions,
  fetchStaffLinks,
  fetchPendingActions,
  approveAction,
  rejectAction,
  deleteLinkDirect,
  updateLinkDirect,
  createLinkDirect,
  updateSite,
} = useDailyLinks();

const authStore = useAuthStore();

type Status = "Pending" | "Approved" | "Create" | "Update";
const form = ref({
  id: null as string | null,
  name: "",
  url: "",
  img: "",
  description: "",
  date: "",
});

const createForm = ref({
  id: null,
  title: "",
  url: "",
  description: "",
});

const editing = ref(false);
const page = ref<Status>("Pending");
const open = ref(false);
const selected = ref<string | null>("Pending");
const error = ref("");
const success = ref("");
const isProcessing = ref(false);

const options = [
  { label: "Pending", disabled: false },
  { label: "Approved", disabled: false },
  { label: "Create", disabled: false },
  { label: "Update", disabled: false },
];

const links = computed(() => {
  switch (page.value) {
    case "Pending":
      return pendingActions.value;
    case "Approved":
      return staffLinks.value;
    default:
      return [];
  }
});

async function handleApprove(actionId: number) {
  if (isProcessing.value) return;

  isProcessing.value = true;
  error.value = "";
  success.value = "";

  try {
    await approveAction(String(actionId));
    success.value = "Action approved successfully";

    setTimeout(async () => {
      await Promise.all([fetchStaffLinks(), fetchPendingActions()]);
    }, 500);
  } catch (err) {
    error.value = "Failed to approve action";
    console.error("Approve error:", err);
  } finally {
    isProcessing.value = false;
  }
}

async function handleReject(actionId: number) {
  if (isProcessing.value) return;

  isProcessing.value = true;
  error.value = "";
  success.value = "";

  try {
    await rejectAction(String(actionId));
    success.value = "Action rejected successfully";

    setTimeout(async () => {
      await Promise.all([fetchStaffLinks(), fetchPendingActions()]);
    }, 500);
  } catch (err) {
    error.value = "Failed to reject action";
    console.error("Reject error:", err);
  } finally {
    isProcessing.value = false;
  }
}

function editLink(link: any) {
  form.value = { ...link };
  editing.value = true;
}

async function handleDelete(id: number | string) {
  if (isProcessing.value) return;

  isProcessing.value = true;
  error.value = "";
  success.value = "";

  try {
    await deleteLinkDirect(String(id));
    success.value = "Link deleted successfully";

    setTimeout(async () => {
      await Promise.all([fetchStaffLinks(), fetchPendingActions()]);
    }, 500);
  } catch (err) {
    error.value = "Failed to delete link";
    console.error("Delete error:", err);
  } finally {
    isProcessing.value = false;
  }
}

async function updateLink(formData: any) {
  if (isProcessing.value || !formData.id) return;

  isProcessing.value = true;
  error.value = "";
  success.value = "";

  try {
    await updateLinkDirect(String(formData.id), {
      name: formData.name,
      description: formData.description,
      url: formData.url,
      image: formData.imageFile || formData.img || "",
    });
    success.value = "Link updated successfully";
    cancelEdit();

    setTimeout(async () => {
      await Promise.all([fetchStaffLinks(), fetchPendingActions()]);
    }, 500);
  } catch (err) {
    error.value = "Failed to update link";
    console.error("Update error:", err);
  } finally {
    isProcessing.value = false;
  }
}

async function handleCreateLink(formData: any) {
  if (isProcessing.value) return;

  isProcessing.value = true;
  error.value = "";
  success.value = "";

  try {
    await createLinkDirect({
      name: formData.title,
      description: formData.description,
      url: formData.url,
      image: formData.imageFile || undefined,
    });
    success.value = "Link created successfully";

    // Reset create form
    createForm.value = {
      id: null,
      title: "",
      url: "",
      description: "",
    };

    // Refresh data
    setTimeout(async () => {
      await Promise.all([fetchStaffLinks(), fetchPendingActions()]);
    }, 500);
  } catch (err) {
    error.value = "Failed to create link";
    console.error("Create error:", err);
  } finally {
    isProcessing.value = false;
  }
}

function cancelEdit() {
  resetForm();
  editing.value = false;
}

function resetForm() {
  form.value = {
    id: null,
    name: "",
    url: "",
    img: "",
    description: "",
    date: "",
  };
}

function selectOption(option: { label: string; disabled?: boolean }) {
  if (!option.disabled) {
    selected.value = option.label;
    page.value = option.label as Status;
    open.value = false;

    switch (option.label) {
      case "Pending":
        fetchPendingActions();
        break;
      case "Approved":
        fetchStaffLinks();
        break;
      case "Create":
        // Clear any error/success messages when switching to create
        error.value = "";
        success.value = "";
        break;
    }
  }
}

async function updateStatic() {
  await updateSite();
}

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

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
