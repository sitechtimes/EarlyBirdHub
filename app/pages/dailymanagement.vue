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
      <div v-if="links.length && createNew == false" class="space-y-6">
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10 md:m-12"
        >
          <cardTemplate
            v-for="link in links"
            :page="'Pending'"
            :admin="false"
            :link="link"
            @edit="editLink"
            @delete="deleteLink"
          />
        </div>
      </div>
    </div>
    <div
      v-else
      class="min-h-screen w-full flex items-center justify-center bg-black text-gold px-4"
    >
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
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from "vue";
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
  fetchStaffLinks,
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
const isProcessing = ref(false); // Add processing state
const selectedFile = ref<File | null>(null);
const createNew = ref(true);
const tab1 = ref<HTMLElement | null>(null); //start as null, then assigned to DOM elements
const tab2 = ref<HTMLElement | null>(null);
const underlineLeft = ref(0);
const underlineWidth = ref(0);

function updateUnderline() {
  const activeTab = createNew.value ? tab1.value : tab2.value;
  if (activeTab) {
    underlineLeft.value = activeTab.offsetLeft;
    underlineWidth.value = activeTab.offsetWidth;
  }
}

const form = ref({
  id: null as string | null,
  title: "",
  url: "",
  description: "",
  date: "",
});

// Methods
function navigateToAdmin() {
  navigateTo("/admin");
const editing = ref(false);


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
    await authStore.signIn(email.value, password.value);
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
    await createLink({
      name: form.value.title,
      description: form.value.description,
      url: form.value.url,
      date: form.value.date,
      image: selectedFile.value,
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
      date: form.value.date,
    };

    if (selectedFile.value) {
      updateData.img = selectedFile.value; // Pass the File object directly
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

// Initialize authentication on component mount
onMounted(async () => {
  try {
    await authStore.fetchUser();
    authStore.listenToAuthChanges();
  } catch (error) {
    console.log("User not authenticated");
  }
});
</script>
onMounted(() => {
  updateUnderline();
  window.addEventListener("resize", updateUnderline);
  links.value.forEach((link) => {
    if (link.img) {
      const img = new Image();
      img.src = link.img;
    }
  });
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
