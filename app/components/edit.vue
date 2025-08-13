<template>
  <form
    @submit.prevent="emit('edit', form)"
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
    <Input
      v-model="props.form.image"
      inputType="text"
      placeholder="Image URL"
    />
    <textarea
      v-model="props.form.description"
      placeholder="Description"
      name="description"
      id=""
    ></textarea>
    <Input v-model="props.form.date" inputType="date" placeholder="Date" />
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
interface Form {
  id?: null;
  title?: string;
  url?: string;
  image?: string;
  description?: string;
  date?: string;
}
const emit = defineEmits<{
  (e: "edit", form: Form): void;
  (e: "cancel"): void;
}>();
const props = defineProps<{
  form: Form;
}>();
</script>

<style scoped></style>
