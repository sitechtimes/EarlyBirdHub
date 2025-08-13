<template>
  <form
    @submit.prevent="emit('submit', localForm)"
    class="flex flex-col items-center w-3/4 gap-4 bg-white p-5 rounded-3xl"
  >
    <h3 class="font-bold text-2xl">Link Form</h3>

    <Input
      class="w-[80%] border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold"
      v-model="localForm.title"
      inputType="text"
      placeholder="Title"
    />
    <Input
      v-model="localForm.url"
      inputType="text"
      placeholder="URL"
      class="w-[80%] border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold"
    />
    <Input
      v-model="localForm.image"
      inputType="text"
      placeholder="Image URL"
      class="w-[80%] border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold"
    />
    <Input
      v-model="localForm.date"
      class="w-[80%]"
      inputType="date"
      placeholder="Date"
    />
    <textarea
      v-model="localForm.description"
      placeholder="Description"
      class="w-[80%] p-2 border border-gray-300 bg-white text-gold rounded focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold"
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
import type { Form } from "~/types/type";

const props = defineProps<{
  form: Form;
}>();

const emit = defineEmits<{
  (e: "submit", form: Form): void;
}>();

// Make a local copy of the prop
const localForm = ref({ ...props.form });
</script>

<style scoped></style>
