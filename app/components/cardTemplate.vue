<template>
  <div class="card-container justify-items-center w-full h-full">
    <!-- Pending Cards - Show Before/After -->
    <div
      v-if="card_status === 'Pending' && admin"
      @click.stop
      class="flex flex-col gap-4 max-w-none pending-card p-4 rounded-3xl w-full"
      :class="deletion ? 'bg-red-50 border-2 border-red-200' : 'bg-gray-50'"
    >
      <div class="flex flex-col md:flex-row gap-4">
        <!-- Original Card (Before) -->
        <div class="flex-1 relative">
          <div
            class="absolute top-2 left-2 z-10 backdrop backdrop-blur-md text-white px-2 py-1 rounded-lg text-sm font-bold bg-blue-600"
          >
            BEFORE
          </div>
          <div class="flex flex-col bg-white rounded-3xl overflow-hidden shadow-lg h-96">
            <!-- Image Section -->
            <div 
              class="h-48 bg-cover bg-center relative flex-shrink-0 md:hover:h-4/5 transition-all md:duration-300 shadow-md border-b-2 border-black"
              :style="{
                backgroundImage: originalLink?.img ? `url(${originalLink?.img})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }"
            >
              <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
            
            <!-- Content Section -->
            <div class="p-3 flex-1 flex flex-col min-h-0">
              <!-- Title as clickable URL -->
              <h3 class="text-lg font-bold text-black mb-2" :class="{'underline ': originalLink?.url}">
                <a
                  v-if="originalLink?.url"
                  :href="originalLink?.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="hover:underline text-blue-600"
                  :class="{'hover:text-gold': originalLink?.url}"
                  @click.stop
                >
                  {{ originalLink?.name }}
                </a>
                <span v-else class="text-gray-800">
                  {{ originalLink?.name }}
                </span>
              </h3>
              
              <!-- Description -->
              <div class="mb-2 overflow-y-auto" v-if="originalLink?.description">
                <p 
                  class="text-gray-600 text-sm md:line-clamp-full"
                  :class="originalBeforeExpanded ? '' : 'line-clamp-2'"
                >
                  {{ originalLink?.description }}
                </p>
                <button
                  v-if="originalLink?.description && originalLink.description.length > 100"
                  @click.stop="originalBeforeExpanded = !originalBeforeExpanded"
                  class="text-blue-600 hover:text-blue-800 text-xs mt-1"
                >
                  {{ originalBeforeExpanded ? 'Read less' : 'Read more' }}
                </button>
              </div>
              
              <!-- Date -->
              <div class="flex items-center justify-between mt-auto flex-shrink-0">
                <span class="text-xs text-gray-500" v-if="originalLink?.date">
                  {{ originalLink?.date }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- New Card (After) -->
        <div class="flex-1 relative">
          <div
            class="absolute top-2 left-2 z-10 backdrop backdrop-blur-md text-white px-2 py-1 rounded-lg text-sm font-bold bg-green-600"
          >
            AFTER
          </div>
          <div class="flex flex-col bg-white rounded-3xl overflow-hidden shadow-lg h-96"
               :class="deletion ? 'opacity-50' : ''">
            <!-- Image Section -->
            <div 
              class="h-48 bg-cover bg-center relative flex-shrink-0 md:hover:h-4/5 transition-all md:duration-300 shadow-md border-b-2 border-black"
              :style="{
                backgroundImage: link.img && !deletion ? `url(${link.img})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }"
            >
              <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              <div v-if="deletion" class="absolute inset-0 bg-red-500/50 flex items-center justify-center">
                <span class="text-white font-bold text-lg">DELETED</span>
              </div>
            </div>
            
            <!-- Content Section -->
            <div class="p-3 flex-1 flex flex-col min-h-0">
              <!-- Title as clickable URL -->
              <h3 class="text-lg font-bold text-black mb-2">
                <a
                  v-if="link.url && !deletion"
                  :href="link.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="hover:underline text-blue-600"
                  :class="{'hover:text-gold': link.url}"

                  @click.stop
                >
                  {{ link.name }}
                </a>
                <span v-else class="text-gray-800">
                  {{ deletion ? "DELETED" : link.name }}
                </span>
              </h3>
              
              <!-- Description -->
              <div class="mb-2 overflow-y-auto" v-if="link.description && !deletion">
                <p 
                  class="text-gray-600 text-sm"
                  :class="pendingAfterExpanded ? '' : 'line-clamp-2'"
                >
                  {{ link.description }}
                </p>
                <button
                  v-if="link.description && link.description.length > 100"
                  @click.stop="pendingAfterExpanded = !pendingAfterExpanded"
                  class="text-blue-600 hover:text-blue-800 text-xs mt-1"
                >
                  {{ pendingAfterExpanded ? 'Read less' : 'Read more' }}
                </button>
              </div>
              
              <!-- Date -->
              <div class="flex items-center justify-between mt-auto flex-shrink-0">
                <span class="text-xs text-gray-500" v-if="link.date">
                  {{ link.date }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Action Buttons for Pending Cards -->
      <div class="flex w-full h-full gap-2 justify-center">
        <button
          @click.stop="emit('approve', link.id)"
          class="admin-button text-sm flex-1 max-w-xs"
        >
          <i class="fa fa-check mr-2"></i>Approve
        </button>
        <button
          @click.stop="emit('reject', link.id)"
          class="admin-button text-sm flex-1 max-w-xs"
        >
          <i class="fa fa-times mr-2"></i>
          Reject
        </button>
      </div>
    </div>

    <!-- Regular Cards (Non-Pending so Approved) -->
    <div
      v-else
      class="approved-card flex flex-col bg-white rounded-3xl overflow-hidden shadow-lg max-w-sm mx-auto w-full h-96"
    >
      <!-- Image Section -->
      <div 
        class="h-48 bg-cover bg-center relative flex-shrink-0 md:hover:h-4/5 transition-all md:duration-300 shadow-md border-b-2 border-black"
        :style="{
          backgroundImage: link.img ? `url(${link.img})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }"
      >
        <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
      </div>
      
      <!-- Content Section -->
      <div class="p-4 flex-1 flex flex-col min-h-0">
        <!-- Title as clickable URL -->
        <h3 class="text-xl font-bold text-black mb-2" :class="{'underline': link.url}">
          <a
            v-if="link.url"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:underline text-blue-600"
            :class="{'hover:text-gold': link.url && !deletion}"
            @click.stop
          >
            {{ deletion ? "DELETED" : link.name }}
          </a>
          <span v-else class="text-gray-800">
            {{ deletion ? "DELETED" : link.name }}
          </span>
        </h3>
        
        <!-- Description -->
        <div class="flex-1 mb-3 overflow-y-auto" v-if="link.description">
          <p 
            class="text-gray-600 text-sm"
            :class="approvedExpanded ? '' : 'line-clamp-2'"
          >
            {{ link.description }}
          </p>
          <button
            v-if="link.description && link.description.length > 100"
            @click.stop="approvedExpanded = !approvedExpanded"
            class="text-blue-600 hover:text-blue-800 text-xs mt-1"
          >
            {{ approvedExpanded ? 'Read less' : 'Read more' }}
          </button>
        </div>
        
        <!-- Date and Actions -->
        <div class="flex items-center justify-between mt-auto flex-shrink-0">
          <span class="text-xs text-gray-500" v-if="link.date">
            {{ link.date }}
          </span>
          
          <!-- Admin Actions -->
          <div class="flex gap-2" v-if="admin">
            <button
              @click.stop="emit('edit', link)"
              class="text-blue-600 hover:text-blue-800 text-sm"
            >
              Edit
            </button>
            <button
              @click.stop="emit('delete', link.id)"
              class="text-red-600 hover:text-red-800 text-sm"
            >
              Delete
            </button>
          </div>
          
          <!-- Non-admin pending status -->
          <span
            v-if="card_status === 'Pending' && !admin"
            class="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded"
          >
            Pending Approval
          </span>
        </div>
      </div>
    </div>
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

// Read more states for different card types
const originalBeforeExpanded = ref(false);
const pendingAfterExpanded = ref(false);
const approvedExpanded = ref(false);

const emit = defineEmits<{
  (e: "edit", link: Link): void;
  (e: "delete", id: number): void;
  (e: "approve", id: number): void;
  (e: "reject", id: number): void;
}>();
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-full {
  display: -webkit-box;
  -webkit-line-clamp: 100;
  line-clamp: 100;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

<style>
.no-scroll {
  overflow: hidden !important;
}
</style>