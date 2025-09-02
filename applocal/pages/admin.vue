<template>
  <div
    class="admin-page w-full h-full flex flex-col items-center min-h-screen bg-black text-gold p-3 pt-10 md:pt-0"
  >
    <div class="w-full flex flex-col items-center mb-8">
      <div
        class="relative flex justify-center w-full gap-2 sm:gap-4 md:gap-8 mb-6 overflow-x-auto"
      >
        <h1
          @click="selectTab('Pending')"
          ref="pendingTab"
          class="text-lg sm:text-xl md:text-2xl font-bold cursor-pointer pb-2 pt-3 px-2 sm: transition-colors duration-200 whitespace-nowrap"
          :class="{
            'text-gold': selected === 'Pending',
            'text-gray-400': selected !== 'Pending',
          }"
        >
          Pending
        </h1>
        <h1
          @click="selectTab('Approved')"
          ref="approvedTab"
          class="text-lg sm:text-xl md:text-2xl font-bold cursor-pointer pb-2 pt-3 px-2 sm: transition-colors duration-200 whitespace-nowrap"
          :class="{
            'text-gold': selected === 'Approved',
            'text-gray-400': selected !== 'Approved',
          }"
        >
          Approved
        </h1>
        <h1
          @click="selectTab('Create')"
          ref="createTab"
          class="text-lg sm:text-xl md:text-2xl font-bold cursor-pointer pb-2 pt-3 px-2 sm: transition-colors duration-200 whitespace-nowrap"
          :class="{
            'text-gold': selected === 'Create',
            'text-gray-400': selected !== 'Create',
          }"
        >
          Create
        </h1>
        <h1
          @click="selectTab('Update')"
          ref="updateTab"
          class="text-lg sm:text-xl md:text-2xl font-bold cursor-pointer pb-2 pt-3 px-2 sm: transition-colors duration-200 whitespace-nowrap"
          :class="{
            'text-gold': selected === 'Update',
            'text-gray-400': selected !== 'Update',
            disabled: authStore.updatingSite,
          }"
        >
          Update
        </h1>
        <div
          class="absolute bottom-0 h-[3px] bg-gold rounded transition-all duration-300 ease-in-out"
          :style="{ left: underlineLeft + 'px', width: underlineWidth + 'px' }"
        ></div>
      </div>
    </div>
    <div v-if="selected === 'Update'" class="w-full flex justify-center mb-8">
      <button @click="updateStatic" class="admin-button">Update Website</button>
    </div>

    <div v-if="selected === 'Create'" class="w-full flex flex-col items-center">
      <DailyForm :form="createForm" @submit="handleCreateLink" />
    </div>

    <div
      v-if="selected === 'Pending' || selected === 'Approved'"
      class="w-full"
    >
      <h2
        v-if="selected === 'Pending'"
        class="text-2xl font-bold text-center mb-6 text-gold"
      >
        Pending Actions
      </h2>
      <h2
        v-if="selected === 'Approved'"
        class="text-2xl font-bold text-center mb-6 text-gold"
      >
        Approved Links
      </h2>

      <div
        v-if="links.length > 0"
        class="gap-6 mb-12 px-4"
        :class="
          selected === 'Pending'
            ? 'grid grid-cols-1 xl:grid-cols-2 gap-8'
            : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 auto-rows-fr'
        "
      >
        <CardTemplate
          v-for="link in links"
          :key="link.id"
          :link="link"
          :card_status="page"
          :admin="true"
          :original-link="
            page === 'Pending' ? getOriginalLink(link) : undefined
          "
          @approve="handleApprove"
          @reject="handleReject"
          @edit="editLink"
          @delete="handleDelete"
        />
      </div>

      <div v-else class="text-center text-gray-400 py-16">
        <div class="max-w-md mx-auto">
          <i class="fa-solid fa-inbox text-6xl mb-4 opacity-50"></i>
          <p class="text-2xl font-semibold mb-2">
            {{
              selected === "Pending"
                ? "No pending actions"
                : "No approved links found"
            }}
          </p>
          <p class="text-base opacity-75">
            {{
              selected === "Pending"
                ? "All clear! No items are waiting for approval."
                : "Start creating content to see it here."
            }}
          </p>
        </div>
      </div>
    </div>
    <div
      v-if="editing"
      class="fixed inset-0 bg-black/60 flex items-center justify-center"
    >
      <Edit :form="form" @edit="updateLink" @cancel="cancelEdit" />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth", "admin"],
});

