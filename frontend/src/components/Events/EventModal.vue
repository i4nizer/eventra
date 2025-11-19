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
            <p v-if="!isEditing" class="modal-subtitle">Event details and information</p>
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

            <div style="margin-top: 1rem;">
              <label class="input-label">Event Date</label>
              <input
                v-model="editableEvent.eventDate"
                type="date"
                class="input-field"
              />
            </div>

            <div style="margin-top: 1rem;">
              <label class="input-label">Start Time</label>
              <input
                v-model="editableEvent.startTime"
                type="time"
                class="input-field"
              />
            </div>

            <div style="margin-top: 1rem;">
              <label class="input-label">End Time</label>
              <input
                v-model="editableEvent.endTime"
                type="time"
                class="input-field"
              />
            </div>

            <div style="margin-top: 1rem;">
              <label class="input-label">Section</label>
              <input
                v-model="editableEvent.section"
                type="text"
                class="input-field"
                placeholder="Enter section"
              />
            </div>

            <div style="margin-top: 1rem;">
              <label class="input-label">Fines (₱)</label>
              <input
                v-model.number="editableEvent.fines"
                type="number"
                class="input-field"
                placeholder="0"
              />
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
                <i class="fas fa-graduation-cap" style="color: var(--accent)"></i>
                <span class="info-label">Section:</span>
                <span class="info-value">{{ event.section }}</span>
              </div>
              <div class="info-row">
                <i class="fas fa-money-bill-wave" style="color: var(--accent)"></i>
                <span class="info-label">Fines:</span>
                <span class="badge-amount">₱{{ event.fines.toLocaleString() }}</span>
              </div>
              <div class="info-row">
                <i class="fas fa-calendar-plus" style="color: var(--muted)"></i>
                <span class="info-label">Created:</span>
                <span class="info-value text-muted">{{ event.createdAt }}</span>
              </div>
            </div>
          </div>
        </div>

        <footer class="modal-footer-inline">
          <button type="button" @click="handleCancel" :class="isEditing ? 'btn-cancel' : 'btn-close'">
            {{ isEditing ? "Cancel" : "Close" }}
          </button>

          <button
            v-if="!isEditing"
            type="button"
            class="btn-submit"
            @click="startEditing"
          > Edit
          </button>

          <button v-if="isEditing" type="button" class="btn-submit" @click="saveChanges">
            <i class="fas fa-save"></i> Save
          </button>

          <button
            v-if="!isEditing"
            type="button"
            class="btn-cancel"
            @click="$emit('delete', event.id)"
          >Delete
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
import { ref, watch } from "vue";
import AttendanceModal from "./attendanceModal.vue";

const props = defineProps({ event: Object });
const emit = defineEmits(["close", "delete", "update"]);

const isEditing = ref(false);
const editableEvent = ref({ ...props.event });

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
</style>