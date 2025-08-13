<template>
  <div
    class="h-full border-[1px] border-white pt-32 rounded-3xl overflow-hidden bg-cover bg-center relative text-white shadow-lg"
    :style="{
      backgroundImage: props.link.image ? `url(${props.link.image})` : 'none',
      backgroundColor: props.link.image ? '' : 'white',
    }"
  >
    <div
      class="absolute inset-0 bg-gradient-to-t backdrop-blur-100 from-black/70 via-black/10 to-transparent z-0"
    ></div>
    <div class="relative p-5 flex flex-col justify-end h-full space-y-2">
      <div class="flex items-center justify-between">
        <h3 class="text-xl font-semibold">{{ props.link.title }}</h3>
      </div>
      <p class="text-sm text-white/80">
        {{ props.link.description || "No description provided." }}
      </p>
      <div class="flex flex-wrap gap-2 text-sm">
        <h4 class="bg-black/30 text-white px-2 py-1 rounded-full">
          Date: {{ props.link.date }}
        </h4>
        <h4 class="bg-black/30 text-white px-2 py-1 rounded-full">
          {{ props.link.url }}
        </h4>
      </div>
      <div class="flex w-full gap-2">
        <button
          v-if="props.page === 'Pending' && props.admin === true"
          class="mt-4 w-full bg-gold text-black font-semibold py-2 rounded-full hover:bg-white duration-200 transition"
        >
          Approve
        </button>
        <button
          v-if="props.page === 'Pending' && props.admin === true"
          class="mt-4 w-full bg-gold text-black font-semibold py-2 rounded-full hover:bg-white duration-200 transition"
        >
          Decline
        </button>
        <button
          v-if="
            (props.page === 'Pending' && props.admin === false) ||
            props.page === 'Approved' ||
            props.page === 'Update'
          "
          @click="emit('edit', props.link)"
          class="text-black font-medium cursor-pointer py-2 w-full bg-gold rounded-full"
        >
          Edit
        </button>
        <button
          v-if="
            (props.page === 'Pending' && props.admin === false) ||
            props.page === 'Approved' ||
            props.page === 'Update'
          "
          @click="emit('delete', props.link.id)"
          class="relative group cursor-pointer flex-col h-10 aspect-square bg-gold rounded-full gap-[1px] flex items-center justify-center"
        >
          <div
            class="flex flex-col items-center justify-center transition-all duration-200 group-hover:-translate-y-[2px]"
          >
            <span
              class="w-3 h-1 bg-black rounded-sm transform"
              style="clip-path: polygon(20% 40%, 80% 40%, 100% 100%, 0% 100%)"
            ></span>
            <span class="w-5 h-1 bg-black rounded"></span>
          </div>
          <div
            class="w-4 h-[18px] bg-black rounded-b-[4px] transition-transform duration-300"
            style="clip-path: polygon(0% 0%, 100% 0%, 95% 100%, 5% 100%)"
          ></div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Link {
  id: number;
  title: string;
  url?: string;
  image?: string;
  description?: string;
  date: string;
  approved?: boolean;
}

const props = defineProps<{
  link: Link;
  page: "Pending" | "Approved" | "Update";
  admin: boolean;
}>();

const emit = defineEmits<{
  (e: "edit", link: Link): void;
  (e: "delete", id: number): void;
}>();
</script>

<style scoped></style>
