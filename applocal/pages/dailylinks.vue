<template>
  <div class="flex-1 bg-black text-gold p-6 justify-center items-center">
    <h1
      class="text-4xl text-center w-full font-bold mb-6 border-b border-gold pb-2"
    >
      Daily Announcements
    </h1>

    <div v-if="error" class="text-center text-red-500">
      Error loading links: {{ error }}
    </div>

    <section v-else v-for="(group, index) in groupedLinks" :key="index">
      <div
        v-if="group.links.length > 0"
        class="mb-10 w-full border-2 border-black"
      >
        <h2 class="text-2xl font-semibold mb-4">
          {{ group.title }}
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-7">
          <CardTemplate
            v-if="group.links.length > 0"
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

const error = ref<any>(null);

const response = await useFetch("/api/dailylinks", { server: true });
const userLinks = response.data.value ?? []; // unwrap the ref by .value

const groupedLinks = computed(() => {
  const links = userLinks || [];
  const todayString = new Date().toLocaleDateString();

  if (!links || links.length === 0) {
    return [
      { title: "Today's Announcements", links: [] },
      { title: "Earlier Announcements", links: [] },
    ];
  }

  return [
    {
      title: "Today's Announcements",
      links: links.filter(
        (link: any) => new Date(link.date).toLocaleDateString() === todayString
      ),
    },
    {
      title: "Earlier Announcements",
      links: links.filter(
        (link: any) => new Date(link.date).toLocaleDateString() !== todayString
      ),
    },
  ];
});
</script>
