<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="event"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50" @click="handleClose"></div>

        <!-- Modal -->
        <div
          class="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-lg shadow-lg overflow-y-auto"
        >
          <!-- Header -->
          <div
            class="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between z-10"
          >
            <div>
              <h2 class="text-2xl font-bold text-gray-900">{{ event.name }}</h2>
              <p class="text-sm text-gray-500 mt-1">
                Event details and information
              </p>
            </div>
            <button
              type="button"
              @click="handleClose"
              class="text-gray-400 hover:text-gray-600 transition"
              aria-label="Close modal"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="p-6 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Event Date -->
              <div class="bg-gray-50 rounded-lg p-4">
                <p
                  class="text-xs font-semibold text-gray-500 uppercase tracking-wide"
                >
                  Date
                </p>
                <p class="text-lg font-semibold text-gray-900 mt-1">
                  {{ formatDate(event.eventDate) }}
                </p>
              </div>

              <!-- Start Time -->
              <div class="bg-gray-50 rounded-lg p-4">
                <p
                  class="text-xs font-semibold text-gray-500 uppercase tracking-wide"
                >
                  Start Time
                </p>
                <p class="text-lg font-semibold text-gray-900 mt-1">
                  {{ formatTime(event.startAt) }}
                </p>
              </div>

              <!-- Finish Time -->
              <div class="bg-gray-50 rounded-lg p-4">
                <p
                  class="text-xs font-semibold text-gray-500 uppercase tracking-wide"
                >
                  Finish Time
                </p>
                <p class="text-lg font-semibold text-gray-900 mt-1">
                  {{ formatTime(event.finishAt) }}
                </p>
              </div>

              <!-- Fines -->
              <div class="bg-gray-50 rounded-lg p-4">
                <p
                  class="text-xs font-semibold text-gray-500 uppercase tracking-wide"
                >
                  Fines
                </p>
                <p class="text-lg font-semibold text-green-600 mt-1">
                  ₱{{ event.fines.toLocaleString() }}
                </p>
              </div>

              <!-- Sections -->
              <div class="bg-gray-50 rounded-lg p-4 md:col-span-2">
                <p
                  class="text-xs font-semibold text-gray-500 uppercase tracking-wide"
                >
                  Sections
                </p>
                <p class="text-sm text-gray-700 mt-1">
                  {{
                    event.sections
                      .filter(Boolean)
                      .map((s) => getSectionLabel(s))
                      .join(", ") || "No sections"
                  }}
                </p>
              </div>

              <!-- Description -->
              <div class="bg-gray-50 rounded-lg p-4 md:col-span-2">
                <p
                  class="text-xs font-semibold text-gray-500 uppercase tracking-wide"
                >
                  Description
                </p>
                <p class="text-sm text-gray-700 mt-1">
                  {{ event.description || "No description provided" }}
                </p>
              </div>
            </div>

            <!-- Event Entries -->
            <div v-if="event.timeEntries && event.timeEntries.length">
              <h3 class="text-sm font-semibold text-gray-900 mb-3">
                Event Entries
              </h3>
              <div class="space-y-2">
                <div
                  v-for="(entry, index) in event.timeEntries"
                  :key="index"
                  class="flex items-center justify-between bg-blue-50 px-4 py-3 rounded-lg border border-blue-200"
                >
                  <div>
                    <p class="font-semibold text-gray-900">{{ entry.name }}</p>
                    <p class="text-sm text-gray-600">
                      {{ formatDateTime(entry.startTime) }} —
                      {{ formatDateTime(entry.endTime) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Created Date -->
            <div class="border-t border-gray-200 pt-4">
              <p class="text-xs text-gray-500">
                Created on {{ formatDateTime(event.createdAt) }}
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div
            class="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex justify-end gap-3"
          >
            <button
              type="button"
              @click="handleClose"
              class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Close
            </button>

            <button
              type="button"
              @click="openEditModal"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Edit
            </button>

            <button
              type="button"
              @click="$emit('delete', event.id)"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Edit Modal -->
    <EventEditModal
      :event="event"
      :sections="sections"
      :show="showEditModal"
      @close="closeEditModal"
      @update="updateEvent"
    />
  </Teleport>
</template>

<script setup>
import { ref } from "vue";
import EventEditModal from "./editEventModal.vue";

const props = defineProps({
  event: Object,
  sections: Array,
});

const emit = defineEmits(["close", "delete", "update"]);

const showEditModal = ref(false);
const openEditModal = () => (showEditModal.value = true);
const closeEditModal = () => (showEditModal.value = false);

const handleClose = () => emit("close");
const updateEvent = (updatedEvent) => emit("update", updatedEvent);

// Helpers
const getSectionLabel = (id) => {
  const s = props.sections.find((sec) => sec.id === id);
  return s?.label || id;
};

const formatDate = (d) => {
  try {
    return new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return d;
  }
};

const formatTime = (t) => {
  try {
    return new Date(t).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return t;
  }
};

const formatDateTime = (d) => {
  try {
    return new Date(d).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return d;
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}
</style>
