<template>
  <transition name="fade">
    <div v-if="event" class="modal-backdrop-simple">
      <div class="modal-backdrop" @click="handleCancel"></div>

      <div class="modal-form scrollable">
        <header class="modal-header-inline">
          <div>
            <h3 class="modal-title">
              {{ isEditing ? "Edit Event" : event.name }}
            </h3>
            <p v-if="!isEditing" class="modal-subtitle">
              Event details and information
            </p>
          </div>
          <button type="button" @click="handleCancel" class="close-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </header>

        <!-- Form content -->
        <div class="space-y-4">
          <!-- Editable Form -->
          <div v-if="isEditing">
            <div>
              <label class="input-label">Event Name</label>
              <input
                v-model="editableEvent.name"
                type="text"
                class="input-field"
                placeholder="Enter event name"
              />
            </div>

            <!-- Section Checkbox -->
            <div style="margin-top: 1rem">
              <label class="input-label">Sections / Year Levels</label>
              <input
                v-model="searchQuery"
                placeholder="Search sections..."
                class="input-field mb-2"
              />
              <div class="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="selectAll"
                  v-model="selectAll"
                  @change="toggleSelectAll"
                />
                <label for="selectAll" class="ml-2">Select All</label>
              </div>
              <div class="checkbox-list">
                <div
                  v-for="section in filteredSections"
                  :key="section.id"
                  class="flex items-center mb-1"
                >
                  <input
                    type="checkbox"
                    :id="`section-${section.id}`"
                    :value="section.id"
                    v-model="editableEvent.sections"
                  />
                  <label :for="`section-${section.id}`" class="ml-2">
                    {{ section.label }}
                  </label>
                </div>
              </div>
            </div>

            <div style="margin-top: 1rem">
              <label class="input-label">Fines (₱)</label>
              <input
                v-model.number="editableEvent.fines"
                type="number"
                class="input-field"
                placeholder="0"
              />
            </div>

            <!-- Event Entries Section -->
            <div>
              <label class="input-label">Event Entries</label>
              <div class="event-entries">
                <div
                  v-for="(entry, index) in editableEvent.timeEntries"
                  :key="index"
                  class="event-entry"
                >
                  <!-- Entry Name -->
                  <div>
                    <label class="input-label">Entry Name</label>
                    <input
                      v-model="entry.name"
                      type="text"
                      class="input-field"
                      placeholder="Entry Name"
                    />
                  </div>

                  <!-- Start Time -->
                  <div>
                    <label class="input-label">Start Time</label>
                    <input
                      v-model="entry.startTime"
                      type="datetime-local"
                      class="input-field"
                    />
                  </div>

                  <!-- End Time -->
                  <div>
                    <label class="input-label">End Time</label>
                    <input
                      v-model="entry.endTime"
                      type="datetime-local"
                      class="input-field"
                    />
                  </div>

                  <!-- Remove Button -->
                  <button
                    type="button"
                    class="btn-remove-entry"
                    @click="removeTimeEntry(index)"
                  >
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
                <button
                  type="button"
                  class="btn-add-entry"
                  @click="addTimeEntry"
                >
                  + Add Entry
                </button>
              </div>
            </div>
          </div>

          <!-- Display Mode -->
          <div v-else class="modal-content">
            <div class="info-banner">
              <div class="info-row">
                <i class="fas fa-clock" style="color: var(--accent)"></i>
                <span class="info-label">Time:</span>
                <span class="info-value"
                  >{{ event.startTime }} – {{ event.endTime }}</span
                >
              </div>
              <div class="info-row">
                <i class="fas fa-calendar" style="color: var(--accent)"></i>
                <span class="info-label">Date:</span>
                <span class="info-value">{{ event.eventDate }}</span>
              </div>
              <div class="info-row">
                <i
                  class="fas fa-graduation-cap"
                  style="color: var(--accent)"
                ></i>
                <span class="info-label">Sections:</span>
                <span class="info-value">
                  {{ event.sections.join(", ") }}
                </span>
              </div>
              <div class="info-row">
                <i
                  class="fas fa-money-bill-wave"
                  style="color: var(--accent)"
                ></i>
                <span class="info-label">Fines:</span>
                <span class="badge-amount"
                  >₱{{ event.fines.toLocaleString() }}</span
                >
              </div>
              <div class="info-row">
                <i class="fas fa-calendar-plus" style="color: var(--muted)"></i>
                <span class="info-label">Created:</span>
                <span class="info-value text-muted">{{ event.createdAt }}</span>
              </div>
            </div>

            <!-- Event Entries Display -->
            <div class="event-entries">
              <div
                v-for="entry in event.timeEntries"
                :key="entry.name"
                class="event-entry"
              >
                <span class="entry-name">{{ entry.name }}</span>
                <span class="entry-time">
                  {{ entry.startTime }} — {{ entry.endTime }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <footer class="modal-footer-inline">
          <button
            type="button"
            @click="handleCancel"
            :class="isEditing ? 'btn-cancel' : 'btn-close'"
          >
            {{ isEditing ? "Cancel" : "Close" }}
          </button>

          <button
            v-if="!isEditing"
            type="button"
            class="btn-submit"
            @click="startEditing"
          >
            Edit
          </button>

          <button
            v-if="isEditing"
            type="button"
            class="btn-submit"
            @click="saveChanges"
          >
            <i class="fas fa-save"></i> Save
          </button>

          <button
            v-if="!isEditing"
            type="button"
            class="btn-cancel"
            @click="$emit('delete', event.id)"
          >
            Delete
          </button>

          <button
            v-if="!isEditing"
            type="button"
            class="btn-add"
            @click="openAttendance"
          >
            Start
          </button>
        </footer>

        <!-- Attendance Modal -->
        <AttendanceModal
          v-if="showAttendanceModal"
          :event="event"
          :students="event.students"
          @close="showAttendanceModal = false"
          @update="updateAttendance"
        />
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import AttendanceModal from "./attendanceModal.vue";

const props = defineProps({ event: Object, sections: Array });
const emit = defineEmits(["close", "delete", "update"]);

const isEditing = ref(false);
const editableEvent = ref({ ...props.event });
const searchQuery = ref("");
const selectAll = ref(false);

watch(
  () => props.event,
  (newVal) => {
    editableEvent.value = { ...newVal };
  }
);

const startEditing = () => (isEditing.value = true);

const handleCancel = () => {
  if (isEditing.value) {
    editableEvent.value = { ...props.event };
    isEditing.value = false;
  } else {
    emit("close");
  }
};

const saveChanges = () => {
  emit("update", { ...editableEvent.value });
  isEditing.value = false;
};

// Attendance Modal
const showAttendanceModal = ref(false);
const openAttendance = () => (showAttendanceModal.value = true);

const updateAttendance = (students) => {
  emit("update", { ...props.event, students });
};

// Add a new time entry
const addTimeEntry = () => {
  editableEvent.value.timeEntries.push({
    name: "",
    startTime: "",
    endTime: "",
  });
};

// Remove a time entry
const removeTimeEntry = (index) => {
  editableEvent.value.timeEntries.splice(index, 1);
};

// Filter sections based on the search query
const filteredSections = computed(() => {
  return props.sections.filter((section) =>
    section.label.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Toggle select all functionality
const toggleSelectAll = () => {
  if (selectAll.value) {
    editableEvent.value.sections = props.sections.map((section) => section.id);
  } else {
    editableEvent.value.sections = [];
  }
};
</script>

<style scoped>
.space-y-4 > * + * {
  margin-top: 1rem;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 5;
}

/* Info row spacing */
.info-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-row i {
  width: 1.25rem;
  text-align: center;
}

/* Action button enhancements */
.action-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.event-entries {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.event-entry {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--surface);
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: 1px solid var(--border);
}

.entry-name {
  font-weight: 600;
}

.entry-time {
  color: var(--muted);
}

.btn-remove-entry {
  background-color: var(--danger);
  color: #fff;
  padding: 0.25rem;
  border-radius: 0.375rem;
  cursor: pointer;
  height: 2.5rem;
  width: 2.5rem;
}

.btn-remove-entry i {
  font-size: 1rem;
}

.btn-remove-entry:hover {
  opacity: 0.85;
}

.btn-add-entry {
  background-color: var(--primary);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
}

.checkbox-list {
  max-height: 10rem;
  overflow-y: auto;
  border: 1px solid var(--border);
  border-radius: 0.375rem;
  padding: 0.5rem;
}

.input-field {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border);
  border-radius: 0.375rem;
}
</style>
