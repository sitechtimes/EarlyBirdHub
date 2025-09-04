<template>
  <form
    @submit.prevent="handleSubmit"
    class="bg-white p-8 flex flex-col rounded-3xl shadow-lg border border-gold w-[90%] max-w-lg gap-6"
  >
    <div
      class="border-b border-gold pb-4 flex items-center w-full justify-between"
    >
      <h2 class="text-3xl font-bold text-gray-800">Edit Link</h2>
      <button
        @click="emit('cancel')"
        class="flex items-center px-4 py-2 rounded-lg transition-colors duration-200"
      >
        <span
          class="absolute w-6 h-1 bg-gray-600 rounded-sm rotate-45 origin-center"
        ></span>
        <span
          class="absolute w-6 h-1 bg-gray-600 rounded-sm -rotate-45 origin-center"
        ></span>
      </button>
    </div>
    <div class="flex flex-col gap-2">
      <label for="editTitleInput" class="text-gray-700 font-semibold text-sm">
        Title *
      </label>
      <Input
        id="editTitleInput"
        v-model="form.title"
        input-type="text"
        placeholder="Enter link title"
        :maxlength="45"
        class="border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold text-black transition-all duration-200"
        required
      />
      <div class="text-xs text-gray-500 text-right">
        {{ (form.title || '').length }}/45 characters
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <label for="editUrlInput" class="text-gray-700 font-semibold text-sm">
        URL
      </label>
      <Input
        id="editUrlInput"
        v-model="form.url"
        input-type="text"
        placeholder="https://example.com"
        class="border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold text-black transition-all duration-200"
      />
    </div>
    <div class="flex flex-col gap-2">
      <label for="editFileInput" class="text-gray-700 font-semibold text-sm">
        Upload New Image
      </label>
      <input
        id="editFileInput"
        type="file"
        accept="image/*"
        @change="handleFileSelect"
        class="p-3 border border-gray-300 bg-white text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gold file:text-black hover:file:bg-yellow-500"
      />
    </div>
    <div class="flex flex-col gap-2">
      <label
        for="editDescriptionInput"
        class="text-gray-700 font-semibold text-sm"
      >
        Description
      </label>
      <textarea
        id="editDescriptionInput"
        v-model="form.description"
        placeholder="Enter a brief description"
        rows="4"
        maxlength="150"
        class="p-3 border border-gray-300 bg-white text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all duration-200 resize-vertical"
      ></textarea>
      <div class="text-xs text-gray-500 text-right">
        {{ (form.description || '').length }}/150 characters
      </div>
    </div>
    <div class="flex justify-center pt-4">
      <button
        type="submit"
        class="bg-gold text-black px-8 py-3 rounded-full font-bold hover:bg-yellow-500 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-2xl"
      >
        Save Changes
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: "edit", form: Form & { imageFile?: File }): void;
  (e: "cancel"): void;
}>();
const props = defineProps<{
  form: Form;
}>();

const selectedFile = ref<File | null>(null);

const originalForm = ref(JSON.stringify(props.form));

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0];
  }
}

function handleSubmit() {
  if ((props.form.title ?? '').length > 35) {
    alert("Title is too long (max 35 characters)");
    return;
  }
  if (JSON.stringify(props.form) !== originalForm.value) {
    const formData = {
      ...props.form,
      imageFile: selectedFile.value || undefined,
    };
    emit("edit", formData);
  } else {
    alert("No Changes Detected");
  }
}
</script>

<style scoped></style>
