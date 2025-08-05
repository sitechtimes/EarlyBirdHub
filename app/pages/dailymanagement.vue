<template>
  <div class="min-h-screen bg-black text-gold p-6 space-y-10">
    <h1 class="text-3xl font-bold border-b border-gold pb-3 pt-3">Manage Daily Links</h1>

    <!-- Create New Link -->
    <form @submit.prevent="addLink" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input v-model="form.title" type="text" placeholder="Title" class="bg-zinc-900 p-2 rounded border border-gold" />
      <input v-model="form.url" type="url" placeholder="URL" class="bg-zinc-900 p-2 rounded border border-gold" />
      <input v-model="form.image" type="text" placeholder="Image URL" class="bg-zinc-900 p-2 rounded border border-gold" />
      <input v-model="form.description" type="text" placeholder="Description" class="bg-zinc-900 p-2 rounded border border-gold" />
      <input v-model="form.date" type="date" class="bg-zinc-900 p-2 rounded border border-gold" />
      <button type="submit" class="bg-gold text-black font-bold py-2 px-4 rounded self-end">Add Link</button>
    </form>

    <!-- Manage Existing Links -->
    <div v-if="links.length" class="space-y-6">
      <h2 class="text-2xl font-semibold mt-10">Existing Links</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div
          v-for="link in links"
          :key="link.id"
          class="border border-gold p-3 rounded-xl space-y-2 bg-zinc-950"
        >
          <img v-if="link.image" :src="link.image" alt="" class="w-full h-28 object-cover rounded" />
          <h3 class="font-bold text-lg">{{ link.title }}</h3>
          <p class="text-sm text-gold/80">{{ link.description }}</p>
          <a :href="link.url" target="_blank" class="text-sm text-blue-400 underline break-words">{{ link.url }}</a>
          <p class="text-xs italic text-gold/60">Until: {{ new Date(link.date).toDateString() }}</p>

          <div class="flex justify-end gap-2">
            <button @click="editLink(link)" class="text-yellow-400 underline text-sm">Edit</button>
            <button @click="deleteLink(link.id)" class="text-red-400 underline text-sm">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="editing" class="fixed inset-0 bg-black/80 flex items-center justify-center">
      <form @submit.prevent="updateLink" class="bg-zinc-900 p-6 rounded-xl border border-gold w-[90%] max-w-lg space-y-4">
        <h2 class="text-xl font-bold border-b border-gold pb-2">Edit Link</h2>
        <input v-model="form.title" type="text" class="w-full bg-black border border-gold p-2 rounded" />
        <input v-model="form.url" type="url" class="w-full bg-black border border-gold p-2 rounded" />
        <input v-model="form.image" type="text" class="w-full bg-black border border-gold p-2 rounded" />
        <input v-model="form.description" type="text" class="w-full bg-black border border-gold p-2 rounded" />
        <input v-model="form.date" type="date" class="w-full bg-black border border-gold p-2 rounded" />
        <div class="flex justify-between">
          <button type="submit" class="bg-gold text-black px-4 py-2 rounded font-bold">Save</button>
          <button @click="cancelEdit" class="text-gold underline px-4 py-2">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

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
  }
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
];const nextId = ref(1)

const form = ref({
  id: null,
  title: '',
  url: '',
  image: '',
  description: '',
  date: ''
})

const editing = ref(false)

function addLink() {
  if (!form.value.title || !form.value.url || !form.value.date) return

  links.value.push({ ...form.value, id: nextId.value++ })
  resetForm()
}

function deleteLink(id) {
  links.value = links.value.filter((link) => link.id !== id)
}

function editLink(link) {
  form.value = { ...link }
  editing.value = true
}

function updateLink() {
  const index = links.value.findIndex((l) => l.id === form.value.id)
  if (index !== -1) {
    links.value[index] = { ...form.value }
  }
  cancelEdit()
}

function cancelEdit() {
  resetForm()
  editing.value = false
}

function resetForm() {
  form.value = {
    id: null,
    title: '',
    url: '',
    image: '',
    description: '',
    date: ''
  }
}
</script>

<style scoped>
input {
  color: gold;
}
</style>
