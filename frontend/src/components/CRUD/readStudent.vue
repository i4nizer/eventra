<template>
  <transition name="fade">
    <div v-if="open" class="modal-backdrop-simple">
      <div class="modal-backdrop" @click="handleClose"></div>

      <div class="modal-form-expanded scrollable" @click.stop>
        <header class="modal-header-inline">
          <div>
            <h3 class="modal-title">View Student</h3>
            <p class="modal-subtitle">
              Detailed view of the student information.
            </p>
          </div>
          <button
            type="button"
            @click="handleClose"
            class="close-btn"
            aria-label="Close modal"
          >
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

        <div class="content-grid">
          <div class="photo-section">
            <label class="input-label">Photo</label>
            <div class="photo-preview-container" v-if="student?.photoUrl">
              <img
                :src="student.photoUrl"
                alt="Student photo"
                class="preview-img"
              />
            </div>
            <div v-else class="upload-placeholder">
              <p class="upload-label">No photo available</p>
            </div>
          </div>

          <div class="info-section">
            <div class="info-row">
              <label class="input-label">Student ID</label>
              <input class="input-field" :value="student?.sid || ''" disabled />
              <label class="input-label">RFID</label>
              <input
                class="input-field"
                :value="student?.rfid || ''"
                disabled
              />
            </div>

            <div class="info-row">
              <label class="input-label">Name</label>
              <input
                class="input-field"
                :value="student?.name || ''"
                disabled
              />
              <label class="input-label">Email</label>
              <input
                type="email"
                class="input-field"
                :value="student?.email || ''"
                disabled
              />
            </div>

            <div class="info-row">
              <label class="input-label">Section & Year</label>
              <input class="input-field" :value="joinedSectionYear" disabled />
            </div>

            <div class="info-row">
              <label class="input-label">Balance</label>
              <input
                class="input-field"
                :value="`₱ ${student?.balance?.toFixed(2) || '0.00'}`"
                disabled
              />
            </div>
          </div>
        </div>

        <footer class="modal-footer-expanded">
          <button type="button" @click="handleClose" class="btn-close">
            Close
          </button>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  open: Boolean,
  student: Object,
});

const emit = defineEmits(["close"]);

function formatYear(year) {
  if (!year) return "";
  const y = parseInt(year);
  const lastTwoDigits = y % 100;
  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) return y + "th year";
  switch (y % 10) {
    case 1:
      return y + "st year";
    case 2:
      return y + "nd year";
    case 3:
      return y + "rd year";
    default:
      return y + "th year";
  }
}

const joinedSectionYear = computed(() => {
  const sectionName = props.student?.sectionName || "";
  const rawYear = props.student?.sectionYear;
  const yearFormatted =
    typeof rawYear === "number" || /^\d+$/.test(rawYear)
      ? formatYear(rawYear)
      : rawYear || "";
  if (sectionName && yearFormatted) {
    return `${sectionName} - ${yearFormatted}`;
  }
  return sectionName || yearFormatted || "";
});

function handleClose() {
  emit("close");
}
</script>

<style scoped>
.modal-form-expanded {
  background-color: var(--surface);
  max-width: 900px;
  width: 90vw;
  border-radius: 0.5rem;
  padding: 2rem 2.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header-inline {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text);
  margin: 0;
}

.modal-subtitle {
  font-size: 1rem;
  color: var(--muted);
  margin-top: 0.25rem;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
}

.photo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.photo-preview-container {
  width: 100%;
  max-width: 280px;
  height: 280px;
  background: var(--bg);
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-placeholder {
  width: 280px;
  height: 280px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--muted);
  font-weight: 600;
  font-size: 1rem;
  border: 2px dashed var(--border);
  border-radius: 0.5rem;
  text-align: center;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-row {
  display: flex;
  flex-direction: column;
}

.input-label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text);
}

.input-field {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid var(--border);
  border-radius: 0.375rem;
  background-color: var(--surface);
  color: var(--text);
  cursor: not-allowed;
}

.input-field:disabled {
  background-color: var(--bg);
  color: var(--muted);
}

.modal-footer-expanded {
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
}

/* Scrollbar for modal content */
.modal-form-expanded::-webkit-scrollbar {
  width: 8px;
}

.modal-form-expanded::-webkit-scrollbar-thumb {
  background-color: var(--border);
  border-radius: 4px;
}

.modal-form-expanded::-webkit-scrollbar-track {
  background: transparent;
}
</style>
