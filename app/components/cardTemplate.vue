<template>
  <div class="card-container justify-items-center">
    <!-- Pending Cards - Show Before/After -->
    <div
      v-if="card_status === 'Pending' && admin"
      @click.stop
      class="flex flex-col gap-2 md:gap-4 max-w-none pending-card p-4 rounded-3xl w-full"
      :class="deletion ? 'bg-error border-2 border-red-500' : 'bg-gray-600'"
    >
      <div class="flex flex-col md:flex-row gap-2 md:gap-4">
        <!-- Original Card (Before) -->
        <div
          class="flex-1 relative"
          @click.stop="pendingLinkBeforeOpened = true"
        >
          <div
            class="absolute top-0 left-0 z-10 text-white px-3 py-1 rounded-lg text-md font-bold backdrop-blur-md bg-black"
          >
            BEFORE
          </div>
          <div
            class="flex flex-col border-[1px] w-full max-w-96 bg-white md:max-w-full h-96 border-white rounded-3xl overflow-hidden bg-cover bg-center relative text-white shadow-lg p-5"
            :style="{
              backgroundImage:
                originalLink?.img && !pendingLinkBeforeOpened
                  ? `url(${originalLink?.img})`
                  : 'none',
              width: pendingLinkBeforeOpened ? '90vw' : '',
              height: pendingLinkBeforeOpened ? '80vh' : '',
              position: pendingLinkBeforeOpened ? 'fixed' : 'relative',
              top: pendingLinkBeforeOpened ? '50%' : 'auto',
              left: pendingLinkBeforeOpened ? '50%' : 'auto',
              transform: pendingLinkBeforeOpened
                ? 'translate(-50%, -50%)'
                : 'none',
              zIndex: pendingLinkBeforeOpened ? 50 : 'auto',
              cursor: pendingLinkBeforeOpened ? '' : 'pointer',
            }"
          >
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-0"
            ></div>

            <!-- Close button for expanded card -->
            <button
              v-if="pendingLinkBeforeOpened"
              @click.stop="closeAllCards"
              class="absolute top-2 right-2 z-20 bg-black hover:bg-black/70 text-white rounded-full w-7 h-7 flex items-center justify-center transition-colors"
            >
              ✕
            </button>

            <img
              v-if="link.img && pendingLinkBeforeOpened"
              :src="originalLink?.img"
              class="object-contain bg-white absolute inset-0 border-2 border-black rounded-3xl md:w-full md:h-full"
            />
            <h3
              class="flex w-fit items-center text-xl font-semibold backdrop-blur-md bg-black/50 text-white px-3 py-2 rounded-xl"
            >
              {{ originalLink?.name }}
            </h3>
            <div class="flex-grow"></div>
            <div class="space-y-2">
              <p
                class="text-sm backdrop-blur-md bg-black/50 w-fit text-white px-3 py-2 rounded-xl"
                v-if="
                  originalLink?.description &&
                  (originalLink?.description.length < 150 || linkOpened)
                "
              >
                {{ originalLink?.description }}
              </p>
              <p
                class="text-sm backdrop-blur-md bg-black/50 w-fit text-white px-3 py-2 rounded-xl"
                v-else-if="originalLink?.description"
              >
                {{ originalLink?.description?.slice(0, 150) }}...
              </p>
              <div class="flex flex-wrap gap-2 text-sm">
                <a
                  v-if="originalLink?.url"
                  :href="originalLink?.url"
                  @click.stop
                  target="_blank"
                  rel="noopener noreferrer"
                  class="backdrop-blur-md bg-black/50 text-white px-3 py-2 rounded-xl"
                >
                  <i class="fa fa-link mr-2"></i>
                  <span class="hover:underline break-all">
                    {{ originalLink?.url }}
                  </span>
                </a>
                <h4
                  class="backdrop-blur-md bg-black/50 text-white px-3 py-2 rounded-xl"
                >
                  <i class="fa fa-calendar mr-2"></i>{{ originalLink?.date }}
                </h4>
              </div>
            </div>
          </div>
        </div>

        <!-- New Card (After) -->
        <div
          class="flex-1 relative break-words pending-card-new"
          @click.stop="!deletion ? (pendingLinkAfterOpened = true) : null"
          :style="{
            cursor: deletion ? 'not-allowed' : '',
          }"
        >
          <div
            class="absolute top-0 left-0 z-10 text-white px-3 py-1 rounded-lg text-md font-bold backdrop-blur-md bg-black"
          >
            AFTER
          </div>
          <div
            class="flex flex-col border-[1px] w-full max-w-96 bg-white md:max-w-full h-96 border-white rounded-3xl overflow-hidden bg-cover bg-center relative text-white shadow-lg p-5"
            :class="
              !link.img
                ? 'bg-gradient-to-br from-green-400 via-blue-500 to-purple-600'
                : ''
            "
            :style="{
              backgroundImage:
                link.img && !pendingLinkAfterOpened && !deletion
                  ? `url(${link.img})`
                  : 'none',
              width: pendingLinkAfterOpened ? '90vw' : '',
              height: pendingLinkAfterOpened ? '80vh' : '',
              position: pendingLinkAfterOpened ? 'fixed' : 'relative',
              top: pendingLinkAfterOpened ? '50%' : 'auto',
              left: pendingLinkAfterOpened ? '50%' : 'auto',
              transform: pendingLinkAfterOpened
                ? 'translate(-50%, -50%)'
                : 'none',
              zIndex: pendingLinkAfterOpened ? 50 : 'auto',
              cursor: pendingLinkAfterOpened || deletion ? '' : 'pointer',
            }"
          >
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-0"
            ></div>

            <!-- Close button for expanded card -->
            <button
              v-if="pendingLinkAfterOpened"
              @click.stop="closeAllCards"
              class="absolute top-2 right-2 z-20 bg-black hover:bg-black/70 text-white rounded-full w-7 h-7 flex items-center justify-center transition-colors"
            >
              ✕
            </button>

            <img
              v-if="link.img && pendingLinkAfterOpened && !deletion"
              :src="link.img"
              class="object-contain bg-white absolute inset-0 border-2 border-black rounded-3xl md:w-full md:h-full"
            />
            <h3
              class="flex w-fit items-center text-xl font-semibold backdrop-blur-md bg-black/50 text-white px-3 py-2 rounded-xl"
            >
              {{ deletion ? "DELETED" : link.name }}
            </h3>
            <div class="flex-grow"></div>
            <div class="space-y-2">
              <p
                class="text-sm backdrop-blur-md bg-black/50 w-fit text-white px-3 py-2 rounded-xl"
                v-if="
                  link.description &&
                  (link.description.length < 150 || linkOpened)
                "
              >
                {{ link.description }}
              </p>
              <p
                class="text-sm backdrop-blur-md bg-black/50 w-fit text-white px-3 py-2 rounded-xl"
                v-else-if="link.description"
              >
                {{ link.description?.slice(0, 150) }}...
              </p>
              <div class="flex flex-wrap gap-2 text-sm">
                <a
                  v-if="link.url"
                  :href="link.url"
                  @click.stop
                  target="_blank"
                  rel="noopener noreferrer"
                  class="backdrop-blur-md bg-black/50 text-white px-3 py-2 rounded-xl"
                >
                  <i class="fa fa-link mr-2"></i>
                  <span class="hover:underline break-all">
                    {{ link.url }}
                  </span>
                </a>
                <h4
                  class="backdrop-blur-md bg-black/50 text-white px-3 py-2 rounded-xl"
                >
                  <i class="fa fa-calendar mr-2"></i>{{ link.date }}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Action Buttons for Pending Cards -->
      <div class="flex w-full gap-2 md:mt-2 justify-center">
        <button
          @click.stop="emit('approve', link.id)"
          class="admin-button text-xs md:text-lg w-1/2 mt-0"
        >
          <i class="fa fa-check mr-2"></i>Approve
        </button>
        <button
          @click.stop="emit('reject', link.id)"
          class="admin-button text-xs md:text-lg w-1/2 mt-0"
        >
          <i class="fa fa-times mr-2"></i>
          Reject
        </button>
      </div>
    </div>

    <!-- Regular Cards (Non-Pending so Approved) -->
    <div
      v-else
      @click.stop="
        (card_status !== 'Pending' && admin) || !admin
          ? (linkOpened = true)
          : null
      "
      class="approved-card flex flex-col border-[1px] w-full max-w-96 bg-white md:max-w-full h-96 border-white rounded-3xl overflow-hidden bg-cover bg-center relative text-white shadow-lg p-5"
      :style="{
        backgroundImage: link.img && !linkOpened ? `url(${link.img})` : 'none',
        width: linkOpened ? '90vw' : '',
        height: linkOpened ? '80vh' : '',
        position: linkOpened ? 'fixed' : 'relative',
        top: linkOpened ? '50%' : 'auto',
        left: linkOpened ? '50%' : 'auto',
        transform: linkOpened ? 'translate(-50%, -50%)' : 'none',
        zIndex: linkOpened ? 50 : 'auto',
        cursor: linkOpened ? '' : 'pointer',
      }"
    >
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-0"
      ></div>

      <!-- Close button for expanded card -->
      <button
        v-if="linkOpened"
        @click.stop="closeAllCards"
        class="absolute top-2 right-2 z-20 bg-black hover:bg-black/70 text-white rounded-full w-7 h-7 flex items-center justify-center transition-colors"
      >
        ✕
      </button>

      <img
        v-if="link.img && linkOpened"
        :src="link.img"
        class="object-contain absolute bg-white inset-0 border-2 border-black rounded-3xl md:w-full md:h-full"
      />

      <h3
        class="flex w-fit items-center text-xl font-semibold backdrop-blur-md bg-black/50 text-white px-3 py-2 rounded-xl"
      >
        {{ deletion ? "DELETED" : link.name }}
      </h3>
      <div class="flex-grow"></div>
      <div class="space-y-2">
        <p
          class="text-sm backdrop-blur-md bg-black/50 w-fit text-white px-3 py-2 rounded-xl"
          v-if="
            link.description && (link.description.length < 150 || linkOpened)
          "
        >
          {{ link.description }}
        </p>
        <p
          class="text-sm backdrop-blur-md bg-black/50 w-fit text-white px-3 py-2 rounded-xl"
          v-else-if="link.description"
        >
          {{ link.description?.slice(0, 150) }}...
        </p>
        <div class="flex flex-wrap gap-2 text-sm">
          <a
            v-if="link.url"
            :href="link.url"
            @click.stop
            target="_blank"
            rel="noopener noreferrer"
            class="backdrop-blur-md bg-black/50 text-white px-3 py-2 rounded-xl"
          >
            <i class="fa fa-link mr-2"></i>
            <span class="hover:underline break-all">
              {{ link.url }}
            </span>
          </a>
          <h4
            class="backdrop-blur-md bg-black/50 text-white px-3 py-2 rounded-xl"
          >
            <i class="fa fa-calendar mr-2"></i>{{ link.date }}
          </h4>
        </div>
      </div>
      <div class="flex w-full gap-2">
        <button
          v-if="card_status === 'Pending' && !admin"
          class="admin-button w-full"
          disabled
        >
          Pending Approval
        </button>
        <button
          v-if="admin"
          @click.stop="emit('edit', link)"
          class="admin-button w-full z-0"
        >
          Edit
        </button>
        <button
          v-if="admin"
          @click.stop="emit('delete', link.id)"
          class="relative group cursor-pointer flex-col h-full aspect-square bg-gold rounded-full gap-px flex items-center justify-center"
        >
          <div
            class="flex flex-col items-center justify-center transition-all duration-150 group-hover:-translate-y-[4px]"
          >
            <span
              class="w-4 h-1 bg-black rounded-sm transform translate-y-[2px] clip-polygon-custom"
            ></span>
            <span class="w-6 h-1 bg-black rounded"></span>
          </div>
          <div
            class="w-5 h-[25px] bg-black rounded-b-[4px] transition-transform duration-300 [clip-path:polygon(0%_0%,100%_0%,95%_100%,5%_100%)]"
          ></div>
        </button>
      </div>
    </div>

    <div
      v-if="linkOpened || pendingLinkAfterOpened || pendingLinkBeforeOpened"
      class="expansion-backdrop fixed inset-0 bg-black/50 backdrop-blur-md z-40 cursor-pointer"
      @click="closeAllCards"
    ></div>
  </div>
