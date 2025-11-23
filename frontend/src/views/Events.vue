<template>
  <div class="events">
    <div class="eventHeader">
      <div class="header-content">
        <eventsCount />
        <button @click="openCreateModal" class="btn-add">
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
import { ref, onMounted } from "vue";
import { useApi } from "@/composables/api";
import eventsCount from "@/components/Events/eventsCount.vue";
import eventList from "@/components/Events/eventList.vue";
import createEvent from "@/components/CRUD/createEvent.vue";

const { api } = useApi();
const isCreateModalOpen = ref(false);

const sections = ref([]);

const getSections = async () => {
  await api
    .get(`/section`)
    .then((res) => {
      sections.value = res.data.map((section) => ({
        id: section.id,
        label: `${section.name} / Year ${section.year}`,
      }));
    })
    .catch(console.error);
};

onMounted(getSections);

// Open the Create Event modal
function openCreateModal() {
  isCreateModalOpen.value = true;
}

// Close the Create Event modal
function closeCreateModal() {
  isCreateModalOpen.value = false;
}

// Handle event creation
async function handleCreateEvent(eventData) {
  // *need to add desc, event start and end datetime
  const event = {
    name: eventData.name,
    fine: eventData.fines,
    description: "", // *desc
    startAt: new Date(), // *startTime
    finishAt: new Date(Date.now() + 8 * 60 * 60 * 1000), // *endTime
  }

  // --- Creates event
  const activity = await api.post("/activity", event).then((res) => res.data).catch(() => undefined)
  if (!activity) return

  // --- Specifies sections included in the event
  const secbase = `/activity/${activity.id}/section/section`
  const secprms = eventData.sections.map((s) => api.post(`${secbase}/${s}`).then((res) => res.data))
  const actsecs = await Promise.all(secprms).catch(console.error)

  // --- Lists times when to tap rfid
  const entries = eventData.timeEntries.map((e) => ({ name: e.name, startAt: e.startTime, finishAt: e.endTime }))
  const entprms = entries.map((e) => api.post(`/activity/${activity.id}/entry`, e).then((res) => res.data))
  const actents = await Promise.all(entprms).catch(console.error)
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

@media (min-width: 640px) {
  .btn-add {
    width: auto;
  }
}

.btn-add:hover {
  opacity: 0.9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-add:active {
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

  .btn-add {
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

  .btn-add {
    font-size: 0.8125rem;
    padding: 0.5rem 0.75rem;
  }

  .btn-add svg {
    width: 1rem;
    height: 1rem;
  }
}
</style>
