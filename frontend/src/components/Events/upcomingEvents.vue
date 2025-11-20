\
<template>
  <div class="upcoming-events-landscape mt-6">
    <h2 class="text-xl font-bold mb-4">Upcoming Events</h2>

    <div class="events-container flex overflow-x-auto space-x-4 pb-2">
      <div
        v-for="event in events"
        :key="event.id"
        class="event-card flex-shrink-0 w-64 bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
        @click="goToEvent(event)"
      >
        <img
          v-if="event.image"
          :src="event.image"
          :alt="event.title"
          class="w-full h-32 object-cover rounded-md mb-3"
        />
        <h3 class="text-lg font-semibold">{{ event.title }}</h3>
        <p class="text-gray-500 text-sm">{{ formatDate(event.date) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// Example events data; replace with API or props
const events = ref([
  {
    id: 1,
    title: "Orientation Day",
    date: "2025-11-25",
    description: "Welcome event for new students.",
    image: null,
  },
  {
    id: 2,
    title: "Science Fair",
    date: "2025-12-01",
    description: "Annual science fair showcasing projects.",
    image: null,
  },
  {
    id: 3,
    title: "Sports Meet",
    date: "2025-12-10",
    description: "Inter-school sports competition.",
    image: null,
  },
  {
    id: 4,
    title: "Art Exhibition",
    date: "2025-12-15",
    description: "Showcase of student artworks.",
    image: null,
  },
  {
    id: 5,
    title: "Christmas Party",
    date: "2025-12-20",
    description: "End of year celebration.",
    image: null,
  },
  {
    id: 6,
    title: "New Year Event",
    date: "2026-01-01",
    description: "Welcoming the new year together.",
    image: null,
  },
]);

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
</script>

<style scoped>
.upcoming-events-landscape {
  width: 100%;
}

/* Horizontal scrollbar styling */
.events-container::-webkit-scrollbar {
  height: 8px;
}

.events-container::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}

.events-container::-webkit-scrollbar-track {
  background: transparent;
}

/* Limit description lines for uniform card height */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
