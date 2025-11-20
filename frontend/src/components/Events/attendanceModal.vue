<template>
  <transition name="fade">
    <div v-if="event" class="modal-backdrop-simple">
      <div class="modal-backdrop" @click="$emit('close')"></div>

      <div class="modal-form scrollable">
        <header class="modal-header-inline">
          <div>
            <h3 class="modal-title">Attendance: {{ event.name }}</h3>
            <p class="modal-subtitle">
              Section: {{ event.section }} | Date: {{ event.eventDate }}
            </p>
          </div>
          <button type="button" @click="$emit('close')" class="close-btn">
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
          <!-- Scanning Status -->
          <div class="info-banner">
            <div class="info-row">
              <i
                class="fas fa-sync-alt fa-spin"
                style="color: var(--accent)"
              ></i>
              <span class="info-label">Scanning:</span>
              <span class="info-value"
                >{{ scannedCount }}/{{ localStudents.length }} students</span
              >
            </div>
          </div>

          <!-- Statistics -->
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-label">Expected</span>
              <span class="stat-value">{{ localStudents.length }}</span>
            </div>
            <div class="stat-item stat-present">
              <span class="stat-label">Present</span>
              <span class="stat-value">{{ presentStudents.length }}</span>
            </div>
            <div class="stat-item stat-absent">
              <span class="stat-label">Absent</span>
              <span class="stat-value">{{ absentStudents.length }}</span>
            </div>
          </div>

          <!-- Students List -->
          <div class="students-container">
            <div
              v-for="student in localStudents"
              :key="student.id"
              class="student-item"
              :class="{
                'student-present': student.isPresent,
                'student-absent': !student.isPresent,
              }"
            >
              <span class="student-name">{{ student.name }}</span>
              <span class="student-status">
                {{ student.isPresent ? "Present" : "Absent" }}
              </span>
            </div>
          </div>
        </div>

        <footer class="modal-footer-inline">
          <button type="button" @click="$emit('close')" class="btn-cancel">
            Close
          </button>
          <button type="button" class="btn-submit" @click="endAttendance">
            End Attendance
          </button>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from "vue";

const props = defineProps({
  event: Object,
  students: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(["close", "update"]);

const scannedCount = ref(0);
const localStudents = reactive((props.students || []).map((s) => ({ ...s })));

const presentStudents = computed(() =>
  localStudents.filter((s) => s.isPresent)
);
const absentStudents = computed(() =>
  localStudents.filter((s) => !s.isPresent)
);

onMounted(() => {
  simulateRFIDScan();
});

function simulateRFIDScan() {
  let index = 0;
  const interval = setInterval(() => {
    if (index >= localStudents.length) {
      clearInterval(interval);
      return;
    }
    localStudents[index].isPresent = Math.random() > 0.3;
    scannedCount.value = index + 1;
    index++;
  }, 1000);
}

function endAttendance() {
  emit("update", localStudents);
  emit("close");
}
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

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--muted);
  font-weight: 500;
}

.stat-value {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text);
}

.stat-present .stat-label,
.stat-present .stat-value {
  color: var(--accent);
}

.stat-absent .stat-label,
.stat-absent .stat-value {
  color: var(--danger);
}

/* Students Container */
.students-container {
  max-height: 16rem;
  overflow-y: auto;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  padding: 0.75rem;
  background: var(--surface);
}

.student-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background: var(--bg);
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  transition: background 0.15s;
}

.student-item:last-child {
  margin-bottom: 0;
}

.student-item:hover {
  background: var(--surface);
}

.student-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text);
}

.student-status {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid var(--border);
}

.student-present .student-name,
.student-present .student-status {
  color: var(--accent);
}

.student-present .student-status {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.2);
}

.student-absent .student-name,
.student-absent .student-status {
  color: var(--danger);
}

.student-absent .student-status {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.2);
}

/* Scrollbar Styling */
.students-container::-webkit-scrollbar {
  width: 6px;
}

.students-container::-webkit-scrollbar-track {
  background: var(--surface);
  border-radius: 3px;
}

.students-container::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 3px;
}

.students-container::-webkit-scrollbar-thumb:hover {
  background: var(--accent);
}
</style>
