<template>
  <Teleport to="body">
    <Transition name="modal">
      <div class="modal-overlay" @click.self="onClose">
        <!-- Modal -->
        <div class="modal-container modal-scrollable modal-large">
          <!-- Header -->
          <div class="modal-header modal-header-sticky">
            <div>
              <h2 class="modal-title">{{ activity.name }}</h2>
              <p class="modal-subtitle">Event details and information</p>
            </div>
            <button
              type="button"
              @click="onClose"
              class="close-btn"
              aria-label="Close modal"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <!-- Content -->
          <div class="modal-body">
            <div class="info-grid">
              <!-- Event Date -->
              <div class="info-card">
                <div class="info-icon">
                  <i class="fa-solid fa-calendar"></i>
                </div>
                <div>
                  <p class="info-label">Date</p>
                  <p class="info-value">{{ formatDate(activity.startAt) }}</p>
                </div>
              </div>

              <!-- Start Time -->
              <div class="info-card">
                <div class="info-icon">
                  <i class="fa-solid fa-clock"></i>
                </div>
                <div>
                  <p class="info-label">Start Time</p>
                  <p class="info-value">{{ formatTime(activity.startAt) }}</p>
                </div>
              </div>

              <!-- Finish Time -->
              <div class="info-card">
                <div class="info-icon">
                  <i class="fa-solid fa-clock"></i>
                </div>
                <div>
                  <p class="info-label">Finish Time</p>
                  <p class="info-value">{{ formatTime(activity.finishAt) }}</p>
                </div>
              </div>

              <!-- Fines -->
              <div class="info-card">
                <div class="info-icon">
                  <i class="fa-solid fa-peso-sign"></i>
                </div>
                <div>
                  <p class="info-label">Fines</p>
                  <p class="info-value" style="color: var(--accent)">
                    ₱{{ activity.fine.toLocaleString() }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Sections -->
            <div class="info-banner" style="margin-top: 1rem">
              <div class="info-row">
                <i class="fa-solid fa-users" style="color: var(--accent)"></i>
                <p class="info-label">Sections:</p>
              </div>
              <p style="font-size: 0.875rem; color: var(--text); margin-left: 1.5rem">
                <span>{{ sections.map((s) => `${s.year}-${s.name}`).join(`, `) }}</span>
              </p>
            </div>

            <!-- Description -->
            <div class="info-banner" style="margin-top: 1rem">
              <div class="info-row">
                <i class="fa-solid fa-file-lines" style="color: var(--accent)"></i>
                <p class="info-label">Description:</p>
              </div>
              <p style="font-size: 0.875rem; color: var(--text); margin-left: 1.5rem">
                {{ activity.description || "No description provided" }}
              </p>
            </div>

            <!-- Event Entries -->
            <div v-if="activityEntries.length" style="margin-top: 1.5rem">
              <h3 style="font-size: 0.875rem; font-weight: 600; color: var(--text); margin-bottom: 0.75rem">
                Event Entries
              </h3>
              <div style="display: flex; flex-direction: column; gap: 0.5rem">
                <div
                  v-for="(entry, index) in activityEntries"
                  :key="index"
                  class="entry-card"
                >
                  <div>
                    <p style="font-weight: 600; color: var(--text)">{{ entry.name }}</p>
                    <p class="text-muted" style="font-size: 0.875rem">
                      {{ formatDateTime(entry.startAt) }} – {{ formatDateTime(entry.finishAt) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Created Date -->
            <div style="border-top: 1px solid var(--border); padding-top: 1rem; margin-top: 1.5rem">
              <p class="text-muted" style="font-size: 0.75rem">
                Created on {{ formatDateTime(activity.createdAt) }}
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div class="modal-footer modal-footer-space-between modal-footer-sticky">
            <button
              type="button"
              @click="onClose"
              class="btn-close"
            >
              Close
            </button>

            <div style="display: flex; gap: 0.75rem">
              <button
                type="button"
                @click="activityUpdateModal = true"
                class="btn-submit"
              >
                <i class="fa-solid fa-pen-to-square"></i>
                <span>Edit</span>
              </button>

              <button
                type="button"
                @click="onDeleteActivity(activity)"
                class="btn-cancel"
              >
                <i class="fa-solid fa-trash"></i>
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Edit Modal -->
    <EventEditModal
      v-if="activityUpdateModal"
      :activity="activity"
      :sections="sections"
      :activity-entries="activityEntries"
      :activity-sections="activitySections"
      @close="activityUpdateModal = false"
      @update-activity="onUpdateActivity"
      @create-activity-entry="(i, v) => onCreateActivityEntry(i, v)"
      @update-activity-entry="(i, v) => onUpdateActivityEntry(i, v)"
      @delete-activity-entry="(i, v) => onDeleteActivityEntry(i, v)"
      @create-activity-section="(i, v) => onCreateActivitySection(i, v)"
      @delete-activity-section="(i, v) => onDeleteActivitySection(i, v)"
    />
  </Teleport>
</template>

<script setup>
import { ref } from "vue";
import EventEditModal from "./editEventModal.vue";

//

const props = defineProps({
  sections: { type: Array, default: () => [] },
  activity: { type: Object, default: () => ({}) },
  activityEntries: { type: Array, default: () => [] },
  activitySections: { type: Array, default: () => [] },
  onClose: { type: Function, default: () => (() => {}) },
  onUpdateActivity: { type: Function, default: () => (() => {}) },
  onDeleteActivity: { type: Function, default: () => (() => {}) },
  onCreateActivityEntry: { type: Function, default: () => (() => {}) },
  onUpdateActivityEntry: { type: Function, default: () => (() => {}) },
  onDeleteActivityEntry: { type: Function, default: () => (() => {}) },
  onCreateActivitySection: { type: Function, default: () => (() => {}) },
  onDeleteActivitySection: { type: Function, default: () => (() => {}) },
});

//

// --- Activity
const activityUpdateModal = ref(false);

// --- Formatting
const formatDate = (d) => {
  const format = { year: "numeric", month: "long", day: "numeric" }
  return new Date(d).toLocaleDateString("en-US", format)
}

const formatTime = (t) => {
  const format = { hour: "2-digit", minute: "2-digit", hour12: true }
  return new Date(t).toLocaleTimeString("en-US", format)
}

const formatDateTime = (d) => {
  const format = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }
  return new Date(d).toLocaleString("en-US", format)
}

//

</script>

<style scoped>
/* Modal scrollable container */
.modal-scrollable {
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

/* Sticky header and footer */
.modal-header-sticky {
  position: sticky;
  top: 0;
  z-index: 10;
}

.modal-footer-sticky {
  position: sticky;
  bottom: 0;
  z-index: 10;
}

/* Info grid for cards */
.info-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
}

@media (min-width: 768px) {
  .info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Entry card for time entries */
.entry-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(59, 130, 246, 0.05);
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.dark .entry-card {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
}
</style>