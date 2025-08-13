<template>
  <div class="min-h-screen bg-black text-gold p-6 space-y-10 w-full">
    <div class="w-full flex flex-col items-center" v-if="loggedIn">
      <div class="relative flex justify-center w-full gap-4 mb-6">
        <h1
          @click="createNew = true"
          ref="tab1"
          class="text-[150%] font-bold cursor-pointer pb-2 pt-3"
        >
          Manage Daily Links
        </h1>
        <h1
          @click="createNew = false"
          ref="tab2"
          class="text-[150%] font-bold cursor-pointer pb-2 pt-3"
        >
          Pending Links
        </h1>
        <div
          class="absolute bottom-0 h-[2px] bg-gold rounded transition-all duration-300"
          :style="{ left: underlineLeft + 'px', width: underlineWidth + 'px' }"
        ></div>
      </div>
      <dailyform v-if="createNew == true" :form="form" @submit="addLink" />

      <!-- Show current daily links in Manage tab -->
      <div v-if="createNew == true" class="space-y-6 mt-8">
        <h2 class="text-xl font-bold text-center">Your Current Daily Links</h2>
        <div
          v-if="staffLinks.length > 0"
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10 md:m-12"
        >
          <cardTemplate
            v-for="link in staffLinks"
            :page="'Approved'"
            :admin="false"
            :link="link"
            @edit="editLink"
            @delete="deleteLink"
          />
        </div>
        <div v-else class="text-center text-gray-400 py-8">
          No daily links found. Create your first one above!
        </div>
      </div>

      <!-- Show pending links in Pending tab -->
      <div v-if="createNew == false" class="space-y-6">
        <h2 class="text-xl font-bold text-center">Pending Approval</h2>
        <div
          v-if="pendingActions.length > 0"
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10 md:m-12"
        >
          <cardTemplate
            v-for="link in pendingActions"
            :page="'Pending'"
            :admin="false"
            :link="link"
          />
        </div>
        <div v-else class="text-center text-gray-400 py-8">
          No pending submissions.
        </div>
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
import { useDailyLinks } from "~/composables/useDailyLinks";
import {
  ref,
  watch,
  onMounted,
  onBeforeUnmount,
  nextTick,
  computed,
} from "vue";
import edit from "~/components/edit.vue";
import cardTemplate from "~/components/cardTemplate.vue";
import type { Form } from "~/types/type";
import dailyform from "~/components/dailyform.vue";

// Add middleware to protect this page
definePageMeta({
  middleware: ["auth"],
});

// Composables
const {
  staffLinks,
  pendingActions,
  fetchStaffLinks,
  fetchPendingActions,
  createLink,
  submitEditRequest,
  submitDeleteRequest,
} = useDailyLinks();

const authStore = useAuthStore();
const loggedIn = computed(() => authStore.user !== null);

// State
const error = ref("");
const success = ref("");
const email = ref("");
const password = ref("");
const editing = ref(false);
const isUploading = ref(false);
const isProcessing = ref(false);
const selectedFile = ref<File | null>(null);
const createNew = ref(true);
const tab1 = ref<HTMLElement | null>(null);
const tab2 = ref<HTMLElement | null>(null);
const underlineLeft = ref(0);
const underlineWidth = ref(0);

// Use pending actions for the "Pending Links" tab
const links = computed(() =>
  createNew.value ? staffLinks.value : pendingActions.value
);

const form = ref<Form>({
  id: null as string | null,
  title: "",
  url: "",
  description: "",
});

// Methods
function updateUnderline() {
  const activeTab = createNew.value ? tab1.value : tab2.value;
  if (activeTab) {
    underlineLeft.value = activeTab.offsetLeft;
    underlineWidth.value = activeTab.offsetWidth;
  }
}

function clearMessages() {
  error.value = "";
  success.value = "";
}

async function addLink(formData: any) {
  if (isProcessing.value) return;

  isProcessing.value = true;
  clearMessages();

  try {
    await createLink({
      name: formData.title,
      description: formData.description,
      url: formData.url,
      image: formData.imageFile || undefined, // Use undefined if no file selected
    });

    success.value = "Link submitted for review";

    // Reset form
    form.value = {
      id: null,
      title: "",
      url: "",
      description: "",
    };

    // Refresh data to show updated lists
    await Promise.all([fetchStaffLinks(), fetchPendingActions()]);
  } catch (err: any) {
    error.value = err.message || "Failed to create link";
  } finally {
    isProcessing.value = false;
  }
}

async function deleteLink(id: number | string) {
  if (confirm("Submit this link for deletion? It will need admin approval.")) {
    try {
      await submitDeleteRequest(String(id));
      success.value = "Delete request submitted for approval";

      // Refresh the data
      if (createNew.value) {
        await fetchStaffLinks();
      } else {
        await fetchPendingActions();
      }
    } catch (err: any) {
      error.value = err.message || "Failed to submit delete request";
    }
  }
}

function editLink(link: any) {
  form.value = {
    id: link.id,
    title: link.name || link.title,
    url: link.url,
    image: link.img || link.image,
    description: link.description,
  };
  editing.value = true;
}

function cancelEdit() {
  editing.value = false;
  form.value = {
    id: null,
    title: "",
    url: "",
    description: "",
  };
}

async function updateLink(formData: any) {
  if (isUploading.value || !formData.id) return;

  isUploading.value = true;
  clearMessages();

  try {
    await submitEditRequest(String(formData.id), {
      name: formData.title,
      description: formData.description,
      url: formData.url,
      image: formData.imageFile || formData.image || "", // Use file if available, otherwise existing image
    });
    success.value = "Edit request submitted for approval";
    editing.value = false;

    // Reset form
    form.value = {
      id: null,
      title: "",
      url: "",
      description: "",
    };

    // Refresh data
    if (createNew.value) {
      await fetchStaffLinks();
    } else {
      await fetchPendingActions();
    }
  } catch (err: any) {
    error.value = err.message || "Failed to submit edit request";
  } finally {
    isUploading.value = false;
  }
}

// Watch for tab changes
watch(createNew, () => {
  nextTick(() => {
    updateUnderline();

    // Fetch appropriate data
    if (createNew.value) {
      fetchStaffLinks().then(() => {
        console.log("Staff links fetched:", staffLinks.value);
      });
    } else {
      fetchPendingActions().then(() => {
        console.log("Pending actions fetched:", pendingActions.value);
      });
    }
  });
});

// Initialize on mount
onMounted(async () => {
  try {
    await authStore.fetchUser();
    authStore.listenToAuthChanges();

    // Fetch both staff links and pending actions
    await Promise.all([fetchStaffLinks(), fetchPendingActions()]);

    nextTick(() => {
      updateUnderline();
    });
  } catch (error) {
    console.log("User not authenticated");
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateUnderline);
});
watch(createNew, () => {
  nextTick(() => {
    updateUnderline();
  });
});
</script>

<style scoped></style>
