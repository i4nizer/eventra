<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
  >
    <div
      class="absolute inset-0 bg-black/50 backdrop-blur-sm"
      @click="onClose"
      aria-hidden="true"
    ></div>

    <form
      @submit.prevent="handleSubmit"
      class="relative z-10 w-full max-w-xl rounded-2xl bg-white/95 dark:bg-slate-900 p-6 shadow-2xl ring-1 ring-slate-900/5"
      role="dialog"
      aria-modal="true"
      aria-label="Create event"
    >
      <header class="mb-4 flex items-start justify-between">
        <div>
          <h3 class="text-lg font-semibold">Create Event</h3>
          <p class="text-sm text-slate-500">
            Add a new event with time and section/year level.
          </p>
        </div>
        <button
          type="button"
          @click="onClose"
          class="-m-2 rounded-md p-2 text-slate-500 hover:bg-slate-100"
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
          <label class="mb-1 block text-sm font-medium">Event name</label>
          <input
            v-model="name"
            class="w-full rounded-lg border px-3 py-2 text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            :class="{
              'border-red-400': errors.name,
              'border-slate-200': !errors.name,
            }"
            placeholder="e.g. Math Club Meeting"
            autofocus
          />
          <p v-if="errors.name" class="mt-1 text-xs text-red-600">
            {{ errors.name }}
          </p>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="mb-1 block text-sm font-medium">Start time</label>
            <input
              v-model="startTime"
              type="time"
              class="w-full rounded-lg border px-3 py-2 text-sm shadow-sm"
              :class="{
                'border-red-400': errors.startTime || errors.time,
                'border-slate-200': !errors.startTime && !errors.time,
              }"
            />
            <p v-if="errors.startTime" class="mt-1 text-xs text-red-600">
              {{ errors.startTime }}
            </p>
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium">End time</label>
            <input
              v-model="endTime"
              type="time"
              class="w-full rounded-lg border px-3 py-2 text-sm shadow-sm"
              :class="{
                'border-red-400': errors.endTime || errors.time,
                'border-slate-200': !errors.endTime && !errors.time,
              }"
            />
            <p v-if="errors.endTime" class="mt-1 text-xs text-red-600">
              {{ errors.endTime }}
            </p>
          </div>
        </div>
        <p v-if="errors.time" class="text-xs text-red-600">{{ errors.time }}</p>

        <div>
          <label class="mb-1 block text-sm font-medium"
            >Section / Year level</label
          >
          <select
            v-if="sections && sections.length"
            v-model="section"
            class="w-full rounded-lg border px-3 py-2 text-sm shadow-sm"
            :class="{
              'border-red-400': errors.section,
              'border-slate-200': !errors.section,
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
            class="w-full rounded-lg border px-3 py-2 text-sm shadow-sm"
            :class="{
              'border-red-400': errors.section,
              'border-slate-200': !errors.section,
            }"
          />
          <p v-if="errors.section" class="mt-1 text-xs text-red-600">
            {{ errors.section }}
          </p>
        </div>

        <p v-if="errors.submit" class="text-sm text-red-600">
          {{ errors.submit }}
        </p>
      </div>

      <footer class="mt-6 flex items-center justify-end gap-3">
        <button
          type="button"
          @click="onClose"
          class="rounded-lg px-4 py-2 text-sm font-medium hover:bg-slate-100"
          :disabled="submitting"
        >
          Cancel
        </button>

        <button
          type="submit"
          class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700 disabled:opacity-60"
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

<!-- Example usage:
<template>
  <div class="p-6">
    <button @click="open = true" class="rounded bg-indigo-600 px-4 py-2 text-white">New Event</button>
    <CreateEventModal :open="open" :onClose="() => open = false" :onCreate="handleCreate" :sections="sections" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import CreateEventModal from './CreateEventModal.vue';

const open = ref(false);
const sections = ref([
  { id: '1A', label: '1A / Grade 7' },
  { id: '2B', label: '2B / Grade 8' },
  { id: '3C', label: '3C / Grade 9' },
]);

async function handleCreate(evt) {
  console.log('Creating event', evt);
}
</script>
-->
