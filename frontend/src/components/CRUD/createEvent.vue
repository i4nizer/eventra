<template>
  <Transition name="modal">
    <div class="modal-overlay" @click.self="onClose">
      <form @submit.prevent="onSubmit" class="modal-form scrollable modal-large">
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
              v-model="activity.name"
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
                v-model="activity.startAt"
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
                v-model="activity.finishAt"
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
              v-for="(entry, index) in entries"
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
                  :class="{ 'input-error': errors.entries?.[index]?.name }"
                />
                <p v-if="errors.entries?.[index]?.name" class="error-message">
                  {{ errors.entries[index].name }}
                </p>
              </div>

              <div style="flex: 1">
                <label class="input-label">Start Date & Time</label>
                <input
                  v-model="entry.startAt"
                  type="datetime-local"
                  class="input-field"
                  :class="{ 'input-error': errors.entries?.[index]?.startAt }"
                />
                <p v-if="errors.entries?.[index]?.startAt" class="error-message">
                  {{ errors.entries[index].startAt }}
                </p>
              </div>

              <div style="flex: 1">
                <label class="input-label">End Date & Time</label>
                <input
                  v-model="entry.finishAt"
                  type="datetime-local"
                  class="input-field"
                  :class="{ 'input-error': errors.entries?.[index]?.finishAt }"
                />
                <p v-if="errors.entries?.[index]?.finishAt" class="error-message">
                  {{ errors.entries[index].finishAt }}
                </p>
              </div>

              <button
                type="button"
                class="btn-delete action-btn"
                @click="removeActivityEntry(index)"
                style="margin-top: auto; padding: 0.5rem; height: 2.5rem; width: 2.5rem; display: flex; align-items: center; justify-content: center"
              >
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
            <button type="button" class="btn-add" @click="appendActivityEntry">
              <i class="fa-solid fa-plus"></i>
              <span>Add Time Entry</span>
            </button>
          </div>

          <!-- Sections as checkboxes with search -->
          <div style="margin-bottom: 1rem">
            <label class="input-label">Sections / Year Levels</label>
            <input
              v-model="query"
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
                v-for="s in filtered"
                :key="s.id"
                class="checkbox-item"
              >
                <input
                  type="checkbox"
                  :id="`section-${s.id}`"
                  :value="s"
                  v-model="selected"
                  class="checkbox-input"
                />
                <label :for="`section-${s.id}`" class="checkbox-label">{{ `${s.year}-${s.name}` }}</label>
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
              v-model="activity.fine"
              type="number"
              class="input-field"
              :class="{ 'input-error': errors.fine }"
              placeholder="e.g. 50"
              min="0"
              step="0.01"
            />
            <p v-if="errors.fine" class="error-message">
              {{ errors.fine }}
            </p>
          </div>

          <div style="margin-bottom: 1rem">
            <label class="input-label">Description</label>
            <textarea
              v-model="activity.description"
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
import { ref, computed, reactive } from "vue";

//

const props = defineProps({
  sections: { type: Array, default: () => [] },
  onClose: { type: Function, default: () => (() => {}) },
  onCreateActivity: { type: Function, default: () => (() => {}) },
  onCreateActivityEntry: { type: Function, default: () => (() => {}) },
  onCreateActivitySection: { type: Function, default: () => (() => {}) },
})

//

// --- Activity
const activity = reactive({
  name: "",
  fine: "",
  description: "",
  startAt: new Date(),
  finishAt: new Date(),
})

// --- Error Display
const errors = ref({});

// --- Activity Entries
const entries = reactive([{ name: "In AM", startAt: new Date(), finishAt: new Date() }])

const appendActivityEntry = () => entries.push({ name: "", startAt: new Date(), finishAt: new Date() })
const removeActivityEntry = (idx) => entries.splice(idx, 1)

// --- Activity Sections
const query = ref("");
const selected = reactive([])
const filtered = computed(() => props.sections.filter((s) => s.name.toLowerCase().includes(query.value.toLowerCase())))
const selectAll = ref(false)

const toggleSelectAll = () => {
  selected.splice(0, selected.length)
  if (selectAll.value) selected.push(...props.sections)
}

//

// --- Validation
const validate = () => {
  const err = {};
  const { name, fine, description, startAt, finishAt } = activity

  if (!name.trim()) err.name = "Event name is required.";
  if (!description.trim()) err.description = "Description is required.";
  if (fine === "" || fine < 0) err.fine = "Fines must be a positive number.";
  if (!startAt) err.startAt = "Event start time is required.";
  if (!finishAt) err.finishAt = "Event end time is required.";
  if (startAt && finishAt && startAt >= finishAt) err.finishAt = "Event end time must be after start time.";

  const enterr = entries.map((entry) => {
    const entryErrors = {};
    if (!entry.name.trim()) entryErrors.name = "Entry name is required.";
    if (!entry.startAt) entryErrors.startAt = "Start date & time is required.";
    if (!entry.finishAt) entryErrors.finishAt = "End date & time is required.";
    const isEndTimeErr = entry.startAt && entry.finishAt && entry.startAt >= entry.finishAt
    if (isEndTimeErr) entryErrors.finishAt = "End date & time must be after start date & time.";
    return entryErrors;
  }).filter((err) => Object.keys(err).length > 0)

  if (enterr.length > 0) err.entries = enterr
  if (!selected.length) err.section = "Please select at least one section.";
  return err;
}

//

// --- Handling
const submitting = ref(false)

const onSubmit = async () => {
  const err = validate();
  errors.value = err;
  if (Object.keys(err).length) return console.error(err);
  submitting.value = true;

  await props.onCreateActivity(activity)
    .then((res) => [res, console.info(res)])
    .then(([res]) => [res, entries.map((e) => props.onCreateActivityEntry(res.data.id, e))])
    .then(([res, enp]) => [res, enp, selected.map((s) => props.onCreateActivitySection(res.data.id, s))])
    .then(async (res, enp, sep) => await Promise.all([enp, sep]))
    .then(onSubmitSuccess)
    .catch((err) => errors.value.submit = err.message || "Failed to create event")
    .finally(() => submitting.value = false)
}

const onSubmitSuccess = () => {
  activity.name = ""
  activity.fine = ""
  activity.description = ""
  activity.startAt = new Date()
  activity.finishAt = new Date()
  entries.splice(0, entries.length)
  selected.splice(0, selected.length)
  props.onClose()
}

//

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