<template>
  <div
    class="flex-1 bg-black text-gold p-6 md:pr-20 md:pl-20 justify-center items-center"
  >
    <h1
      class="text-4xl text-center w-full font-bold mb-6 border-b border-gold pb-2"
    >
      Daily Announcements
    </h1>

    <div v-if="error" class="text-center text-red-500">
      Error loading links: {{ error }}
    </div>

    <section v-else v-for="(group, index) in groupedLinks" :key="index">
      <div v-if="group.links.length" class="mb-10 w-full border-2 border-black">
        <h2 class="text-2xl font-semibold mb-4">
          {{ group.title }}
        </h2>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-7"
        >
          <CardTemplate
            v-for="link in group.links"
            :card_status="'Approved'"
            :admin="false"
            :link="link"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: "Daily Announcements",
});

const error = ref<string | null>(null);

const response = await useFetch("/api/dailylinks", { server: true });
const userLinks = response.data.value ?? [];

const groupedLinks = computed(() => {
  const todayString = new Date().toLocaleDateString();

  return [
    {
      title: "Recent Announcements",
      links: userLinks.filter(
        (link: DailyLink) =>
          new Date(link.date).toLocaleDateString() === todayString
      ),
    },
    {
      title: "Earlier Announcements",
      links: userLinks.filter(
        (link: DailyLink) =>
          new Date(link.date).toLocaleDateString() !== todayString
      ),
    },
  ];
});
</script>
