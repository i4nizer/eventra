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
        <option value="eventDate">Event Date</option>
        <option value="fines">Fines</option>
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

            <!-- Event Date -->
            <p class="event-date flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {{ formatDate(event.eventDate) }}
            </p>

            <!-- Sections -->
            <p class="event-section flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 14l9-5-9-5-9 5 9 5z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 14l6.16-3.422a12.083 12.083 0 01.34 6.825L12 14z"
                />
              </svg>
              {{
                event.sections
                  .map((id) => {
                    const sec = sections.value?.find(
                      (s) => Number(s.id) === Number(id)
                    );
                    return sec ? sec.label : `Unknown Section`; // fallback text instead of raw ID
                  })
                  .join(", ") || "No sections"
              }}
            </p>

            <!-- Fines -->
            <p class="event-fines flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-3 0-5 2-5 5s2 5 5 5 5-2 5-5-2-5-5-5z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 2v4m0 12v4M4 12H8m8 0h4"
                />
              </svg>
              ₱{{ event.fines.toLocaleString() }}
            </p>

            <!-- Created At -->
            <p class="event-created flex items-center gap-1">
              Event Created:
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {{ formatDate(event.createdAt) }}
            </p>

            <!-- Elegant Description -->
            <p class="event-description">
              {{ event.description }}
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
      :sections="sections"
      @close="closeModal"
      @update="updateEvent"
      @delete="deleteEvent"
    />
  </div>
</template>

<script setup>
import { format } from "date-fns"; // Import date-fns for formatting
import { useApi } from "@/composables/api";
import { ref, computed, onBeforeMount } from "vue";
import EventModal from "./EventModal.vue"; // ✅ Import modal component

//

const { api } = useApi();

//

// --- Events
const events = ref([
  // {
  //   id: 1,
  //   name: "Orientation",
  //   timeEntries: [
  //     { name: "Opening", startTime: "08:00", endTime: "09:00" },
  //     { name: "Main Event", startTime: "09:00", endTime: "10:00" },
  //   ],
  //   sections: ["BSIT 1A", "BSIT 1B"],
  //   fines: 0,
  //   eventDate: "2025-11-23",
  //   createdAt: "2025-11-20",
  // },
]);

const getEvents = async () => {
  const activities = await api
    .get("/activity")
    .then((res) => res.data)
    .catch(() => undefined);
  if (!activities) return console.error(`Failed to GET events.`);

  const eprms = [];
  for (const activity of activities) {
    // --- Fetch activity's entries and sections
    const actentprms = api
      .get(`/activity/${activity.id}/entry`)
      .then((res) => res.data)
      .catch(() => []);
    const actsecprms = api
      .get(`/activity/${activity.id}/section`)
      .then((res) => res.data)
      .catch(() => []);

    // --- Merge fetch then format into event
    const eventprms = Promise.all([actentprms, actsecprms])
      .then(([ents, secs]) => ({
        id: activity.id,
        name: activity.name,
        fines: activity.fine,
        description: activity.description,
        eventDate: activity.startAt,
        startAt: activity.startAt, // <--- actual start datetime
        finishAt: activity.finishAt, // <--- actual finish datetime
        createdAt: activity.createdAt,
        sections: secs.map((s) => s.name),
        timeEntries: ents.map((e) => ({
          name: e.name,
          startTime: e.startAt,
          endTime: e.finishAt,
        })),
      }))
      .then((res) => events.value.push(res))
      .catch(console.error);

    // --- List only, handle later
    eprms.push(eventprms);
  }

  // --- Handle all fetching and formatting in palalel
  await Promise.all(eprms).catch(console.error);
};

// --- Sections
const sections = ref([]);

const getSections = async () => {
  await api
    .get("/section")
    .then((res) =>
      res.data.map((s) => ({ id: s.id, label: `${s.year}-${s.name}` }))
    )
    .then((res) => sections.value.push(...res))
    .catch(console.error);
};

// --- Filtering/Sorting
const searchQuery = ref("");
const sortBy = ref("name");
const selectedEvent = ref(null);

