<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click.self="close">
        <!-- Modal -->
        <form @submit.prevent="saveChanges" class="modal-container modal-scrollable modal-large">
          <!-- Header -->
          <header class="modal-header modal-header-sticky">
            <div>
              <h3 class="modal-title">Edit Event</h3>
              <p class="modal-subtitle">
                Modify event details and information.
              </p>
            </div>
            <button
              type="button"
              @click="close"
              class="close-btn"
              aria-label="Close modal"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
          </header>

          <!-- Form Content -->
          <div class="modal-body">
            <!-- Event Name -->
            <div>
              <label class="input-label">Event Name</label>
              <input
                v-model="editableEvent.name"
                class="input-field"
                :class="{ 'input-error': errors.name }"
                placeholder="e.g. Math Club Meeting"
                autofocus
              />
              <p v-if="errors.name" class="error-message">{{ errors.name }}</p>
            </div>

            <!-- Start & Finish Times -->
            <div class="flex gap-4">
              <div class="flex-1">
                <label class="input-label">Start Time</label>
                <input
                  v-model="editableEvent.startAt"
                  type="datetime-local"
                  class="input-field"
                  :class="{ 'input-error': errors.startAt }"
                />
                <p v-if="errors.startAt" class="error-message">
                  {{ errors.startAt }}
                </p>
              </div>
              <div class="flex-1">
                <label class="input-label">Finish Time</label>
                <input
                  v-model="editableEvent.finishAt"
                  type="datetime-local"
                  class="input-field"
                  :class="{ 'input-error': errors.finishAt }"
                />
                <p v-if="errors.finishAt" class="error-message">
                  {{ errors.finishAt }}
                </p>
              </div>
            </div>

            <!-- Event Entries -->
            <div>
              <label class="input-label">Event Entries</label>
              <div
                v-for="(entry, index) in editableEvent.timeEntries"
                :key="index"
                class="entry-group"
              >
                <div class="flex-1">
                  <label class="input-label">Entry Name</label>
                  <input
                    v-model="entry.name"
                    type="text"
                    class="input-field"
                    placeholder="e.g. Opening Ceremony"
                    :class="{
                      'input-error': errors.timeEntries?.[index]?.name,
                    }"
                  />
                  <p
                    v-if="errors.timeEntries?.[index]?.name"
                    class="error-message"
                  >
                    {{ errors.timeEntries[index].name }}
                  </p>
                </div>

                <div class="flex-1">
                  <label class="input-label">Start Date & Time</label>
                  <input
                    v-model="entry.startTime"
                    type="datetime-local"
                    class="input-field"
                    :class="{
                      'input-error': errors.timeEntries?.[index]?.startTime,
                    }"
                  />
                  <p
                    v-if="errors.timeEntries?.[index]?.startTime"
                    class="error-message"
                  >
                    {{ errors.timeEntries[index].startTime }}
                  </p>
                </div>

                <div class="flex-1">
                  <label class="input-label">End Date & Time</label>
                  <input
                    v-model="entry.endTime"
                    type="datetime-local"
                    class="input-field"
                    :class="{
                      'input-error': errors.timeEntries?.[index]?.endTime,
                    }"
                  />
                  <p
                    v-if="errors.timeEntries?.[index]?.endTime"
                    class="error-message"
                  >
                    {{ errors.timeEntries[index].endTime }}
                  </p>
                </div>

                <button
                  type="button"
                  class="btn-remove-entry"
                  @click="removeTimeEntry(index)"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>

              <button type="button" class="btn-add" @click="addTimeEntry">
                + Add Time Entry
              </button>
            </div>

            <!-- Sections -->
            <div>
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
                  v-for="s in filteredSections"
                  :key="s.id"
                  class="flex items-center mb-1"
                >
                  <input
                    type="checkbox"
                    :id="`section-${s.id}`"
                    :value="s.id"
                    v-model="editableEvent.sections"
                  />
                  <label :for="`section-${s.id}`" class="ml-2">{{
                    s.label
                  }}</label>
                </div>
              </div>
              <p v-if="errors.sections" class="error-message">
                {{ errors.sections }}
              </p>
            </div>

            <!-- Fines -->
            <div>
              <label class="input-label">Fines</label>
              <input
                v-model.number="editableEvent.fines"
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

            <!-- Description -->
            <div>
              <label class="input-label">Description</label>
              <textarea
                v-model="editableEvent.description"
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

          <!-- Footer -->
          <footer class="modal-footer modal-footer-space-between modal-footer-sticky">
            <button
              type="button"
              class="btn-close"
              @click="close"
              :disabled="submitting"
            >
              Close
            </button>
            <button type="submit" class="btn-submit" :disabled="submitting">
              <i class="fa-solid fa-floppy-disk"></i>
              <span>{{ submitting ? "Saving..." : "Save Changes" }}</span>
            </button>
          </footer>
        </form>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  event: Object,
  sections: Array,
  show: Boolean,
});