useHead({
  title: "Admin Dashboard",
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
  title: "",
  url: "",
  image: "",
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
const selected = ref<string>("Pending");
const isProcessing = ref(false);

// Tab refs for underline animation
const pendingTab = ref<HTMLElement | null>(null);
const approvedTab = ref<HTMLElement | null>(null);
const createTab = ref<HTMLElement | null>(null);
const updateTab = ref<HTMLElement | null>(null);
const underlineLeft = ref(0);
const underlineWidth = ref(0);

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

// get the original link for a pending action
const getOriginalLink = (pendingAction: any) => {
  if (!pendingAction.old_id) return null;

  // Look for the original link in the staffLinks
  return (
    staffLinks.value.find((link) => link.id === pendingAction.old_id) || null
  );
};

async function handleApprove(actionId: number) {
  if (isProcessing.value) return;

  isProcessing.value = true;

  try {
    await approveAction(String(actionId));
    alert("Action approved successfully");

    setTimeout(async () => {
      await Promise.all([fetchStaffLinks(), fetchPendingActions()]);
    }, 500);
  } catch (err) {
    alert("Failed to approve action");
    console.error("Approve error:", err);
  } finally {
    isProcessing.value = false;
  }
}

async function handleReject(actionId: number) {
  if (confirm("Reject Link? This action cannot be undone.")) {
    if (isProcessing.value) return;

    isProcessing.value = true;

    try {
      await rejectAction(String(actionId));
      alert("Action rejected successfully");

      setTimeout(async () => {
        await Promise.all([fetchStaffLinks(), fetchPendingActions()]);
      }, 500);
    } catch (err) {
      alert("Failed to reject action");
      console.error("Reject error:", err);
    } finally {
      isProcessing.value = false;
    }
  }
}

function editLink(link: any) {
  form.value = {
    id: link.id,
    title: link.name || link.title || "",
    url: link.url || "",
    image: link.img || link.image || "",
    description: link.description || "",
    date: link.date || "",
  };
  editing.value = true;
}

async function handleDelete(id: number | string) {
  if (confirm("Delete Link? This action cannot be undone.")) {
    if (isProcessing.value) return;

    isProcessing.value = true;
    try {
      await deleteLinkDirect(String(id));
      alert("Link deleted successfully");

      setTimeout(async () => {
        await Promise.all([fetchStaffLinks(), fetchPendingActions()]);
      }, 500);
    } catch (err) {
      alert("Failed to delete link");
      console.error("Delete error:", err);
    } finally {
      isProcessing.value = false;
    }
  }
}

async function updateLink(formData: any) {
  if (isProcessing.value || !formData.id) return;

  isProcessing.value = true;

  try {
    await updateLinkDirect(String(formData.id), {
      name: formData.title || formData.name,
      description: formData.description,
      url: formData.url,
      image: formData.imageFile || formData.image || formData.img || "",
    });
    alert("Link updated successfully");
    cancelEdit();

    setTimeout(async () => {
      await Promise.all([fetchStaffLinks(), fetchPendingActions()]);
    }, 500);
  } catch (err) {
    alert("Failed to update link");
    console.error("Update error:", err);
  } finally {
    isProcessing.value = false;
  }
}

async function handleCreateLink(formData: any) {
  if (isProcessing.value) return;

  isProcessing.value = true;

  try {
    await createLinkDirect({
      name: formData.title,
      description: formData.description,
      url: formData.url,
      image: formData.imageFile || undefined,
    });
    alert("Link created successfully");

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
    alert("Failed to create link");
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
    title: "",
    url: "",
    image: "",
    description: "",
    date: "",
  };
}

function selectTab(tabName: Status) {
  selected.value = tabName;
  page.value = tabName;

  updateUnderline();

  switch (tabName) {
    case "Pending":
      Promise.all([fetchPendingActions(), fetchStaffLinks()]);
      break;
    case "Approved":
      fetchStaffLinks();
      break;
    case "Create":
      break;
  }
}

function updateUnderline() {
  let activeTab: HTMLElement | null = null;

  switch (selected.value) {
    case "Pending":
      activeTab = pendingTab.value;
      break;
    case "Approved":
      activeTab = approvedTab.value;
      break;
    case "Create":
      activeTab = createTab.value;
      break;
    case "Update":
      activeTab = updateTab.value;
      break;
  }

  if (activeTab) {
    underlineLeft.value = activeTab.offsetLeft;
    underlineWidth.value = activeTab.offsetWidth;
  }
}

async function updateStatic() {
  await updateSite();
}

onMounted(async () => {
  try {
    await authStore.fetchUser();
    authStore.listenToAuthChanges();

    // Load both pending actions and staff links for the before/after comparison
    await Promise.all([fetchPendingActions(), fetchStaffLinks()]);

    // Initialize underline position after DOM is ready
    await nextTick();
    updateUnderline();

    // Add resize listener for responsive underline
    window.addEventListener("resize", updateUnderline);
  } catch (error) {
    console.error("Failed to initialize admin page:", error);
  }
});

onBeforeUnmount(() => {
  // Clean up resize listener
  window.removeEventListener("resize", updateUnderline);
});

// Watch for changes in selected tab to update underline
watch(selected, () => {
  nextTick(() => {
    updateUnderline();
  });
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
