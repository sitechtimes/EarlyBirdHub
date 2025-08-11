<template>
  <div class="flex-1 bg-black text-gold p-8 justify-center items-center">
    <h1 class="text-4xl font-bold mb-6 border-b border-gold pb-2">
      Daily Links
    </h1>

    <section
      v-for="(group, index) in groupedLinks"
      :key="index"
      class="mb-10 md:w-3/4 md:mx-auto"
    >
      <div v-if="group.links.length > 0" class="group-container">
        <h2 class="text-2xl font-semibold mb-4">{{ group.title }}</h2>
        <div
          class="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-3 text-sm card-container"
        >
          <div
            v-for="link in group.links"
            :key="link.id"
            class="bg-black border border-gold rounded-xl overflow-hidden shadow-md hover:shadow-gold transition card"
          >
            <a
              :href="link.url"
              target="_blank"
              class="flex flex-col p-1 h-full"
            >
              <img
                v-if="link.image !== ''"
                :src="link.image"
                alt=""
                class="w-full rounded-lg h-32 sm:h-36 md:h-60 object-cover"
              />
              <div class="p-2 sm:p-3 md:p-4">
                <h3 class="text-xl font-bold mb-1">{{ link.title }}</h3>
                <p v-if="link.description" class="text-gold/80 text-sm">
                  {{ link.description }}
                </p>
              </div>
              <p
                class="text-xs text-gold/60 italic px-2 align-bottom mt-auto self-start"
              >
                {{ link.date }}
              </p>
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const links = [
  {
    id: 1,
    title: "School Spirit Day Flyer",
    url: "https://example.com/spiritday",
    image: "",
    description: "Wear your house colors this Friday!",
    date: new Date("2025/08/06").toDateString(),
  },
  {
    id: 2,
    title: "Math Club Meeting",
    url: "https://example.com/mathclub",
    image: "https://images.unsplash.com/photo-1513258496099-48168024aec0",
    description: "Join us after school in Room 204.",
    date: new Date("2025/08/06").toDateString(),
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
    date: new Date("2025/08/06").toDateString(),
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
</script>
