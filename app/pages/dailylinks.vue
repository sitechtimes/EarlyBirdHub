<template>
  <div class="flex-1 bg-black text-gold p-8 justify-center items-center">
    <h1 class="text-4xl font-bold mb-6 border-b border-gold pb-2">
      Daily Links
    </h1>

    <section
      v-for="(group, index) in groupedLinks"
      :key="index"
      class="mb-10 w-full border-2 border-black"
    >
      <h2 class="text-2xl font-semibold mb-4">{{ group.title }}</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-7">
        <CardTemplate
          v-if="group.links.length > 0"
          v-for="link in group.links"
          :page="'Approved'"
          :admin="false"
          :link="link"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import CardTemplate from "~/components/cardTemplate.vue";
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
