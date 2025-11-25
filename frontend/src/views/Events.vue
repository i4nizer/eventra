<template>
  <div class="events">
    <div class="eventHeader">
      <div class="header-content">
        <eventsCount :activities="activities" />
        <button @click="activityCreateModal = true" class="btn-add">
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
      <eventList
        :sections="sections"
        :activities="activities"
        :activities-entries="activitiesEntries"
        :activities-sections="activitiesSections"
        @update-activity="updateActivity"
        @delete-activity="deleteActivity"
        @create-activity-entry="createActivityEntry"
        @update-activity-entry="updateActivityEntry"
        @delete-activity-entry="deleteActivityEntry"
        @create-activity-section="createActivitySection"
        @delete-activity-section="deleteActivitySection"
      />
    </div>

    <!-- Create Event Modal -->
    <createEvent
      v-if="activityCreateModal"
      :sections="sections"
      @close="activityCreateModal = false"
      @create-activity="createActivity"
      @create-activity-entry="createActivityEntry"
      @create-activity-section="createActivitySection"
    />
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { useApi } from "@/composables/api";
import eventsCount from "@/components/Events/eventsCount.vue";
import eventList from "@/components/Events/eventList.vue";
import createEvent from "@/components/CRUD/createEvent.vue";

//

const { api } = useApi();

//

// --- Sections
const sections = ref([]);

const fetchSection = async () => {
  return await api
    .get(`/section`)
    .then((res) => sections.value = res.data)
    .catch(console.error);
};

// --- Activities (event)
const activities = ref([])
const activityCreateModal = ref(false);

const fetchActivity = async () => {
  return await api
    .get("/activity")
    .then((res) => activities.value = res.data)
    .catch(console.error)
}

const createActivity = async (data) => {
  return await api
    .post("/activity", data)
    .then((res) => [res, activities.value.push(res.data)])
    .then(([res]) => res)
    .catch(console.error)
}

const updateActivity = async (data) => {
  return await api
    .patch(`/activity/${data.id}`, data)
    .then((res) => [res, activities.value.findIndex((a) => a.id == data.id)])
    .then(([res, idx]) => [res, activities.value.splice(idx, 1, res.data)])
    .then(([res]) => res)
    .catch(console.error)
}

const deleteActivity = async (data) => {
  return await api
    .delete(`/activity/${data.id}`)
    .then(() => activities.value.findIndex((a) => a.id == data.id))
    .then((idx) => activities.value.splice(idx, 1))
    .catch(console.error)
}

// --- Activity Entries
const activitiesEntries = ref([])

const fetchActivityEntry = async () => {
  return await api
    .get("/activity/entry")
    .then((res) => activitiesEntries.value = res.data)
    .catch(console.error)
}

const createActivityEntry = async (actid, data) => {
  return await api
    .post(`/activity/${actid}/entry`, data)
    .then((res) => [res, activitiesEntries.value.push(res.data)])
    .then(([res]) => res)
    .catch(console.error)
}

const updateActivityEntry = async (actid, data) => {
  return await api
    .patch(`/activity/${actid}/entry/${data.id}`, data)
    .then((res) => [res, activitiesEntries.value.findIndex((a) => a.id == data.id)])
    .then(([res, idx]) => [res, activitiesEntries.value.splice(idx, 1, res.data)])
    .then(([res]) => res)
    .catch(console.error)
}

const deleteActivityEntry = async (actid, data) => {
  return await api
    .delete(`/activity/${actid}/entry/${data.id}`)
    .then(() => activitiesEntries.value.findIndex((a) => a.id == data.id))
    .then((idx) => activitiesEntries.value.splice(idx, 1))
    .catch(console.error)
}

// --- Activity Sections
const activitiesSections = ref([])

const fetchActivitySection = async () => {
  return await api
    .get("/activity/section")
    .then((res) => activitiesSections.value = res.data)
    .catch(console.error)
}

const createActivitySection = async (actid, data) => {
  return await api
    .post(`/activity/${actid}/section/section/${data.id}`)
    .then((res) => [res, activitiesSections.value.push(res.data)])
    .then(([res]) => res)
    .catch(console.error)
}

const deleteActivitySection = async (actid, data) => {
  return await api
    .delete(`/activity/${actid}/section/${data.id}`)
    .then(() => activitiesSections.value.findIndex((a) => a.id == data.id))
    .then((idx) => activitiesSections.value.splice(idx, 1))
    .catch(console.error)
}

// --- Data Fetching
const getData = async () => {
  await Promise.all([
    fetchSection(),
    fetchActivity(),
    fetchActivityEntry(),
    fetchActivitySection(),
  ]).catch(console.error)
}

onBeforeMount(getData)

//

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
