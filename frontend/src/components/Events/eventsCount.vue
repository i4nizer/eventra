<template>
  <div
    class="bg-green shadow-lg rounded-lg p-4 flex items-center gap-4 w-full max-w-sm"
  >
    <div
      class="flex items-center justify-center w-14 h-14 rounded-md bg-emerald-50 text-emerald-600"
      aria-hidden="true"
    >
      <i :class="icon" class="text-2xl"></i>
    </div>

    <div class="flex-1">
      <div class="text-sm text-gray-500">{{ title }}</div>

      <div
        v-if="loading"
        class="mt-1 h-8 w-28 bg-gray-200 rounded animate-pulse"
      ></div>

      <div v-else class="mt-1 text-2xl font-semibold text-gray-900">
        {{ formattedCount }}
      </div>

      <div v-if="subtitle" class="text-xs text-gray-400 mt-1">
        {{ subtitle }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  count: { type: Number, default: 20 },
  title: { type: String, default: "Events" },
  subtitle: { type: String, default: "Number of active or past events" },
  icon: { type: String, default: "fa-solid fa-user-graduate" },
  loading: { type: Boolean, default: false },
});

const formattedCount = computed(() => props.count.toLocaleString());
</script>

<style scoped>
i {
  line-height: 1;
}
</style>
