<template>
  <div class="min-h-screen bg-black text-gold p-8">
    <h1 class="text-4xl font-bold mb-6 border-b border-gold pb-2">
      Daily Links
    </h1>

    <section v-for="(group, index) in groupedLinks" :key="index" class="mb-10">
      <div v-if="group.links.length > 0">
        <h2 class="text-2xl font-semibold mb-4">{{ group.title }}</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-3 text-sm">
          <div
            v-for="link in group.links"
            :key="link.id"
            class="bg-black border border-gold rounded-xl overflow-hidden shadow-md hover:shadow-gold transition"
          >
            <a :href="link.url" target="_blank" class="block">
              <img
                v-if="link.image !== ''"
                :src="link.image"
                alt=""
                class="w-full h-32 sm:h-36 md:h-48 object-cover"
              />
              <div class="p-2 sm:p-3 md:p-4">
                <h3 class="text-xl font-bold mb-1">{{ link.title }}</h3>
                <p v-if="link.description" class="text-gold/80 text-sm">
                  {{ link.description }}
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
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
