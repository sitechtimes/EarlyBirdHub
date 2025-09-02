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

        <div class="flex buttons-container w-full md:mt-5 mt-3 md:gap-5 gap-3">
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLScT7wEZymQjetHzCAvl2tpN1Bxi7NEOknUiZ833R8R8ckl84g/viewform"
            target="_blank"
            rel="noopener noreferrer"
            class="button md:py-2 md:px-4 md:rounded-md flex flex-1 items-center justify-center flex-col text-center font-semibold md:text-xl text-xs border-2 border-gold text-white py-1 px-2 rounded transition-all duration-500 relative"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-10 h-1/2 text-gold"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M21 7.5V16.5C21 17.3284 20.3284 18 19.5 18C18.6716 18 18 17.3284 18 16.5V15H7.5C6.11929 15 5 13.8807 5 12.5V11.5C5 10.1193 6.11929 9 7.5 9H18V7.5C18 6.67157 18.6716 6 19.5 6C20.3284 6 21 6.67157 21 7.5ZM3 12C3 13.6569 4.34315 15 6 15V9C4.34315 9 3 10.3431 3 12ZM9 17C9 17.5523 9.44772 18 10 18C10.5523 18 11 17.5523 11 17V15H9V17Z"
              />
            </svg>
            <span class="h-1/2 justify-center flex items-center"
              >Submit an Announcement</span
            >
          </a>
          <NuxtLink
            to="/dailylinks"
            class="button md:py-2 md:px-4 md:rounded-md flex flex-1 items-center justify-between flex-col text-center font-semibold md:text-xl text-xs border-2 border-gold text-white py-1 px-2 rounded transition-all duration-500 relative"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-10 h-1/2 text-gold"
              fill="currentColor"
              viewBox="0 0 28 28"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke="#CCCCCC"
                stroke-width="0.064"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M 20.53125 2.5625 L 19.84375 3.5 L 14.9375 10.1875 C 12.308594 9.730469 9.527344 10.472656 7.5 12.5 L 6.78125 13.1875 L 12.09375 18.5 L 4 26.59375 L 4 28 L 5.40625 28 L 13.5 19.90625 L 18.8125 25.21875 L 19.5 24.5 C 21.527344 22.472656 22.269531 19.691406 21.8125 17.0625 L 28.5 12.15625 L 29.4375 11.46875 Z M 20.78125 5.625 L 26.375 11.21875 L 20.15625 15.78125 L 19.59375 16.1875 L 19.78125 16.84375 C 20.261719 18.675781 19.738281 20.585938 18.59375 22.1875 L 9.8125 13.40625 C 11.414063 12.261719 13.324219 11.738281 15.15625 12.21875 L 15.8125 12.40625 L 16.21875 11.84375 Z"
                ></path>
              </g>
            </svg>

            <span class="h-1/2 justify-center flex items-center"
              >Daily Links</span
            >
          </NuxtLink>
          <a
            class="button md:py-2 md:px-4 md:rounded-md flex flex-1 items-center justify-center flex-col text-center font-semibold md:text-xl text-xs border-2 border-gold text-white py-1 px-2 rounded transition-all duration-500 relative"
            href="https://docs.google.com/forms/d/e/1FAIpQLSfG87_bTafFrn62Yi-CbAYhYpMWvgjmeWC9c1lJgjpYavI7rg/viewform"
            target="_blank"
            rel="noopener noreferrer"
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
            <span class="h-1/2 justify-center flex items-center"
              >Submit a Sports Announcement</span
            >
          </a>
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

const {
  data: playlist,
  pending,
  error,
  refresh,
} = await useFetch<YouTubePlaylistResponse>("/api/playlist");

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
