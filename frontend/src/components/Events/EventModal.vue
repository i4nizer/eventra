<template>
  <transition name="fade">
    <div
      v-if="event"
      class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-white rounded-2xl shadow-xl w-full max-w-2xl transform transition-all duration-300 scale-100 overflow-hidden"
      >
        <!-- Header -->
        <div class="bg-[#27c08d] p-5 text-center rounded-t-2xl">
          <h2 class="text-2xl font-bold text-white">
            {{ isEditing ? "Edit Event" : event.name }}
          </h2>
        </div>

        <!-- Body -->
        <div class="p-6 space-y-5 max-h-[70vh] overflow-y-auto text-gray-700">
          <!-- Editable Form -->
          <div v-if="isEditing" class="space-y-4">
            <div class="flex flex-col">
              <label class="text-sm font-medium text-gray-600"
                >Event Name</label
              >
              <input
                v-model="editableEvent.name"
                type="text"
                class="mt-1 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#27c08d]"
              />
            </div>

            <div class="flex flex-col md:flex-row gap-4">
              <div class="flex-1 flex flex-col">
                <label class="text-sm font-medium text-gray-600"
                  >Event Date</label
                >
                <input
                  v-model="editableEvent.eventDate"
                  type="date"
                  class="mt-1 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#27c08d]"
                />
              </div>
              <div class="flex-1 flex flex-col">
                <label class="text-sm font-medium text-gray-600"
                  >Start Time</label
                >
                <input
                  v-model="editableEvent.startTime"
                  type="time"
                  class="mt-1 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#27c08d]"
                />
              </div>
              <div class="flex-1 flex flex-col">
                <label class="text-sm font-medium text-gray-600"
                  >End Time</label
                >
                <input
                  v-model="editableEvent.endTime"
                  type="time"
                  class="mt-1 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#27c08d]"
                />
              </div>
            </div>

            <div class="flex flex-col md:flex-row gap-4">
              <div class="flex-1 flex flex-col">
                <label class="text-sm font-medium text-gray-600">Section</label>
                <input
                  v-model="editableEvent.section"
                  type="text"
                  class="mt-1 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#27c08d]"
                />
              </div>
              <div class="flex-1 flex flex-col">
                <label class="text-sm font-medium text-gray-600"
                  >Fines (₱)</label
                >
                <input
                  v-model.number="editableEvent.fines"
                  type="number"
                  class="mt-1 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#27c08d]"
                />
              </div>
            </div>
          </div>

          <!-- Display Mode -->
          <div v-else class="space-y-3 text-gray-700">
            <p class="flex items-center gap-2">
              📅
              <span class="font-medium"
                >{{ event.startTime }} — {{ event.endTime }}</span
              >
            </p>
            <p class="flex items-center gap-2">
              📆 <span class="font-medium">{{ event.eventDate }}</span>
            </p>
            <p class="flex items-center gap-2">
              🎓 <span class="font-medium">{{ event.section }}</span>
            </p>
            <p class="flex items-center gap-2 text-[#27c08d] font-semibold">
              💰 ₱{{ event.fines.toLocaleString() }}
            </p>
            <p class="text-gray-400 text-sm">
              🗓️ Created: {{ event.createdAt }}
            </p>
          </div>
        </div>

        <!-- Buttons -->
        <div
          class="flex flex-wrap justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50"
        >
          <button
            class="bg-gray-200 text-gray-800 px-5 py-2 rounded-xl hover:bg-gray-300 transition font-medium"
            @click="handleCancel"
          >
            {{ isEditing ? "Cancel Edit" : "Close" }}
          </button>

          <button
            v-if="!isEditing"
            class="bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 transition font-medium"
            @click="startEditing"
          >
            Edit
          </button>

          <button
            v-else
            class="bg-[#27c08d] text-white px-5 py-2 rounded-xl hover:bg-[#1fa77a] transition font-medium"
            @click="saveChanges"
          >
            Save
          </button>

          <button
            v-if="!isEditing"
            class="bg-red-500 text-white px-5 py-2 rounded-xl hover:bg-red-600 transition font-medium"
            @click="$emit('delete', event.id)"
          >
            Delete
          </button>

          <button
            v-if="!isEditing"
            class="bg-[#27c08d] text-white px-5 py-2 rounded-xl hover:bg-[#1fa77a] transition font-medium"
            @click="openAttendance"
          >
            Start Attendance
          </button>
        </div>

        <!-- Attendance Modal -->
        <AttendanceModal
          v-if="showAttendanceModal"
          :event="event"
          :students="event.students"
          @close="showAttendanceModal = false"
          @update="updateAttendance"
        />
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from "vue";
import AttendanceModal from "./attendanceModal.vue";

const props = defineProps({ event: Object });
const emit = defineEmits(["close", "delete", "update"]);

const isEditing = ref(false);
const editableEvent = ref({ ...props.event });

watch(
  () => props.event,
  (newVal) => {
    editableEvent.value = { ...newVal };
  }
);

const startEditing = () => (isEditing.value = true);

const handleCancel = () => {
  if (isEditing.value) {
    editableEvent.value = { ...props.event };
    isEditing.value = false;
  } else {
    emit("close");
  }
};

const saveChanges = () => {
  emit("update", { ...editableEvent.value });
  isEditing.value = false;
};

// Attendance Modal
const showAttendanceModal = ref(false);
const openAttendance = () => (showAttendanceModal.value = true);

const updateAttendance = (students) => {
  emit("update", { ...props.event, students });
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}
</style>
