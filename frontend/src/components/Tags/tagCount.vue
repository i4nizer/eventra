<template>
  <div class="stat-root shadow-lg rounded-lg p-4 flex items-center gap-4 w-full max-w-sm">
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
        {{ formattedCount }}
      </div>

      <div v-if="subtitle" class="text-xs text-muted mt-1">
        {{ subtitle }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  count: { type: Number, default: 90 },
  title: { type: String, default: "Tags" },
  subtitle: {
    type: String,
    default: "Number of distributed/activated RFID tags",
  },
  icon: { type: String, default: "fa-solid fa-user-graduate" },
  loading: { type: Boolean, default: false },
});

const formattedCount = computed(() => props.count.toLocaleString());
</script>

<style scoped>
.stat-root {
  background: var(--surface2);
  color: var(--text);
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  width: 100%;
  max-width: 24rem;
}

.icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 8px;
  background: rgba(16,185,129,0.08);
  color: var(--accent);
}

.text-muted { color: var(--muted); }
.stat-count { color: var(--text); }

.skeleton { background: var(--border); }
i { line-height: 1; }
</style>
