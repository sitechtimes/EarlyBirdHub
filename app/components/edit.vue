<template>
  <form
    @submit.prevent="handleSubmit"
    class="bg-zinc-900 p-8 flex flex-col rounded-xl bg-black/30 backdrop-blur border border-gold w-[90%] max-w-lg space-y-4"
  >
    <div
      class="border-b border-gold p-2 flex items-center w-full justify-between"
    >
      <h2 class="text-xl font-bold">Edit Link</h2>
      <button @click="emit('cancel')" class="flex items-center px-4 py-2">
        <span
          class="absolute w-6 h-1 bg-white rounded-sm rotate-45 origin-center"
        ></span>
        <span
          class="absolute w-6 h-1 bg-white rounded-sm -rotate-45 origin-center"
        ></span>
      </button>
    </div>
    <Input v-model="props.form.title" inputType="text" placeholder="Title" />
    <Input v-model="props.form.url" inputType="text" placeholder="URL" />
    <input
      type="file"
      accept="image/*"
      @change="handleFileSelect"
      class="w-full p-2 border border-gray-300 bg-white text-gold rounded focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold"
    />
    <textarea
      v-model="props.form.description"
      placeholder="Description"
      name="description"
      id=""
    ></textarea>
    <div class="flex self-end">
      <button
        type="submit"
        class="bg-gold text-black px-4 py-2 rounded font-bold"
      >
        Save
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { Form } from "~/types/type";
import { ref } from "vue";

const emit = defineEmits<{
  (e: "edit", form: Form & { imageFile?: File }): void;
  (e: "cancel"): void;
}>();
const props = defineProps<{
  form: Form;
}>();

const selectedFile = ref<File | null>(null);

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0];
  }
}

function handleSubmit() {
  const formData = {
    ...props.form,
    imageFile: selectedFile.value || undefined,
  };
  emit("edit", formData);
}
</script>

<style scoped></style>
