<template>
  <article
    class="bg-white dark:bg-gray-800 shadow rounded-lg p-4 w-full max-w-md"
  >
    <header class="flex items-start justify-between gap-4">
      <div>
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {{ event.title }}
        </h3>
        <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span class="inline-flex items-center gap-2 mr-3">
            <i class="fa-solid fa-calendar-days w-4"></i>
            {{ formattedDate }}
          </span>
          <span class="inline-flex items-center gap-2">
            <i class="fa-solid fa-location-dot w-4"></i>
            {{ event.location || "—" }}
          </span>
        </div>
      </div>

      <div class="text-sm text-right">
        <div
          :class="
            event.status === 'cancelled' ? 'text-red-500' : 'text-emerald-600'
          "
        >
          {{ event.status ? event.status.toUpperCase() : "UPCOMING" }}
        </div>
        <div class="text-xs text-gray-400 mt-1">{{ event.type || "" }}</div>
      </div>
    </header>

    <div class="mt-4 border-t pt-4">
      <!-- table-like rows -->
      <dl class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div class="flex flex-col">
          <dt class="text-xs text-gray-500 dark:text-gray-400">Registered</dt>
          <dd class="font-medium text-gray-800 dark:text-gray-100">
            {{ attendees }}
          </dd>
        </div>

        <div class="flex flex-col">
          <dt class="text-xs text-gray-500 dark:text-gray-400">Absent</dt>
          <dd class="font-medium text-red-600">
            {{ absent }}
          </dd>
        </div>

        <div class="flex flex-col">
          <dt class="text-xs text-gray-500 dark:text-gray-400">Present</dt>
          <dd class="font-medium text-emerald-600">
            {{ present }}
          </dd>
        </div>

        <div class="flex flex-col">
          <dt class="text-xs text-gray-500 dark:text-gray-400">Capacity</dt>
          <dd class="font-medium text-gray-700 dark:text-gray-200">
            {{ capacityDisplay }}
          </dd>
        </div>
      </dl>

      <!-- percentages / progress -->
      <div class="mt-4">
        <div
          class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400"
        >
          <span>Present — {{ percentPresent }}%</span>
          <span>Absent — {{ percentAbsent }}%</span>
        </div>

        <div
          class="w-full bg-gray-100 dark:bg-gray-700 h-3 rounded-full mt-2 overflow-hidden"
        >
          <div
            class="h-3 rounded-full bg-emerald-500 transition-[width] duration-500"
            :style="{ width: percentPresent + '%' }"
          ></div>
        </div>
      </div>

      <!-- optional description / details -->
      <p
        v-if="event.description"
        class="mt-3 text-sm text-gray-600 dark:text-gray-300"
      >
        {{ event.description }}
      </p>

      <!-- actions -->
      <div class="flex items-center gap-2 mt-4">
        <button
          @click="$emit('view', event)"
          class="px-3 py-1 text-sm rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
        >
          <i class="fa-solid fa-eye mr-2"></i> View
        </button>

        <button
          @click="$emit('export', event)"
          class="px-3 py-1 text-sm rounded bg-gray-50 text-gray-700 hover:bg-gray-100"
        >
          <i class="fa-solid fa-file-export mr-2"></i> Export
        </button>

        <button
          v-if="event.status !== 'cancelled'"
          @click="$emit('markAbsent', event)"
          class="ml-auto px-3 py-1 text-sm rounded bg-red-50 text-red-600 hover:bg-red-100"
        >
          <i class="fa-solid fa-user-slash mr-2"></i> Mark absent
        </button>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  event: {
    type: Object,
    required: true,
    default: () => ({}),
  },
});

const attendees = computed(() =>
  Number(props.event.attendees ?? props.event.registered ?? 0)
);
const absent = computed(() => Number(props.event.absent ?? 0));
const present = computed(() => Math.max(0, attendees.value - absent.value));
const capacityDisplay = computed(() => {
  const cap = props.event.capacity ?? null;
  return cap ? `${cap}` : "—";
});

const percentPresent = computed(() =>
  attendees.value > 0 ? Math.round((present.value / attendees.value) * 100) : 0
);
const percentAbsent = computed(() =>
  attendees.value > 0 ? Math.round((absent.value / attendees.value) * 100) : 0
);

const formattedDate = computed(() => {
  if (!props.event.date) return "—";
  try {
    const d = new Date(props.event.date);
    return d.toLocaleString();
  } catch {
    return props.event.date;
  }
});
</script>

<style scoped>
/* smooth progress animation */
div[style] {
  will-change: width;
}
</style>
