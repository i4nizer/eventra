<template>
  <div class="events">
    <div class="eventHeader">
      <div class="header-content">
        <eventsCount />
        <button
          @click="openCreateModal"
          class="create-event-btn"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="btn-text">Create Event</span>
        </button>
      </div>
    </div>
    <div class="eventList">
      <eventList />
    </div>

    <!-- Create Event Modal -->
    <createEvent
      :open="isCreateModalOpen"
      :onClose="closeCreateModal"
      :onCreate="handleCreateEvent"
      :sections="sections"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import eventsCount from "@/components/Events/eventsCount.vue";
import eventList from "@/components/Events/eventList.vue";
import createEvent from "@/components/CRUD/createEvent.vue";

const isCreateModalOpen = ref(false);

// Define your sections here or fetch from API
const sections = ref([
  { id: '1A', label: '1A / Grade 7' },
  { id: '2B', label: '2B / Grade 8' },
  { id: '3C', label: '3C / Grade 9' },
  { id: '4D', label: '4D / Grade 10' },
  // Add more sections as needed
]);

function openCreateModal() {
  isCreateModalOpen.value = true;
}

function closeCreateModal() {
  isCreateModalOpen.value = false;
}

async function handleCreateEvent(eventData) {
  // Implement your event creation logic here
  // For example, call an API to save the event
  console.log('Creating event:', eventData);
  
  // Example API call (uncomment and modify as needed):
  // try {
  //   await api.createEvent(eventData);
  //   // Optionally refresh the event list
  //   // or show a success message
  // } catch (error) {
  //   throw new Error('Failed to create event');
  // }
}
</script>

<style scoped>
.events {
  padding: 1rem;
}

.eventHeader {
  margin-bottom: 1.5rem;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: stretch;
}

@media (min-width: 640px) {
  .header-content {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }
}

.create-event-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 0.5rem;
  background: var(--accent);
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
  border: 1px solid var(--accent);
  cursor: pointer;
  white-space: nowrap;
  width: 100%;
}

@media (min-width: 640px) {
  .create-event-btn {
    width: auto;
  }
}

.create-event-btn:hover {
  opacity: 0.9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.create-event-btn:active {
  transform: translateY(1px);
}

.eventList {
  width: 100%;
}

/* Tablet */
@media (max-width: 1024px) {
  .events {
    padding: 0.875rem;
  }
  
  .eventHeader {
    margin-bottom: 1.25rem;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .events {
    padding: 0.75rem;
  }
  
  .eventHeader {
    margin-bottom: 1rem;
  }

  .create-event-btn {
    padding: 0.5rem 0.875rem;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .events {
    padding: 0.5rem;
  }
  
  .eventHeader {
    margin-bottom: 0.875rem;
  }

  .create-event-btn {
    font-size: 0.8125rem;
    padding: 0.5rem 0.75rem;
  }

  .create-event-btn svg {
    width: 1rem;
    height: 1rem;
  }
}

/* Dark mode adjustments */
:global(.dark) .create-event-btn {
  color: var(--accent);
  background: var(--surface);
  border-color: var(--accent);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

:global(.dark) .create-event-btn:hover {
  background: var(--surface2);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.4);
}
</style>