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
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 m-12">
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

        <label for="email">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          placeholder="Enter your email"
          class="w-full bg-black border border-gold p-2 rounded"
          required
        />

        <label for="password">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          placeholder="Enter your password"
          class="w-full bg-black border border-gold p-2 rounded"
          required
        />

        <div v-if="error" class="text-red-400 text-sm">{{ error }}</div>
        <div v-if="success" class="text-green-400 text-sm">{{ success }}</div>

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
      <form
        @submit.prevent="updateLink"
        class="bg-zinc-900 p-8 flex flex-col rounded-xl bg-black/30 backdrop-blur border border-gold w-[90%] max-w-lg space-y-4"
      >
        <div
          class="border-b border-gold p-2 flex items-center w-full justify-between"
        >
          <h2 class="text-xl font-bold">Edit Link</h2>
          <button @click="cancelEdit" class="flex items-center px-4 py-2">
            <span
              class="absolute w-6 h-1 bg-white rounded-sm rotate-45 origin-center"
            ></span>
            <span
              class="absolute w-6 h-1 bg-white rounded-sm -rotate-45 origin-center"
            ></span>
          </button>
        </div>
        <Input v-model="form.title" inputType="text" placeholder="Title" />
        <Input v-model="form.url" inputType="text" placeholder="URL" />
        <Input v-model="form.image" inputType="text" placeholder="Image URL" />
        <textarea
          v-model="form.description"
          placeholder="Description"
          name="description"
          id=""
        ></textarea>
        <Input v-model="form.date" inputType="date" placeholder="Date" />
        <div class="flex self-end">
          <button
            type="submit"
            class="bg-gold text-black px-4 py-2 rounded font-bold"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from "vue";
import cardTemplate from "~/components/cardTemplate.vue";
import type { Form } from "~/types/type";
import dailyform from "~/components/dailyform.vue";
const userStore = useUserStore();
const loggedIn = computed(() => userStore.loggedIn);
const error = ref("");
const success = ref("");
const email = ref("");
const password = ref("");
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

async function handleLogin() {
  error.value = "";
  success.value = "";
  try {
    const res = await fetch("http://100.101.65.108:8000/api/users/");
    const users = await res.json();
    const user = users.find((u: User) => u.email === email.value);
    if (user) {
      success.value = "Login successful!";
      //userStore.setUser(user);
      userStore.loggedIn = true;
    } else {
      error.value = "Invalid email or password.";
    }
  } catch (e) {
    error.value = "Failed to connect to server.";
  }
}

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

const nextId = ref(1);

const form = ref({
  id: null,
  title: "",
  url: "",
  image: "",
  description: "",
  date: "",
});

const editing = ref(false);

function addLink(submittedForm: Form) {
  if (!submittedForm.title || !submittedForm.url || !submittedForm.date) return;

  links.value.push({ ...submittedForm, id: nextId.value++ });
  resetForm();
}

function deleteLink(id) {
  links.value = links.value.filter((link) => link.id !== id);
}

function editLink(link) {
  form.value = { ...link };
  editing.value = true;
}

function updateLink() {
  const index = links.value.findIndex((l) => l.id === form.value.id);
  if (index !== -1) {
    links.value[index] = { ...form.value };
  }
  cancelEdit();
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
onMounted(() => {
  updateUnderline();
  window.addEventListener("resize", updateUnderline);
  links.value.forEach((link) => {
    if (link.image) {
      const img = new Image();
      img.src = link.image;
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