const emit = defineEmits(["close", "update"]);

const searchQuery = ref("");
const selectAll = ref(false);
const errors = ref({});
const submitting = ref(false);

// Helper: format date for datetime-local input
const formatForInput = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Editable event with formatted startAt/finishAt and entries
const editableEvent = ref({});

watch(
  () => props.event,
  (newVal) => {
    if (!newVal) return;
    editableEvent.value = {
      ...newVal,
      startAt: formatForInput(newVal.startAt),
      finishAt: formatForInput(newVal.finishAt),
      timeEntries:
        newVal.timeEntries?.map((e) => ({
          ...e,
          startTime: formatForInput(e.startTime),
          endTime: formatForInput(e.endTime),
        })) || [],
    };
  },
  { immediate: true }
);

const filteredSections = computed(() =>
  props.sections.filter((s) =>
    s.label.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

watch(
  () => editableEvent.value.sections,
  () => {
    selectAll.value =
      editableEvent.value.sections.length === props.sections.length;
  }
);

const toggleSelectAll = () => {
  if (selectAll.value)
    editableEvent.value.sections = props.sections.map((s) => s.id);
  else editableEvent.value.sections = [];
};

const addTimeEntry = () =>
  editableEvent.value.timeEntries.push({
    name: "",
    startTime: "",
    endTime: "",
  });

const removeTimeEntry = (index) =>
  editableEvent.value.timeEntries.splice(index, 1);

const close = () => emit("close");

const validate = () => {
  errors.value = {};
  let valid = true;

  if (!editableEvent.value.name?.trim()) {
    errors.value.name = "Event name is required";
    valid = false;
  }
  if (!editableEvent.value.sections?.length) {
    errors.value.sections = "Select at least one section";
    valid = false;
  }
  if (editableEvent.value.fines < 0) {
    errors.value.fines = "Fines cannot be negative";
    valid = false;
  }

  editableEvent.value.timeEntries.forEach((e, i) => {
    if (!e.name) {
      errors.value.timeEntries = errors.value.timeEntries || {};
      errors.value.timeEntries[i] = errors.value.timeEntries[i] || {};
      errors.value.timeEntries[i].name = "Entry name required";
      valid = false;
    }
    if (!e.startTime) {
      errors.value.timeEntries[i].startTime = "Start time required";
      valid = false;
    }
    if (!e.endTime) {
      errors.value.timeEntries[i].endTime = "End time required";
      valid = false;
    }
  });

  if (!editableEvent.value.startAt) {
    errors.value.startAt = "Start time required";
    valid = false;
  }
  if (!editableEvent.value.finishAt) {
    errors.value.finishAt = "Finish time required";
    valid = false;
  }

  return valid;
};

const saveChanges = () => {
  if (!validate()) return;
  submitting.value = true;

  const updatedEvent = {
    ...editableEvent.value,
    startAt: new Date(editableEvent.value.startAt).toISOString(),
    finishAt: new Date(editableEvent.value.finishAt).toISOString(),
    timeEntries: editableEvent.value.timeEntries.map((e) => ({
      ...e,
      startTime: new Date(e.startTime).toISOString(),
      endTime: new Date(e.endTime).toISOString(),
    })),
  };

  setTimeout(() => {
    emit("update", updatedEvent);
    submitting.value = false;
    close();
  }, 200);
};
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

.entry-group {
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  padding: 1rem;
  margin-bottom: 0.5rem;
  background: var(--surface);
  border-radius: 0.5rem;
  border: 1px solid var(--border);
}

.btn-remove-entry {
  background-color: var(--danger);
  color: #fff;
  padding: 0.5rem;
  border-radius: 0.375rem;
  cursor: pointer;
  height: 2.5rem;
  width: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border: none;
  transition: opacity 0.15s;
}

.btn-remove-entry:hover {
  opacity: 0.9;
}

.btn-remove-entry i {
  font-size: 1rem;
}

.checkbox-list {
  max-height: 10rem;
  overflow-y: auto;
  border: 1px solid var(--border);
  border-radius: 0.375rem;
  padding: 0.5rem;
  background: var(--surface);
}

.space-y-4 > * + * {
  margin-top: 1rem;
}

.flex {
  display: flex;
}

.flex-1 {
  flex: 1;
}

.gap-4 {
  gap: 1rem;
}

.items-center {
  align-items: center;
}

.mb-1 {
  margin-bottom: 0.25rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.ml-2 {
  margin-left: 0.5rem;
}

.h-5 {
  height: 1.25rem;
}

.w-5 {
  width: 1.25rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .modal-form {
    max-width: 95vw;
  }

  .entry-group {
    flex-direction: column;
    align-items: stretch;
  }

  .entry-group > div {
    width: 100%;
  }

  .btn-remove-entry {
    width: 100%;
    height: auto;
    padding: 0.75rem;
  }
}
</style>