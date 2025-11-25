<template>
  <div
    class="stat-root shadow-lg rounded-lg p-4 flex items-center gap-4 w-full max-w-sm"
  >
    <div class="icon-box" aria-hidden="true">
      <i :class="icon" class="text-2xl"></i>
    </div>

    <div class="flex-1">
      <div class="text-sm text-muted">{{ title }}</div>

      <div
        v-if="loading"
        class="mt-1 h-8 w-28 skeleton rounded animate-pulse"
      ></div>

      <div v-else class="mt-1 text-2xl font-semibold stat-count">
        {{ activities.length }}
      </div>

      <div v-if="subtitle" class="text-xs text-muted mt-1">
        {{ subtitle }}
      </div>
    </div>
  </div>
</template>

<script setup>

//

const props = defineProps({
  activities: { type: Array, default: () => [] },
  loading: { type: Boolean, default: () => false },
  title: { type: String, default: "Events" },
  subtitle: { type: String, default: "Number of active or past events" },
  icon: { type: String, default: "fa-solid fa-user-graduate" },
});

//

</script>
