<template>
  <Transition name="modal">
    <div v-if="open" class="modal-overlay" @click.self="onClose">
      <form @submit.prevent="handleSubmit" class="modal-form scrollable modal-large">
        <header class="modal-header-inline">
          <div>
            <h3 class="modal-title">Create Event</h3>
            <p class="modal-subtitle">Add a new event to the system.</p>
          </div>
          <button type="button" @click="onClose" class="close-btn">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </header>

        <!-- Form content -->
        <div class="modal-body-simple">
          <div style="margin-bottom: 1rem">
            <label class="input-label">Event name</label>
            <input
              v-model="name"
              class="input-field"
              :class="{ 'input-error': errors.name }"
              placeholder="e.g. Math Club Meeting"
              autofocus
            />
            <p v-if="errors.name" class="error-message">
              {{ errors.name }}
            </p>
          </div>

          <!-- Event Start & End Times -->
          <div style="display: flex; gap: 1rem; margin-bottom: 1rem">
            <div style="flex: 1">
              <label class="input-label">Start Time</label>
              <input
                v-model="startAt"
                type="datetime-local"
                class="input-field"
                :class="{ 'input-error': errors.startAt }"
              />
              <p v-if="errors.startAt" class="error-message">
                {{ errors.startAt }}
              </p>
            </div>

            <div style="flex: 1">
              <label class="input-label">Finish Time</label>
              <input
                v-model="finishAt"
                type="datetime-local"
                class="input-field"
                :class="{ 'input-error': errors.finishAt }"
              />
              <p v-if="errors.finishAt" class="error-message">
                {{ errors.finishAt }}
              </p>
            </div>
          </div>

          <!-- Multiple Time Entries -->
          <div style="margin-bottom: 1rem">
            <label class="input-label">Event Entries</label>
            <div
              v-for="(entry, index) in timeEntries"
              :key="index"
              class="entry-group"
            >
              <div style="flex: 1">
                <label class="input-label">Entry Name</label>
                <input
                  v-model="entry.name"
                  type="text"
                  class="input-field"
                  placeholder="e.g. Opening Ceremony"
                  :class="{ 'input-error': errors.timeEntries?.[index]?.name }"
                />
                <p v-if="errors.timeEntries?.[index]?.name" class="error-message">
                  {{ errors.timeEntries[index].name }}
                </p>
              </div>

              <div style="flex: 1">
                <label class="input-label">Start Date & Time</label>
                <input
                  v-model="entry.startTime"
                  type="datetime-local"
                  class="input-field"
                  :class="{ 'input-error': errors.timeEntries?.[index]?.startTime }"
                />
                <p v-if="errors.timeEntries?.[index]?.startTime" class="error-message">
                  {{ errors.timeEntries[index].startTime }}
                </p>
              </div>

              <div style="flex: 1">
                <label class="input-label">End Date & Time</label>
                <input
                  v-model="entry.endTime"
                  type="datetime-local"
                  class="input-field"
                  :class="{ 'input-error': errors.timeEntries?.[index]?.endTime }"
                />
                <p v-if="errors.timeEntries?.[index]?.endTime" class="error-message">
                  {{ errors.timeEntries[index].endTime }}
                </p>
              </div>

              <button
                type="button"
                class="btn-delete action-btn"
                @click="removeTimeEntry(index)"
                style="margin-top: auto; padding: 0.5rem; height: 2.5rem; width: 2.5rem; display: flex; align-items: center; justify-content: center"
              >
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
            <button type="button" class="btn-add" @click="addTimeEntry">
              <i class="fa-solid fa-plus"></i>
              <span>Add Time Entry</span>
            </button>
          </div>

          <!-- Sections as checkboxes with search -->
          <div style="margin-bottom: 1rem">
            <label class="input-label">Sections / Year Levels</label>
            <input
              v-model="searchQuery"
              placeholder="Search sections..."
              class="input-field"
              style="margin-bottom: 0.5rem"
            />
            <div style="display: flex; align-items: center; margin-bottom: 0.5rem; gap: 0.5rem">
              <input
                type="checkbox"
                id="selectAll"
                v-model="selectAll"
                @change="toggleSelectAll"
                class="checkbox-input"
              />
              <label for="selectAll" class="checkbox-label">Select All</label>
            </div>
            <div class="checkbox-list">
              <div
                v-for="s in filteredSections"
                :key="s.id"
                class="checkbox-item"
              >
                <input
                  type="checkbox"
                  :id="`section-${s.id}`"
                  :value="s.id"
                  v-model="selectedSections"
                  class="checkbox-input"
                />
                <label :for="`section-${s.id}`" class="checkbox-label">{{ s.label }}</label>
              </div>
            </div>
            <p v-if="errors.section" class="error-message">
              {{ errors.section }}
            </p>
          </div>

          <!-- Fines Field -->
          <div style="margin-bottom: 1rem">
            <label class="input-label">Fines</label>
            <input
              v-model="fines"
              type="number"
              class="input-field"
              :class="{ 'input-error': errors.fines }"
              placeholder="e.g. 50"
              min="0"
              step="0.01"
            />
            <p v-if="errors.fines" class="error-message">
              {{ errors.fines }}
            </p>
          </div>

          <div style="margin-bottom: 1rem">
            <label class="input-label">Description</label>
            <textarea
              v-model="description"
              class="input-field"
              :class="{ 'input-error': errors.description }"
              placeholder="Describe the event..."
              rows="3"
            ></textarea>
            <p v-if="errors.description" class="error-message">
              {{ errors.description }}
            </p>
          </div>

          <p v-if="errors.submit" class="error-message-submit">
            {{ errors.submit }}
          </p>
        </div>

        <footer class="modal-footer-inline">
          <button
            type="button"
            @click="onClose"
            class="btn-cancel"
            :disabled="submitting"
          >
            Cancel
          </button>
          <button type="submit" class="btn-submit" :disabled="submitting">
            {{ submitting ? "Creating..." : "Create Event" }}
          </button>
        </footer>
      </form>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, computed } from "vue";

