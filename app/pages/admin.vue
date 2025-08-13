<template>
  <div class="w-full h-full flex flex-col items-center">
    <!-- Dropdown -->
    <div class="w-full flex justify-center relative mt-5">
      <button
        @click="open = !open"
        class="w-1/2 flex justify-between items-center bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-700 shadow-sm hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      >
        {{ selected || "Pending" }}
        <i
          class="fa-solid fa-caret-up text-gold transition-transform"
          :class="{ 'rotate-180': open }"
        ></i>
      </button>
      <transition name="fade">
        <div
          v-if="open"
          class="absolute top-full mt-2 w-1/2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50"
        >
          <div
            v-for="(option, index) in options"
            :key="index"
            @click="selectOption(option)"
            :class="[
              'px-4 py-2 cursor-pointer select-none font-medium',
              option.disabled
                ? 'text-gray-400 cursor-not-allowed'
                : 'hover:bg-gray-100 text-gray-700 font-medium',
            ]"
          >
            {{ option.label }}
          </div>
        </div>
      </transition>
    </div>
    <button
      @click=""
      v-if="selected === 'Update'"
      class="p-2 bg-white rounded-lg text-gold w-1/2 mt-5"
    >
      Update Website
    </button>
    <!-- Cards -->
    <div class="p-16">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <cardTemplate
          v-for="link in links"
          :key="link.id"
          :link="link"
          :page="page"
          :admin="true"
          @edit="editLink"
          @delete="deleteLink"
        />
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
import { ref } from "vue";
import cardTemplate from "~/components/cardTemplate.vue";

type Status = "Pending" | "Approved" | "Update";
const form = ref({
  id: null,
  title: "",
  url: "",
  image: "",
  description: "",
  date: "",
});

const editing = ref(false);
const page = ref<Status>("Pending");
const open = ref(false);
const selected = ref<string | null>(null);

const options = [
  { label: "Pending", disabled: false },
  { label: "Approved", disabled: false },
  { label: "Update", disabled: false },
];

const links = ref<DailyLink[]>([
  {
    id: 1,
    title: "School Spirit Day Flyer",
    url: "https://example.com/spiritday",
    image: "",
    description: "Wear your house colors this Friday!",
    date: new Date("2025/08/05").toDateString(),
  },
  {
    id: 2,
    title: "Math Club Meeting",
    url: "https://example.com/mathclub",
    image:
      "https://www.istockphoto.com/photo/cute-ginger-cat-gm1443562748-482502032",
    description: "Join us after school in Room 204.",
    date: new Date("2025/08/04").toDateString(),
  },
  {
    id: 3,
    title: "SAT Registration Deadline",
    url: "https://example.com/sat",
    image:
      "https://media.istockphoto.com/id/1443562748/photo/cute-ginger-cat.jpg?s=612x612&w=0&k=20&c=vvM97wWz-hMj7DLzfpYRmY2VswTqcFEKkC437hxm3Cg=",
    date: new Date("2025/07/28").toDateString(),
  },
  {
    id: 4,
    title: "Science Fair Registration",
    url: "https://example.com/sciencefair",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    description: "Sign up by August 1st to participate.",
    date: new Date("2025/08/01").toDateString(),
  },
  {
    id: 5,
    title: "Drama Club Auditions",
    url: "https://example.com/drama",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    description: "Auditions held in the auditorium after school.",
    date: new Date("2025/08/02").toDateString(),
  },
  {
    id: 6,
    title: "Chess Tournament",
    url: "https://example.com/chess",
    image: "",
    description: "Register your team by August 3rd.",
    date: new Date("2025/08/03").toDateString(),
  },
  {
    id: 7,
    title: "Art Exhibition",
    url: "https://example.com/art",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b",
    description: "Visit the art room to see student work.",
    date: new Date("2025/08/04").toDateString(),
  },
  {
    id: 8,
    title: "Football Tryouts",
    url: "https://example.com/football",
    image: "",
    description: "Tryouts start at 3:30pm on the field.",
    date: new Date("2025/08/05").toDateString(),
  },
  {
    id: 9,
    title: "Library Book Return",
    url: "https://example.com/library",
    image: "",
    description: "Return overdue books by August 2nd.",
    date: new Date("2025/08/02").toDateString(),
  },
  {
    id: 10,
    title: "Parent-Teacher Conferences",
    url: "https://example.com/conferences",
    image: "https://images.unsplash.com/photo-1513258496099-48168024aec0",
    description: "Schedule your meeting online.",
    date: new Date("2025/08/03").toDateString(),
  },
  {
    id: 11,
    title: "Yearbook Orders",
    url: "https://example.com/yearbook",
    image: "",
    description: "Order your yearbook before August 4th.",
    date: new Date("2025/08/04").toDateString(),
  },
  {
    id: 12,
    title: "Volunteer Sign-Up",
    url: "https://example.com/volunteer",
    image: "",
    description: "Help out at upcoming school events.",
    date: new Date("2025/08/05").toDateString(),
  },
]);
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
function updateLink() {
  const index = links.value.findIndex((l) => l.id === form.value.id);
  if (index !== -1) {
    links.value[index] = { ...form.value };
  }
  cancelEdit();
}
function deleteLink(id) {
  links.value = links.value.filter((link) => link.id !== id);
}

function editLink(link) {
  form.value = { ...link };
  editing.value = true;
}
function selectOption(option: { label: string; disabled?: boolean }) {
  if (!option.disabled) {
    selected.value = option.label;
    page.value = option.label as Status;
    open.value = false;
  }
}
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
