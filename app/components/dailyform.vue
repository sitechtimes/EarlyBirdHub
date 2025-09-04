<template>
  <form
    @submit.prevent="handleSubmit"
    class="flex flex-col items-center w-full md:w-3/4 gap-6 bg-white p-5 rounded-3xl shadow-lg"
  >
    <h3 class="font-bold text-3xl text-gray-800 mb-2">Link Form</h3>

    <div class="w-4/5 flex flex-col gap-2">
      <label for="titleInput" class="text-gray-700 font-semibold text-sm">
        Title *
      </label>
      <Input
        id="titleInput"
        class="border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold text-black transition-all duration-200"
        v-model="localForm.title"
        input-type="text"
        placeholder="Enter link title"
        :maxlength="45"
        required
      />
      <div class="text-xs text-gray-500 text-right">
        {{ (localForm.title || '').length }}/45 characters
      </div>
    </div>

    <div class="w-4/5 flex flex-col gap-2">
      <label for="urlInput" class="text-gray-700 font-semibold text-sm">
        URL
      </label>
      <Input
        id="urlInput"
        v-model="localForm.url"
        input-type="text"
        placeholder="https://example.com"
        class="border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold text-black transition-all duration-200"
      />
    </div>

    <div class="w-4/5 flex flex-col gap-2">
      <label for="fileInput" class="text-gray-700 font-semibold text-sm">
        Upload Image
      </label>
      <input
        id="fileInput"
        ref="fileInput"
        type="file"
        accept="image/*"
        @change="handleFileSelect"
        class="p-3 border border-gray-300 bg-white text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gold file:text-black hover:file:bg-yellow-500"
      />
    </div>

    <div class="w-4/5 flex flex-col gap-2">
      <label for="descriptionInput" class="text-gray-700 font-semibold text-sm">
        Description
      </label>
      <textarea
        id="descriptionInput"
        v-model="localForm.description"
        placeholder="Enter a brief description"
        rows="4"
        maxlength="150"
        class="p-3 border border-gray-300 bg-white text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all duration-200 resize-vertical"
      ></textarea>
      <div class="text-xs text-gray-500 text-right">
        {{ (localForm.description || '').length }}/150 characters
      </div>
    </div>

    <button type="submit" class="admin-button">Add Link</button>
  </form>
</template>

<script setup lang="ts">

const props = defineProps<{
  form: Form;
}>();

const emit = defineEmits<{
  (e: "submit", form: Form & { imageFile?: File }): void;
}>();

// Make a local copy of the prop
const localForm = ref({ ...props.form });
const selectedFile = ref<File | null>(null);

const fileInput = useTemplateRef<HTMLInputElement | null>("fileInput");

// Watch for prop changes and update local form
watch(() => props.form, (newForm) => {
  localForm.value = { ...newForm };
}, { deep: true, immediate: true });

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0];
  }
}

function handleSubmit() {
  if ((localForm.value.title ?? '').length > 35) {
    alert("Title is too long (max 35 characters)");
    return;
  }
  if ((localForm.value.description ?? '').length > 150) {
    alert("Description is too long");
    return;
  }
  const formData = {
    ...localForm.value,
    imageFile: selectedFile.value || undefined,
  };
  emit("submit", formData);

  // Clear the form after submission
  localForm.value = {
    id: null,
    title: "",
    url: "",
    description: "",
  };
  selectedFile.value = null;

  // Reset the file input using template ref
  if (fileInput.value) {
    fileInput.value.value = "";
  }
}
</script>

<style scoped></style>