const filteredAndSortedEvents = computed(() => {
  let result = events.value;
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.sections.some((s) => s.toLowerCase().includes(q)) ||
        e.timeEntries.some((entry) => entry.name.toLowerCase().includes(q)) ||
        e.fines.toString().includes(q)
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

const updateEvent = async (updatedEvent) => {
  // *need to add desc, event end datetime
  const event = {
    name: updatedEvent.name,
    fine: updatedEvent.fines,
    description: "", // *desc
    startAt: updatedEvent.eventDate, // *startTime
    finishAt: new Date(Date.now() + 8 * 60 * 60 * 1000), // *endTime
  };

  // --- Updates event
  const activity = await api
    .patch("/activity", event)
    .then((res) => res.data)
    .catch(() => undefined);
  if (!activity) return;

  // --- Entries needs id to keep trackable
  const entries = await api
    .get(`/activity/${activity.id}/section`)
    .then((res) => res.data)
    .catch(() => []);
  // const entforadds = updatedEvent.timeEntries.filter((e) => !entries.some((n) => n.id == e.id))
  // const entfordels = entries.filter((e) => !updatedEvent.timeEntries.some((t) => t.id == e.id))
  // const entaddprms = entforadds.map((e) => api.post(`/activity/${activity.id}/entry`, e))
  // const entdelprms = entfordels.map((e) => api.delete(`/activity/${activity.id}/entry/${e.id}`))
  // await Promise.all([...entaddprms, ...entdelprms]).catch(console.error)

  // --- Sections might change
  const sections = await api
    .get(`/activity/${activity.id}/section`)
    .then((res) => res.data)
    .catch(() => []);
  const secforadds = updatedEvent.sections.filter(
    (s) => !sections.some((o) => o.id == s)
  );
  const secfordels = sections.filter(
    (s) => !updatedEvent.sections.includes(s.id)
  );
  const secaddprms = secforadds.map((s) =>
    api.post(`/activity/${activity.id}/section/section/${s}`)
  );
  const secdelprms = secfordels.map((s) =>
    api.delete(`/activity/${activity.id}/section/section/${s.id}`)
  );
  await Promise.all([...secaddprms, ...secdelprms]).catch(console.error);

  const index = events.value.findIndex((e) => e.id === updatedEvent.id);
  if (index !== -1) events.value[index] = updatedEvent;
};

const deleteEvent = async (id) => {
  if (confirm("Are you sure you want to delete this event?")) {
    await api.delete(`/activity/${id}`).catch(console.error);
    events.value = events.value.filter((e) => e.id !== id);
    closeModal();
  }
};

// --- Data Fetching
const getData = async () => await Promise.all([getEvents(), getSections()]);
onBeforeMount(getData);

// Add a computed property to format the createdAt date
const formatDate = (date) => {
  return format(new Date(date), "MMMM d, yyyy, h:mm a"); // Example: "November 23, 2025, 5:31 PM"
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
  margin-bottom: 2rem;
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
  padding-bottom: 2rem;
  width: 100%;
}

.event-card {
  width: 32% !important;
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

.event-description {
  font-size: 0.875rem; /* Slightly smaller than title */
  color: #374151; /* Gray-700 for elegance */
  line-height: 1.5; /* Comfortable reading */
  margin: 0.5rem 0 1rem 0; /* Spacing around */
  background: rgba(16, 185, 129, 0.05); /* Soft accent background */
  padding: 0.5rem 0.75rem;
  border-left: 3px solid #10b981; /* Elegant accent bar */
  border-radius: 0.375rem;
  font-style: italic; /* Slightly stylized */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Show max 3 lines */
  -webkit-box-orient: vertical;
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

/* Minimal design for event-time-entries */
.event-time-entries {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.event-time-entry {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background: #f9f9f9; /* Light background for contrast */
  border: 1px solid #ddd; /* Subtle border */
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #333;
  transition: background 0.2s ease, box-shadow 0.2s ease;
}

.event-time-entry:hover {
  background: #f1f1f1; /* Slightly darker background on hover */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow on hover */
}

.entry-name {
  font-weight: 600;
  color: #555;
}

.entry-time {
  color: #777;
  font-size: 0.875rem;
}
</style>
