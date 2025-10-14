<template>
  <div
    class="mainpage overflow-y-scroll w-full h-screen items-center relative overflow-hidden p-3"
  >
    <ClientOnly>
      <div class="absolute inset-0 pointer-events-none">
        <Seagull
          ref="seagull1"
          class="md:visible invisible seagull seagull-1 scale-x-[-1]"
          :style="{ '--random-y': randomY1 + '%' }"
        />
        <Seagull
          ref="seagull2"
          class="md:visible invisible seagull seagull-2 scale-x-[-1]"
          :style="{ '--random-y': randomY2 + '%' }"
        />
        <Seagull
          ref="seagull3"
          class="md:visible invisible seagull seagull-3 scale-x-[-1]"
          :style="{ '--random-y': randomY3 + '%' }"
        />
      </div>
    </ClientOnly>

    <div class="flex flex-col items-center mb-6 relative">
      <h2 class="text-2xl font-bold text-center text-[#d7d4c8]">
        Today's Early Bird
      </h2>
      <h3 class="text-center text-gold">
        Staten Island Tech Morning Broadcast
      </h3>
    </div>

    <div v-if="pending" class="text-center">
      <p>Loading video...</p>
    </div>

    <div v-else-if="error" class="text-red-500">
      <p>{{ error }}</p>
    </div>

    <div v-else-if="playlist?.items" class="w-full flex flex-col items-center">
      <div
        v-for="item in playlist.items"
        :key="item.id"
        class="video-container rounded-lg w-fit"
      >
        <a
          :href="`https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`"
          target="_blank"
          rel="noopener noreferrer"
          class="relative block group overflow-hidden"
        >
          <img
            :src="item.snippet.thumbnails.maxres.url"
            :alt="item.snippet.title"
            class="w-full h-auto object-cover rounded-md md:h-[32rem] border-2 border-gold block"
            loading="lazy"
          />
          <div
            class="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div
              class="bg-black bg-opacity-60 rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-opacity-80 transition-all duration-200 pointer-events-auto"
            >
              <img src="/play-button.svg" alt="Play" class="w-8 h-8" />
            </div>
          </div>
        </a>

        <div class="flex buttons-container w-full md:mt-5 mt-3 md:gap-5 gap-3">
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLScT7wEZymQjetHzCAvl2tpN1Bxi7NEOknUiZ833R8R8ckl84g/viewform"
            target="_blank"
            rel="noopener noreferrer"
            class="button md:py-2 md:px-4 md:rounded-md flex flex-1 items-center justify-center flex-col text-center font-semibold md:text-xl text-xs border-2 border-gold text-white py-1 px-2 rounded transition-all duration-500 relative"
          >
            <img
              src="/announcement.svg"
              alt="Announcement"
              class="w-10 h-1/2"
            />
            <span class="h-1/2 justify-center flex items-center"
              >Submit an Announcement</span
            >
          </a>
          <a
            class="button md:py-2 md:px-4 md:rounded-md flex flex-1 items-center justify-center flex-col text-center font-semibold md:text-xl text-xs border-2 border-gold text-white py-1 px-2 rounded transition-all duration-500 relative"
            href="https://docs.google.com/forms/d/e/1FAIpQLSfG87_bTafFrn62Yi-CbAYhYpMWvgjmeWC9c1lJgjpYavI7rg/viewform"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/sports.svg" alt="Sports" class="w-10 h-10" />
            <span class="h-1/2 justify-center flex items-center"
              >Submit a Sports Announcement</span
            >
          </a>
          <NuxtLink
            to="/dailylinks"
            class="button md:py-2 md:px-4 md:rounded-md flex flex-1 items-center justify-between flex-col text-center font-semibold md:text-xl text-xs border-2 border-gold text-white py-1 px-2 rounded transition-all duration-500 relative"
          >
            <img
              src="/rocket.svg"
              alt="Daily Announcements"
              class="w-10 h-1/2"
            />

            <span class="h-1/2 justify-center flex items-center"
              >Daily Announcements</span
            >
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface YouTubePlaylistItem {
  id: string;
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: {
      maxres: {
        url: string;
      };
    };
    resourceId: {
      kind: string;
      videoId: string;
    };
  };
}

interface YouTubePlaylistResponse {
  items: YouTubePlaylistItem[];
}

useHead({
  title: "EarlyBirdHub",
});

const {
  data: playlist,
  pending,
  error,
  refresh,
} = await useFetch<YouTubePlaylistResponse>("/api/playlist");
if (playlist.value?.items) {
  playlist.value.items = playlist.value.items
    .filter(item => item.snippet.title !== "Deleted video")
    .slice(0, 1);
}
const useNavBarStore = useNavbarStore();
const randomY1 = ref(50);
const randomY2 = ref(50);
const randomY3 = ref(50);

const isClient = ref(false);

const updateRandomPositions = () => {
  if (isClient.value) {
    randomY1.value = Math.random() * 70 + 10;
    randomY2.value = Math.random() * 70 + 10;
    randomY3.value = Math.random() * 70 + 10;
  }
};

onMounted(async () => {
  isClient.value = true;
  updateRandomPositions();

  setInterval(() => {
    if (isClient.value) {
      randomY1.value = Math.random() * 70 + 10;
    }
  }, 5000);

  setInterval(() => {
    if (isClient.value) {
      randomY2.value = Math.random() * 70 + 10;
    }
  }, 6000);

  setInterval(() => {
    if (isClient.value) {
      randomY3.value = Math.random() * 70 + 10;
    }
  }, 7000);
});
</script>

<style scoped>
.seagull {
  position: absolute;
  top: var(--random-y, 50%);
  font-size: 2rem;
  opacity: 0;
  animation: flyAcross 10s linear infinite;
  transition: top 4s ease-in-out;
}

.seagull-1 {
  animation-delay: 0s;
  animation-duration: 5s;
}

.seagull-2 {
  animation-delay: 3s;
  animation-duration: 6s;
}

.seagull-3 {
  animation-delay: 2s;
  animation-duration: 7s;
}

@keyframes flyAcross {
  0% {
    left: -100px;
    opacity: 1;
  }

  90% {
    opacity: 0.1;
  }
  100% {
    left: 100vw;
    opacity: 0;
  }
}
</style>
