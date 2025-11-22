<template>
  <div class="mt-6" style="width: 100%;">
    <h2 class="text-xl font-bold mb-4" style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: var(--text);">
      Upcoming Events
    </h2>

    <div 
      class="flex overflow-x-auto space-x-4 pb-2"
      style="display: flex; overflow-x: auto; gap: 1rem; padding-bottom: 0.5rem;"
    >
      <div
        v-for="event in events"
        :key="event.id"
        class="surface"
        style="
          flex-shrink: 0;
          width: 16rem;
          border-radius: 0.5rem;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.15s;
          border: 1px solid var(--border);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        "
        @click="goToEvent(event)"
        @mouseenter="$event.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.15)'"
        @mouseleave="$event.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'"
      >
        <img
          v-if="event.image"
          :src="event.image"
          :alt="event.title"
          style="
            width: 100%;
            height: 8rem;
            object-fit: cover;
            border-radius: 0.375rem;
            margin-bottom: 0.75rem;
          "
        />
        <h3 style="font-size: 1.125rem; font-weight: 600; color: var(--text); margin-bottom: 0.25rem;">
          {{ event.title }}
        </h3>
        <p class="text-muted" style="font-size: 0.875rem;">
          {{ formatDate(event.date) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { useApi } from "@/composables/api";

const router = useRouter();
const { api } = useApi();

//--- Events
const events = ref([]);
const getEvents = async () => {
  await api
    .get("/activity")
    .then((res) => {
      events.value = res.data.map((event) => ({
        id: event.id,
        title: event.name,
        date: event.startAt,
        description: event.description,
      }));
    })
    .catch(console.error);
};

const goToEvent = (event) => {
  router.push(`/events`);
};

const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

onBeforeMount(getEvents);
</script>

<style scoped>
/* Horizontal scrollbar styling using theme variables */
div[style*="overflow-x: auto"]::-webkit-scrollbar {
  height: 8px;
}

div[style*="overflow-x: auto"]::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}

div[style*="overflow-x: auto"]::-webkit-scrollbar-track {
  background: transparent;
}

/* Dark mode scrollbar */
.dark div[style*="overflow-x: auto"]::-webkit-scrollbar-thumb {
  background-color: var(--accent);
}
</style>