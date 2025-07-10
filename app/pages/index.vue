<template>
  <div class="mainpage overflow-y-scroll w-full h-full items-center relative overflow-hidden">
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

    <div class="flex flex-col items-center mb-6 relative z-10">
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
          class="relative block group"
        >
          <img
            :src="item.snippet.thumbnails.maxres.url"
            :alt="item.snippet.title"
            class="w-full object-cover rounded-md md:h-96 border-2 border-gold"
            loading="lazy"
          />
          <div class="absolute inset-0 flex items-center justify-center">
            <div
              class="bg-black bg-opacity-60 rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-opacity-80 transition-all duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <polygon points="8,5 19,12 8,19" />
              </svg>
            </div>
          </div>
        </a>
        <a
            :href="`https://www.youtube.com/playlist?list=PLXdwySAEBRBWocKBDaEE7HCw3rb3EvpeU`"
            target="_blank"
            rel="noopener noreferrer"
            class="button text-center w-full flex items-center justify-center text-lg font-semibold text-white border-2 border-gold py-2 px-4 rounded-md mt-3"
            >
            See past Early Birds on YouTube
          </a>
        <div
          class="flex buttons-container w-full mt-5 gap-5"
        >
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLScT7wEZymQjetHzCAvl2tpN1Bxi7NEOknUiZ833R8R8ckl84g/viewform"
            target="_blank"
            class="button flex-1 border-2 font-semibold text-center items-center justify-center border-gold text-white py-2 px-4 rounded-md flex flex-col"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-10 h-10 text-gold"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M21 7.5V16.5C21 17.3284 20.3284 18 19.5 18C18.6716 18 18 17.3284 18 16.5V15H7.5C6.11929 15 5 13.8807 5 12.5V11.5C5 10.1193 6.11929 9 7.5 9H18V7.5C18 6.67157 18.6716 6 19.5 6C20.3284 6 21 6.67157 21 7.5ZM3 12C3 13.6569 4.34315 15 6 15V9C4.34315 9 3 10.3431 3 12ZM9 17C9 17.5523 9.44772 18 10 18C10.5523 18 11 17.5523 11 17V15H9V17Z"
              />
            </svg>
            Submit an Announcement
          </a>
          <a
            class="button font-semibold text-center flex-1 border-2 items-center border-gold text-white py-2 px-4 rounded-md flex flex-col"
            href="https://docs.google.com/forms/d/e/1FAIpQLSfG87_bTafFrn62Yi-CbAYhYpMWvgjmeWC9c1lJgjpYavI7rg/viewform"
            target="_blank"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-10 h-10 text-gold"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <circle
                cx="12"
                cy="14"
                r="5"
                stroke="currentColor"
                stroke-width="2"
                fill="none"
              />
              <path
                d="M7 4l5 7 5-7"
                stroke="currentColor"
                stroke-width="2"
                fill="none"
              />
              <rect
                x="6"
                y="2"
                width="3"
                height="4"
                rx="1"
                fill="currentColor"
              />
              <rect
                x="15"
                y="2"
                width="3"
                height="4"
                rx="1"
                fill="currentColor"
              />
            </svg>
            Submit a Sports Announcement
          </a>
          <a class="button font-semibold text-center flex-1 border-2 items-center border-gold text-white py-2 px-4 rounded-md flex flex-col"
            href="https://www.youtube.com/@SITMorningBroadcast"
            target="_blank">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-10 h-10 text-gold"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="10" r="4" />
              <path d="M2 20c0-4.418 4.03-8 9-8s9 3.582 9 8" fill="none" stroke="currentColor" stroke-width="2"/>
              <path d="M17 8c1.657 0 3 1.343 3 3" fill="none" stroke="currentColor" stroke-width="2"/>
              <path d="M17 5c3.314 0 6 2.686 6 6" fill="none" stroke="currentColor" stroke-width="2"/>
            </svg>
            Submit Name Pronunciation
          </a>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Seagull from "~/components/Seagull.vue";

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

const {
  data: playlist,
  pending,
  error,
  refresh,
} = await useFetch<YouTubePlaylistResponse>("/api/playlist");

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

onMounted(() => {
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