const props = defineProps({
  open: Boolean,
  onClose: Function,
  onCreate: Function,
  sections: { type: Array, default: () => [] },
});

const name = ref("");
const timeEntries = ref([{ name: "", startTime: "", endTime: "" }]);
const selectedSections = ref([]);
const searchQuery = ref("");
const errors = ref({});
const submitting = ref(false);
const selectAll = ref(false);
const fines = ref("");
const startAt = ref("");
const finishAt = ref("");
const description = ref("");

watch(
  () => props.open,
  (val) => {
    if (val) {
      name.value = "";
      fines.value = "";
      timeEntries.value = [{ name: "", startTime: "", endTime: "" }];
      selectedSections.value = [];
      searchQuery.value = "";
      errors.value = {};
      submitting.value = false;
      selectAll.value = false;
      startAt.value = "";
      finishAt.value = "";
      description.value = "";
    }
  }
);

// Add a new time entry
const addTimeEntry = () => {
  timeEntries.value.push({ name: "", startTime: "", endTime: "" });
};

// Remove a time entry
const removeTimeEntry = (index) => {
  timeEntries.value.splice(index, 1);
};

// Filter sections based on the search query
const filteredSections = computed(() => {
  return props.sections.filter((s) =>
    s.label.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Toggle select all functionality
const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedSections.value = props.sections.map((s) => s.id);
  } else {
    selectedSections.value = [];
  }
};

// Update the validation function to include fines
function validate() {
  const err = {};
  if (!name.value.trim()) err.name = "Event name is required.";
  if (!description.value.trim()) err.description = "Description is required.";
  if (fines.value === "" || fines.value < 0)
    err.fines = "Fines must be a positive number.";
  if (!startAt.value) err.startAt = "Event start time is required.";
  if (!finishAt.value) err.finishAt = "Event end time is required.";
  if (startAt.value && finishAt.value && startAt.value >= finishAt.value) {
    err.finishAt = "Event end time must be after start time.";
  }

  err.timeEntries = timeEntries.value.map((entry) => {
    const entryErrors = {};
    if (!entry.name.trim()) entryErrors.name = "Entry name is required.";
    if (!entry.startTime)
      entryErrors.startTime = "Start date & time is required.";
    if (!entry.endTime) entryErrors.endTime = "End date & time is required.";
    if (entry.startTime && entry.endTime && entry.startTime >= entry.endTime) {
      entryErrors.endTime = "End date & time must be after start date & time.";
    }
    return entryErrors;
  });
  if (err.timeEntries.some((entry) => Object.keys(entry).length > 0)) {
    err.timeEntries = err.timeEntries;
  } else {
    delete err.timeEntries;
  }
  if (!selectedSections.value.length)
    err.section = "Please select at least one section.";
  return err;
}

// Include event start/end in payload
async function handleSubmit() {
  const err = validate();
  errors.value = err;
  if (Object.keys(err).length) return;

  submitting.value = true;

  const payload = {
    name: name.value.trim(),
    fines: parseFloat(fines.value),
    startAt: startAt.value,
    finishAt: finishAt.value,
    timeEntries: timeEntries.value,
    sections: selectedSections.value,
    description: description.value.trim(),
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
/* Entry group layout */
.entry-group {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  margin-bottom: 0.75rem;
}

/* Checkbox list container */
.checkbox-list {
  max-height: 10rem;
  overflow-y: auto;
  border: 1px solid var(--border);
  border-radius: 0.375rem;
  padding: 0.5rem;
  background: var(--surface);
}

/* Checkbox items */
.checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0;
}

.checkbox-input {
  cursor: pointer;
  width: 1rem;
  height: 1rem;
  accent-color: var(--accent);
}

.checkbox-label {
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--text);
  user-select: none;
}

.checkbox-label:hover {
  color: var(--accent);
}
</style>