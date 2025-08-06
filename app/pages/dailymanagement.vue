<template>
  <div
    class="min-h-screen w-full flex items-center justify-center bg-black text-gold px-4"
    v-if="!LoggedIn"
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
    class="min-h-screen bg-black text-gold p-6 space-y-10 md:w-3/4 mx-auto"
    v-else
  >
    <h1 class="text-3xl font-bold border-b border-gold pb-3 pt-3">
      Manage Daily Links
    </h1>

    <form
      @submit.prevent="addLink"
      class="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <label for="title">Title</label>
      <input
        id="title"
        v-model="form.title"
        type="text"
        placeholder="Title"
        class="bg-zinc-900 p-2 rounded border border-gold"
      />

      <label for="url">URL</label>
      <input
        id="url"
        v-model="form.url"
        type="url"
        placeholder="URL"
        class="bg-zinc-900 p-2 rounded border border-gold"
      />

      <label for="image">Image URL</label>
      <input
        id="image"
        v-model="form.image"
        type="text"
        placeholder="Image URL"
        class="bg-zinc-900 p-2 rounded border border-gold"
      />

      <label for="description">Description</label>
      <input
        id="description"
        v-model="form.description"
        type="text"
        placeholder="Description"
        class="bg-zinc-900 p-2 rounded border border-gold"
      />

      <label for="date">Date</label>
      <input
        id="date"
        v-model="form.date"
        type="date"
        class="bg-zinc-900 p-2 rounded border border-gold"
      />

      <div></div>
      <button
        type="submit"
        class="bg-gold text-black font-bold py-2 px-4 rounded self-end"
      >
        Add Link
      </button>
    </form>

    <!-- Edit Modal -->
    <div
      v-if="editing"
      class="fixed inset-0 bg-black/80 flex items-center justify-center"
    >
      <form
        @submit.prevent="updateLink"
        class="bg-zinc-900 p-6 rounded-xl border border-gold w-[90%] max-w-lg space-y-4"
      >
        <h2 class="text-xl font-bold border-b border-gold pb-2">Edit Link</h2>

        <label for="edit-title">Title</label>
        <input
          id="edit-title"
          v-model="form.title"
          type="text"
          class="w-full bg-black border border-gold p-2 rounded"
        />

        <label for="edit-url">URL</label>
        <input
          id="edit-url"
          v-model="form.url"
          type="url"
          class="w-full bg-black border border-gold p-2 rounded"
        />

        <label for="edit-image">Image URL</label>
        <input
          id="edit-image"
          v-model="form.image"
          type="text"
          class="w-full bg-black border border-gold p-2 rounded"
        />

        <label for="edit-description">Description</label>
        <input
          id="edit-description"
          v-model="form.description"
          type="text"
          class="w-full bg-black border border-gold p-2 rounded"
        />

        <label for="edit-date">Date</label>
        <input
          id="edit-date"
          v-model="form.date"
          type="date"
          class="w-full bg-black border border-gold p-2 rounded"
        />

        <div class="flex justify-between">
          <button
            type="submit"
            class="bg-gold text-black px-4 py-2 rounded font-bold"
          >
            Save
          </button>
          <button @click="cancelEdit" class="text-gold underline px-4 py-2">
            Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- Edit Modal -->
    <div
      v-if="editing"
      class="fixed inset-0 bg-black/80 flex items-center justify-center"
    >
      <form
        @submit.prevent="updateLink"
        class="bg-zinc-900 p-6 rounded-xl border border-gold w-[90%] max-w-lg space-y-4"
      >
        <h2 class="text-xl font-bold border-b border-gold pb-2">Edit Link</h2>
        <input
          v-model="form.title"
          type="text"
          class="w-full bg-black border border-gold p-2 rounded"
        />
        <input
          v-model="form.url"
          type="url"
          class="w-full bg-black border border-gold p-2 rounded"
        />
        <input
          v-model="form.image"
          type="text"
          class="w-full bg-black border border-gold p-2 rounded"
        />
        <input
          v-model="form.description"
          type="text"
          class="w-full bg-black border border-gold p-2 rounded"
        />
        <input
          v-model="form.date"
          type="date"
          class="w-full bg-black border border-gold p-2 rounded"
        />
        <div class="flex justify-between">
          <button
            type="submit"
            class="bg-gold text-black px-4 py-2 rounded font-bold"
          >
            Save
          </button>
          <button @click="cancelEdit" class="text-gold underline px-4 py-2">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
const email = ref("");
const password = ref("");
const error = ref("");
const success = ref("");

const userStore = useUserStore();
const LoggedIn = computed(() => userStore.loggedIn);

async function handleLogin() {
  error.value = "";
  success.value = "";

  try {
    const res = await fetch("http://100.101.65.108:8000/api/users/");
    const users = await res.json();

    const user = users.find((u) => u.email === email.value);

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

const links = [
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
];
const today = new Date();
const groupedLinks = [
  {
    title: "Today’s Links",
    links: links.filter((link) => link.date === today.toDateString()),
  },

  {
    title: "Earlier Links",
    links: links.filter((link) => link.date !== today.toDateString()),
  },
];
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

function addLink() {
  if (!form.value.title || !form.value.url || !form.value.date) return;

  links.value.push({ ...form.value, id: nextId.value++ });
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
</script>

<style scoped>
input {
  color: gold;
}
</style>
