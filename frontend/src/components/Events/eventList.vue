<template>
  <div class="event-list-wrapper">
    <!-- Search & Sort -->
    <div class="header-controls">
      <input
        v-model="filter"
        type="text"
        placeholder="Search events..."
        class="search-input"
      />

      <select v-model="sorter" class="sort-select">
        <option value="name">Name</option>
        <option value="fine">Fines</option>
        <option value="startAt">Event Date</option>
      </select>
    </div>

    <!-- Event Cards Grid -->
    <div class="event-cards">
      <div
        v-for="activity in activities"
        :key="activity.id"
        class="event-card"
        @click="activityViewData = activity"
      >
        <div class="event-card-content">
          <div>
            <h3 class="event-title">{{ activity.name }}</h3>

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
              {{ format(new Date(activity.startAt), "MMMM d, yyyy, h:mm a") }}
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
              <span v-if="activitiesSectionsMap.has(activity.id) ">
                {{
                  activitiesSectionsMap
                    .get(activity.id)
                    .map((asc) => sections.find((s) => s.id == asc.sectionId))
                    .filter((s) => !!s)
                    .map((s) => `${s.year}-${s.name}`)
                    .join(`, `)
                }}
              </span>
              <span v-else>No Sections</span>
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
              ₱{{ activity.fine.toLocaleString() }}
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
              {{ format(new Date(activity.createdAt), "MMMM d, yyyy, h:mm a") }}
            </p>

            <!-- Elegant Description -->
            <p class="event-description">
              {{ activity.description }}
            </p>
          </div>

          <button class="view-btn">View Details →</button>
        </div>
      </div>
    </div>

    <!-- No Results -->
    <p v-if="activities.length === 0" class="no-results">
      No events found.
    </p>

    <!-- Event Modal -->
    <EventModal
      v-if="activityViewData"
      :sections="sections"
      :activity="activityViewData"
      :activity-entries="activitiesEntriesMap.get(activityViewData.id) || []"
      :activity-sections="activitiesSectionsMap.get(activityViewData.id) || []"
      @close="activityViewData = undefined"
      @update-activity="onUpdateActivity"
      @delete-activity="onDeleteActivity"
      @create-activity-entry="onCreateActivityEntry"
      @update-activity-entry="onUpdateActivityEntry"
      @delete-activity-entry="onDeleteActivityEntry"
      @create-activity-section="onCreateActivitySection"
      @delete-activity-section="onDeleteActivitySection"
    />
  </div>
</template>

<script setup>
import { format } from "date-fns"
import { reactive, ref, watch } from "vue"
import EventModal from "./EventModal.vue"

//

const props = defineProps({
  sections: { type: Array, default: () => [] },
  activities: { type: Array, default: () => [] },
  activitiesEntries: { type: Array, default: () => [] },
  activitiesSections: { type: Array, default: () => [] },
  onCreateActivity: { type: Function, default: () => (() => {}) },
  onUpdateActivity: { type: Function, default: () => (() => {}) },
  onDeleteActivity: { type: Function, default: () => (() => {}) },
  onCreateActivityEntry: { type: Function, default: () => (() => {}) },
  onUpdateActivityEntry: { type: Function, default: () => (() => {}) },
  onDeleteActivityEntry: { type: Function, default: () => (() => {}) },
  onCreateActivitySection: { type: Function, default: () => (() => {}) },
  onUpdateActivitySection: { type: Function, default: () => (() => {}) },
  onDeleteActivitySection: { type: Function, default: () => (() => {}) },
})

//

// --- Activity View
const activityViewData = ref()

// --- Activity Mapping
const activitiesEntriesMap = reactive(new Map())
const activitiesSectionsMap = reactive(new Map())

watch(() => [props.activities, props.activitiesEntries, props.activitiesSections], ([acts, ents, ascs]) => {
  activitiesEntriesMap.clear()
  activitiesSectionsMap.clear()
  acts.forEach((a) => {
    activitiesEntriesMap.set(a.id, ents.filter((e) => e?.activityId == a.id))
    activitiesSectionsMap.set(a.id, ascs.filter((s) => s?.activityId == a.id))
  })
})

// --- Filtering & Sorting
const filter = ref("")
const sorter = ref("name")
const activities = reactive([])

watch([filter, sorter, () => props.activities], ([f, s, a]) => {
  const filtered = a.filter((a) => !f || a.name.toLowerCase().includes(f))
  filtered.sort((a, b) => (a[s] > b[s]) - (a[s] < b[s]))
  activities.splice(0, activities.length)
  activities.push(...filtered)
}, { deep: true })

//

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
