<template>
  <div class="w-full p-6 bg-white text-gray-800">
    <!-- Search & Sort -->
    <div
      class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3"
    >
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search events..."
        class="w-full sm:w-1/3 px-4 py-2 border border-emerald-200 rounded-full shadow-sm focus:ring-2 focus:ring-emerald-300 focus:outline-none transition"
      />

      <select
        v-model="sortBy"
        class="px-4 py-2 border border-emerald-200 bg-white shadow-sm text-gray-800 focus:ring-2 focus:ring-emerald-300 focus:outline-none transition"
      >
        <option value="name">Name</option>
        <option value="startTime">Start Time</option>
        <option value="endTime">End Time</option>
        <option value="section">Section</option>
      </select>
    </div>

    <!-- Horizontal Scroll Event Cards -->
    <div class="flex overflow-x-auto gap-4 pb-2">
      <div
        v-for="event in filteredAndSortedEvents"
        :key="event.id"
        class="min-w-[300px] flex-shrink-0 bg-white border border-emerald-100 rounded-2xl shadow-md hover:shadow-[0_0_15px_3px_rgba(144,238,144,0.4)] hover:border-emerald-300 transition-all duration-300"
      >
        <div class="flex flex-col justify-between h-full p-5">
          <!-- Event Info -->
          <div>
            <h3 class="text-lg font-semibold text-emerald-700 mb-1">
              {{ event.name }}
            </h3>
            <p class="text-sm text-gray-600">
              📅 {{ event.startTime }} — {{ event.endTime }}
            </p>
            <p class="text-sm text-gray-700">🎓 {{ event.section }}</p>
            <p class="text-sm text-red-500 font-medium">
              💰 Fines: ₱{{ event.fines.toLocaleString() }}
            </p>
          </div>

          <!-- Action Button -->
          <button
            class="mt-3 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
            @click="viewEvent(event)"
          >
            View Details →
          </button>
        </div>
      </div>
    </div>

    <!-- No Results -->
    <p
      v-if="filteredAndSortedEvents.length === 0"
      class="text-center text-gray-500 mt-6"
    >
      No events found.
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const events = ref([
  {
    id: 1,
    name: "Orientation",
    startTime: "8:00 AM",
    endTime: "10:00 AM",
    section: "BSIT 1A",
    fines: 0,
  },
  {
    id: 2,
    name: "Tech Fair",
    startTime: "1:00 PM",
    endTime: "4:00 PM",
    section: "BSCS 2B",
    fines: 150,
  },
  {
    id: 3,
    name: "Hackathon",
    startTime: "9:00 AM",
    endTime: "3:00 PM",
    section: "BSIT 3C",
    fines: 50,
  },
  {
    id: 4,
    name: "General Assembly",
    startTime: "10:00 AM",
    endTime: "12:00 PM",
    section: "BSIT 4A",
    fines: 100,
  },
]);

const searchQuery = ref("");
const sortBy = ref("name");

const filteredAndSortedEvents = computed(() => {
  let result = events.value;

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(
      (e) =>
        e.name.toLowerCase().includes(q) || e.section.toLowerCase().includes(q)
    );
  }

  return [...result].sort((a, b) => {
    if (a[sortBy.value] < b[sortBy.value]) return -1;
    if (a[sortBy.value] > b[sortBy.value]) return 1;
    return 0;
  });
});

const viewEvent = (event) => {
  alert(`Viewing details for ${event.name}`);
};
</script>

<style scoped>
.flex::-webkit-scrollbar {
  height: 8px;
}
.flex::-webkit-scrollbar-thumb {
  background-color: rgba(144, 238, 144, 0.6);
  border-radius: 8px;
}
.flex::-webkit-scrollbar-track {
  background-color: #f3f3f3;
}
</style>
