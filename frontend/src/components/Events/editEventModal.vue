<template>
  <Teleport to="body">
    <Transition name="modal">
      <div class="modal-overlay" @click.self="onClose">
        <!-- Modal -->
        <form @submit.prevent="onSubmit" class="modal-container modal-scrollable modal-large">
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
              @click="onClose"
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
                v-model="activity.name"
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
                  v-model="activity.startAt"
                  type="datetime-local"
                  class="input-field"
                  :class="{ 'input-error': errors.startAt }"
                />
                <p v-if="errors.startAt" class="error-message">
                  {{ activity.startAt }}
                </p>
              </div>
              <div class="flex-1">
                <label class="input-label">Finish Time</label>
                <input
                  v-model="activity.finishAt"
                  type="datetime-local"
                  class="input-field"
                  :class="{ 'input-error': errors.finishAt }"
                />
                <p v-if="errors.finishAt" class="error-message">
                  {{ activity.finishAt }}
                </p>
              </div>
            </div>

            <!-- Event Entries -->
            <div>
              <label class="input-label">Event Entries</label>
              <div
                v-for="(entry, index) in entries"
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
                      'input-error': errors.entries?.[index]?.name,
                    }"
                  />
                  <p
                    v-if="errors.entries?.[index]?.name"
                    class="error-message"
                  >
                    {{ errors.entries[index].name }}
                  </p>
                </div>

                <div class="flex-1">
                  <label class="input-label">Start Date & Time</label>
                  <input
                    v-model="entry.startAt"
                    type="datetime-local"
                    class="input-field"
                    :class="{
                      'input-error': errors.entries?.[index]?.startAt,
                    }"
                  />
                  <p
                    v-if="errors.entries?.[index]?.startAt"
                    class="error-message"
                  >
                    {{ errors.entries[index].startAt }}
                  </p>
                </div>

                <div class="flex-1">
                  <label class="input-label">End Date & Time</label>
                  <input
                    v-model="entry.finishAt"
                    type="datetime-local"
                    class="input-field"
                    :class="{
                      'input-error': errors.entries?.[index]?.finishAt,
                    }"
                  />
                  <p
                    v-if="errors.entries?.[index]?.finishAt"
                    class="error-message"
                  >
                    {{ errors.entries[index].finishAt }}
                  </p>
                </div>

                <button
                  type="button"
                  class="btn-remove-entry"
                  @click="removeActivityEntry(index)"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>

              <button type="button" class="btn-add" @click="appendActivityEntry">
                + Add Time Entry
              </button>
            </div>

            <!-- Sections -->
            <div>
              <label class="input-label">Sections / Year Levels</label>
              <input
                v-model="query"
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
                  v-for="s in filtered"
                  :key="s.id"
                  class="flex items-center mb-1"
                >
                  <input
                    type="checkbox"
                    :id="`section-${s.id}`"
                    :value="s"
                    v-model="selected"
                  />
                  <label :for="`section-${s.id}`" class="ml-2">{{
                    s.name
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
                v-model.number="activity.fine"
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

            <!-- Description -->
            <div>
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

          <!-- Footer -->
          <footer class="modal-footer modal-footer-space-between modal-footer-sticky">
            <button
              type="button"
              class="btn-close"
              @click="onClose"
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
import { ref, computed, reactive } from "vue";

//

const props = defineProps({
  sections: { type: Array, default: () => [] },
  activity: { type: Object, default: () => ({}) },
  activityEntries: { type: Array, default: () => [] },
  activitySections: { type: Array, default: () => [] },
  onClose: { type: Function, default: () => (() => {}) },
  onUpdateActivity: { type: Function, default: () => (() => {}) },
  onCreateActivityEntry: { type: Function, default: () => (() => {}) },
  onUpdateActivityEntry: { type: Function, default: () => (() => {}) },
  onDeleteActivityEntry: { type: Function, default: () => (() => {}) },
  onCreateActivitySection: { type: Function, default: () => (() => {}) },
  onDeleteActivitySection: { type: Function, default: () => (() => {}) },
})

//

// --- Formatting
const format = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// --- Activity
const activity = reactive({
  ...props.activity,
  startAt: format(props.activity.startAt),
  finishAt: format(props.activity.finishAt),
})

const sections = reactive([...props.activitySections])

// --- Error Display
const errors = ref({})

// --- Activity Entries
const entries = reactive([...props.activityEntries.map((e) => ({
  ...e,
  startAt: format(e.startAt),
  finishAt: format(e.finishAt),
}))])

const appendActivityEntry = () => entries.push({ name: "", startAt: new Date(), finishAt: new Date() })
const removeActivityEntry = (idx) => entries.splice(idx, 1)

// --- Activity Sections
const query = ref("");
const selected = reactive([...sections.map((a) => props.sections.find((s) => s.id == a.sectionId))])
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

// --- Submittion
const submitting = ref(false);

const onSubmit = async () => {
  const err = validate()
  errors.value = err
  if (Object.keys(err).length) return console.error(err)
  submitting.value = true

  const newents = entries.filter((e) => !e.id)
  const updents = entries.filter((e) => !!e.id && props.activityEntries.some((a) => a.id == e.id))
  const delents = entries.filter((e) => !!e.id && props.activityEntries.every((a) => a.id != e.id))

  const newsecs = selected.filter((s) => props.activitySections.some((a) => a.sectionId == s.id))
  const delsecs = props.activitySections.filter((a) => !selected.some((s) => s.id == a.sectionId))

  console.info("Create Entries: ")
  console.table(newents)
  console.info("Update Entries: ")
  console.table(updents)
  console.info("Delete Entries: ")
  console.table(delents)
  console.info("Create Sections: ")
  console.table(newsecs)
  console.info("Delete Sections: ")
  console.table(delsecs)

  await Promise.resolve()
    .then(() => props.onUpdateActivity(activity))
    .then((res) => res.data)
    .then((act) => [act, Promise.all(newents.map((e) => props.onCreateActivityEntry(act.id, e)))])
    .then((res) => [...res, Promise.all(updents.map((e) => props.onUpdateActivityEntry(res[0].id, e)))])
    .then((res) => [...res, Promise.all(delents.map((e) => props.onDeleteActivityEntry(res[0].id, e)))])
    .then((res) => [...res, Promise.all(newsecs.map((s) => props.onCreateActivitySection(res[0].id, s)))])
    .then((res) => [...res, Promise.all(delsecs.map((s) => props.onDeleteActivitySection(res[0].id, s)))])
    .then((res) => Promise.all(res.flat().slice(1)))
    .then(() => props.onClose())
    .catch((err) => errors.value.submit = err?.message || "Failed to update activity.")
    .finally(() => submitting.value = false)
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