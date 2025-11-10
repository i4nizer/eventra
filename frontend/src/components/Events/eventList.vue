<template>
  <div class="event-list-wrapper">
    <!-- Search & Sort -->
    <div class="header-controls">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search events..."
        class="search-input"
      />

      <select v-model="sortBy" class="sort-select">
        <option value="name">Name</option>
        <option value="startTime">Start Time</option>
        <option value="endTime">End Time</option>
        <option value="section">Section</option>
      </select>
    </div>

    <!-- Event Cards Grid -->
    <div class="event-cards">
      <div
        v-for="event in filteredAndSortedEvents"
        :key="event.id"
        class="event-card"
        @click="openModal(event)"
      >
        <div class="event-card-content">
          <div>
            <h3 class="event-title">{{ event.name }}</h3>
            <p class="event-time">
              📅 {{ event.startTime }} — {{ event.endTime }}
            </p>
            <p class="event-section">🎓 {{ event.section }}</p>
            <p class="event-fines">
              💰 Fines: ₱{{ event.fines.toLocaleString() }}
            </p>
          </div>
          <button class="view-btn">View Details →</button>
        </div>
      </div>
    </div>

    <!-- No Results -->
    <p v-if="filteredAndSortedEvents.length === 0" class="no-results">
      No events found.
    </p>

    <!-- Event Modal -->
    <EventModal
      v-if="selectedEvent"
      :event="selectedEvent"
      @close="closeModal"
      @edit="editEvent"
      @delete="deleteEvent"
    />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import EventModal from "./EventModal.vue"; // ✅ Import modal component

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
const selectedEvent = ref(null);

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

const openModal = (event) => (selectedEvent.value = event);
const closeModal = () => (selectedEvent.value = null);
const editEvent = (event) => alert(`Editing ${event.name}`);
const deleteEvent = (id) => {
  if (confirm("Are you sure you want to delete this event?")) {
    events.value = events.value.filter((e) => e.id !== id);
    closeModal();
  }
};
</script>

<style scoped>
.event-list-wrapper {
  width: 100%;
  padding: 1.5rem;
  background: var(--bg);
  color: var(--text);
}

/* Header Controls */
.header-controls {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
  gap: 0.75rem;
}

@media (min-width: 640px) {
  .header-controls {
    flex-direction: row;
    align-items: center;
  }
}

.search-input {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid var(--border);
  border-radius: 9999px;
  background: var(--surface);
  color: var(--text);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  outline: none;
  transition: all 0.2s;
}

@media (min-width: 640px) {
  .search-input {
    width: 33.333333%;
  }
}

.search-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.search-input::placeholder {
  color: var(--muted);
}

.sort-select {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  outline: none;
  transition: all 0.2s;
  border-radius: 0.375rem;
}

.sort-select:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

/* Event Cards Grid */
.event-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding-bottom: 0.5rem;
}

.event-card {
  width: 100%;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

@media (min-width: 640px) {
  .event-card {
    width: calc(50% - 0.5rem);
  }
}

@media (min-width: 768px) {
  .event-card {
    width: calc(33.333333% - 0.667rem);
  }
}

@media (min-width: 1024px) {
  .event-card {
    width: calc(25% - 0.75rem);
  }
}

.event-card:hover {
  box-shadow: 0 0 15px 3px rgba(16, 185, 129, 0.25);
  border-color: var(--accent);
  transform: translateY(-2px);
}

.event-card-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding: 1.25rem;
}

/* Event Info */
.event-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 0.25rem;
}

.event-time {
  font-size: 0.875rem;
  color: var(--muted);
  margin-bottom: 0.25rem;
}

.event-section {
  font-size: 0.875rem;
  color: var(--text);
  margin-bottom: 0.25rem;
}

.event-fines {
  font-size: 0.875rem;
  color: #ef4444;
  font-weight: 500;
}

/* View Button */
.view-btn {
  margin-top: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--accent);
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: color 0.2s;
}

.view-btn:hover {
  opacity: 0.8;
}

/* No Results */
.no-results {
  text-align: center;
  color: var(--muted);
  margin-top: 1.5rem;
}

/* Scrollbar Styling */
.event-cards::-webkit-scrollbar {
  height: 8px;
}

.event-cards::-webkit-scrollbar-thumb {
  background-color: var(--accent);
  opacity: 0.6;
  border-radius: 8px;
}

.event-cards::-webkit-scrollbar-track {
  background-color: var(--surface);
}

/* Dark mode specific adjustments */
:global(.dark) .event-card {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
}

:global(.dark) .event-card:hover {
  box-shadow: 0 0 15px 3px rgba(16, 185, 129, 0.4);
}
</style>
