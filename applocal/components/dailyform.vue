<template>
  <form
    @submit.prevent="handleSubmit"
    class="flex flex-col items-center w-full md:w-3/4 gap-4 bg-white p-5 rounded-3xl"
  >
    <h3 class="font-bold text-2xl">Link Form</h3>

    <Input
      class="w-4/5 border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold text-black"
      v-model="localForm.title"
      input-type="text"
      placeholder="Title"
    />
    <Input
      v-model="localForm.url"
      input-type="text"
      placeholder="URL"
      class="w-4/5 border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold text-black"
    />
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      @change="handleFileSelect"
      class="w-4/5 p-2 border border-gray-300 bg-white text-black rounded focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold"
    />
    <textarea
      v-model="localForm.description"
      placeholder="Description"
      class="w-4/5 p-2 border border-gray-300 bg-white text-black rounded focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold"
    ></textarea>
    <button
      type="submit"
      class="bg-gold text-black font-bold py-3 px-9 rounded-full"
    >
      Add Link
    </button>
  </form>
</template>

<script setup lang="ts">
import type { Form } from "~/utils/interfaces";
import { ref } from "vue";

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

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0];
  }
}

function handleSubmit() {
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
