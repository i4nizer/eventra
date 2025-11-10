<template>
  <transition name="fade">
    <div
      v-if="event"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded-2xl shadow-xl p-6 w-96 relative transform transition-all duration-300 scale-100"
      >
        <!-- Header -->
        <h2 class="text-xl font-semibold text-gray-800 mb-4 text-center">
          {{ isEditing ? "Edit Event" : event.name }}
        </h2>

        <!-- Editable Form -->
        <div v-if="isEditing" class="space-y-3 text-gray-700">
          <div>
            <label class="block text-sm font-medium text-gray-600"
              >Event Name</label
            >
            <input
              v-model="editableEvent.name"
              type="text"
              class="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-600"
              >Start Time</label
            >
            <input
              v-model="editableEvent.startTime"
              type="text"
              class="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-600"
              >End Time</label
            >
            <input
              v-model="editableEvent.endTime"
              type="text"
              class="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-600"
              >Section</label
            >
            <input
              v-model="editableEvent.section"
              type="text"
              class="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-600"
              >Fines (₱)</label
            >
            <input
              v-model.number="editableEvent.fines"
              type="number"
              class="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
        </div>

        <!-- Display Mode -->
        <div v-else class="space-y-2 text-gray-700">
          <p>📅 {{ event.startTime }} — {{ event.endTime }}</p>
          <p>🎓 {{ event.section }}</p>
          <p>💰 Fines: ₱{{ event.fines.toLocaleString() }}</p>
        </div>

        <!-- Buttons -->
        <div class="flex justify-end mt-6 space-x-2">
          <button
            class="bg-gray-300 text-gray-800 px-4 py-2 rounded-xl hover:bg-gray-400 transition"
            @click="handleCancel"
          >
            {{ isEditing ? "Cancel Edit" : "Close" }}
          </button>

          <button
            v-if="!isEditing"
            class="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition"
            @click="startEditing"
          >
            Edit
          </button>

          <button
            v-else
            class="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition"
            @click="saveChanges"
          >
            Save
          </button>

          <button
            v-if="!isEditing"
            class="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition"
            @click="$emit('delete', event.id)"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  event: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["close", "delete", "update"]);

const isEditing = ref(false);
const editableEvent = ref({ ...props.event });

watch(
  () => props.event,
  (newVal) => {
    editableEvent.value = { ...newVal };
  }
);

const startEditing = () => {
  isEditing.value = true;
};

const handleCancel = () => {
  if (isEditing.value) {
    editableEvent.value = { ...props.event }; // revert changes
    isEditing.value = false;
  } else {
    emit("close");
  }
};

const saveChanges = () => {
  emit("update", { ...editableEvent.value });
  isEditing.value = false;
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
</style>
