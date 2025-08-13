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
                v-if="link.img !== null"
                :src="link.img"
                alt=""
                class="w-full rounded-lg h-32 sm:h-36 md:h-60 object-cover"
              />
              <div class="p-2 sm:p-3 md:p-4">
                <h3 class="text-xl font-bold mb-1">{{ link.name }}</h3>
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
const response = await useFetch("/api/dailylinks", { server: true });
const userLinks = response.data.value ?? []; // unwrap the ref by .value

const todayString = new Date().toLocaleDateString();

const groupedLinks = computed(() => {
  if (!userLinks || userLinks.length === 0) {
    return [
      { title: "Today's Links", links: [] },
      { title: "Earlier Links", links: [] },
    ];
  }

  return [
    {
      title: "Today's Links",
      links: userLinks.filter(
        (link: any) => new Date(link.date).toLocaleDateString() === todayString
      ),
    },
    {
      title: "Earlier Links",
      links: userLinks.filter(
        (link: any) => new Date(link.date).toLocaleDateString() !== todayString
      ),
    },
  ];
});
</script>
