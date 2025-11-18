<template>
  <div v-if="open" class="modal-backdrop-simple">
    <div class="modal-backdrop" @click="onClose"></div>

    <form @submit.prevent="handleSubmit" class="modal-form scrollable">
      <header class="modal-header-inline">
        <div>
          <h3 class="modal-title">Create Event</h3>
          <p class="modal-subtitle">Add a new event to the system.</p>
        </div>
        <button type="button" @click="onClose" class="close-btn">
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
      
      <footer class="modal-footer-inline">
        <button type="button" @click="onClose" class="btn-cancel" :disabled="submitting">
          Cancel
        </button>
        <button type="submit" class="btn-submit" :disabled="submitting">
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
</style>
