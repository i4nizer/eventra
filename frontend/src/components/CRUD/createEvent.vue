<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
  >
    <div
      class="modal-backdrop"
      @click="onClose"
      aria-hidden="true"
    ></div>

    <form
      @submit.prevent="handleSubmit"
      class="modal-form"
      role="dialog"
      aria-modal="true"
      aria-label="Create event"
    >
      <header class="modal-header">
        <div>
          <h3 class="modal-title">Create Event</h3>
          <p class="modal-subtitle">
            Add a new event with time and section/year level.
          </p>
        </div>
        <button
          type="button"
          @click="onClose"
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

      <div class="space-y-4">
        <div>
          <label class="input-label">Event name</label>
          <input
            v-model="name"
            class="input-field"
            :class="{
              'input-error': errors.name,
            }"
            placeholder="e.g. Math Club Meeting"
            autofocus
          />
          <p v-if="errors.name" class="error-message">
            {{ errors.name }}
          </p>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="input-label">Start time</label>
            <input
              v-model="startTime"
              type="time"
              class="input-field"
              :class="{
                'input-error': errors.startTime || errors.time,
              }"
            />
            <p v-if="errors.startTime" class="error-message">
              {{ errors.startTime }}
            </p>
          </div>

          <div>
            <label class="input-label">End time</label>
            <input
              v-model="endTime"
              type="time"
              class="input-field"
              :class="{
                'input-error': errors.endTime || errors.time,
              }"
            />
            <p v-if="errors.endTime" class="error-message">
              {{ errors.endTime }}
            </p>
          </div>
        </div>
        <p v-if="errors.time" class="error-message">{{ errors.time }}</p>

        <div>
          <label class="input-label">Section / Year level</label>
          <select
            v-if="sections && sections.length"
            v-model="section"
            class="input-field"
            :class="{
              'input-error': errors.section,
            }"
          >
            <option v-for="s in sections" :key="s.id" :value="s.id">
              {{ s.label }}
            </option>
          </select>
          <input
            v-else
            v-model="section"
            placeholder="e.g. 3A / Grade 10"
            class="input-field"
            :class="{
              'input-error': errors.section,
            }"
          />
          <p v-if="errors.section" class="error-message">
            {{ errors.section }}
          </p>
        </div>

        <p v-if="errors.submit" class="error-message-submit">
          {{ errors.submit }}
        </p>
      </div>

      <footer class="modal-footer">
        <button
          type="button"
          @click="onClose"
          class="btn-cancel"
          :disabled="submitting"
        >
          Cancel
        </button>

        <button
          type="submit"
          class="btn-submit"
          :disabled="submitting"
        >
          {{ submitting ? "Creating..." : "Create Event" }}
        </button>
      </footer>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  open: Boolean,
  onClose: Function,
  onCreate: Function,
  sections: { type: Array, default: () => [] },
});

const name = ref("");
const startTime = ref("");
const endTime = ref("");
const section = ref("");
const errors = ref({});
const submitting = ref(false);

watch(
  () => props.open,
  (val) => {
    if (val) {
      name.value = "";
      startTime.value = "";
      endTime.value = "";
      section.value = props.sections?.length ? props.sections[0].id : "";
      errors.value = {};
      submitting.value = false;
    }
  }
);

function validate() {
  const err = {};
  if (!name.value.trim()) err.name = "Event name is required.";
  if (!startTime.value) err.startTime = "Start time is required.";
  if (!endTime.value) err.endTime = "End time is required.";
  if (startTime.value && endTime.value && startTime.value >= endTime.value)
    err.time = "End time must be after start time.";
  if (!section.value) err.section = "Please pick a section/year level.";
  return err;
}

async function handleSubmit() {
  const err = validate();
  errors.value = err;
  if (Object.keys(err).length) return;
  submitting.value = true;

  const payload = {
    name: name.value.trim(),
    startTime: startTime.value,
    endTime: endTime.value,
    section: section.value,
  };

  try {
    if (props.onCreate) await props.onCreate(payload);
    submitting.value = false;
    props.onClose && props.onClose();
  } catch (e) {
    submitting.value = false;
    errors.value.submit = e.message || "Failed to create event";
  }
}
</script>

<style scoped>
/* Modal Backdrop */
.modal-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

/* Modal Form */
.modal-form {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 36rem;
  border-radius: 1rem;
  background: var(--bg);
  padding: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid var(--border);
}

/* Header */
.modal-header {
  margin-bottom: 1rem;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.modal-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text);
}

.modal-subtitle {
  font-size: 0.875rem;
  color: var(--muted);
  margin-top: 0.25rem;
}

.close-btn {
  margin: -0.5rem;
  border-radius: 0.375rem;
  padding: 0.5rem;
  color: var(--muted);
  transition: all 0.15s;
  background: transparent;
  border: none;
  cursor: pointer;
}

.close-btn:hover {
  background: var(--surface);
  color: var(--text);
}

/* Input Fields */
.input-label {
  margin-bottom: 0.25rem;
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text);
}

.input-field {
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid var(--border);
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  background: var(--surface);
  color: var(--text);
  outline: none;
  transition: all 0.15s;
}

.input-field::placeholder {
  color: var(--muted);
}

.input-field:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.input-error {
  border-color: #ef4444 !important;
}

.error-message {
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #ef4444;
}

.error-message-submit {
  font-size: 0.875rem;
  color: #ef4444;
}

/* Footer */
.modal-footer {
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
}

.btn-cancel {
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text);
  background: transparent;
  border: 1px solid var(--border);
  transition: all 0.15s;
  cursor: pointer;
}

.btn-cancel:hover:not(:disabled) {
  background: var(--surface);
}

.btn-cancel:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-submit {
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  background: var(--accent);
  border: 1px solid var(--accent);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.15s;
  cursor: pointer;
}

.btn-submit:hover:not(:disabled) {
  opacity: 0.9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Dark mode adjustments */
:global(.dark) .modal-form {
  color: var(--accent);
  background: var(--surface);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.dark .btn-submit {
  color: var(--accent);
  background: var(--surface);
  border-color: var(--accent);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}
</style>
