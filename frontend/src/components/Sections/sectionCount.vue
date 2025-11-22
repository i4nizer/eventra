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
        {{ formattedCount }}
      </div>

      <div v-if="subtitle" class="text-xs text-muted mt-1">
        {{ subtitle }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onBeforeMount } from "vue";
import { useApi } from "@/composables/api";

const { api } = useApi();
const loading = ref(true);

// --- Sections
const section = ref([]);
const getSection = async () => {
  loading.value = true;
  await api
    .get(`/section`)
    .then((res) => {
      section.value = res.data;
    })
    .catch((error) => {
      console.error("Error fetching section:", error);
    })
    .finally(() => {
      loading.value = false;
    });
};

onBeforeMount(getSection);

const formattedCount = computed(() => section.value.length.toLocaleString());

const props = defineProps({
  title: { type: String, default: "Sections" },
  subtitle: { type: String, default: "Number of class sections" },
  icon: { type: String, default: "fa-solid fa-layer-group" },
});
</script>