</template>

<script setup lang="ts">
interface Link {
  id: any;
  name: string;
  url?: string;
  img?: string;
  action_type: string;
  description?: string;
  date: string;
  isApproved?: boolean;
  old_id?: any;
}

const linkOpened = ref(false);

const pendingLinkBeforeOpened = ref(false);
const pendingLinkAfterOpened = ref(false);

const {
  staffLinks,
  pendingActions,
  fetchStaffLinks,
  fetchPendingActions,
  createLink,
  submitEditRequest,
  submitDeleteRequest,
  approveAction,
  rejectAction,
} = useDailyLinks();

const props = defineProps<{
  link: Link;
  card_status: "Pending" | "Approved" | "Create" | "Update";
  admin: boolean;
  originalLink?: Link;
}>();

const deletion = ref(props.link.action_type === "delete");

const closeAllCards = () => {
  linkOpened.value = false;
  pendingLinkAfterOpened.value = false;
  pendingLinkBeforeOpened.value = false;
};

watch(
  [linkOpened, pendingLinkBeforeOpened, pendingLinkAfterOpened],
  ([opened, beforeOpened, afterOpened]) => {
    if (opened || beforeOpened || afterOpened) {
      document.body.classList.add("no-scroll");
      document.documentElement.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
      document.documentElement.classList.remove("no-scroll");
    }
  }
);

onBeforeUnmount(() => {
  document.body.classList.remove("no-scroll");
  document.documentElement.classList.remove("no-scroll");
});

const emit = defineEmits<{
  (e: "edit", link: Link): void;
  (e: "delete", id: number): void;
  (e: "approve", id: number): void;
  (e: "reject", id: number): void;
}>();
</script>

<style scoped></style>

<style>
.no-scroll {
  overflow: hidden !important;
}
</style>
