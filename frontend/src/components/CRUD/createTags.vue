<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded-2xl shadow-xl p-6 w-96 relative transform transition-all duration-300 scale-100"
      >
        <!-- Header -->
        <h2 class="text-xl font-semibold text-gray-800 mb-4 text-center">
          Create New Tag
        </h2>

        <!-- Create Tag Form -->
        <form @submit.prevent="handleSubmit" class="space-y-4 text-gray-700">
          <!-- Tag ID -->
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1"
              >Tag ID</label
            >
            <input
              v-model="form.tagId"
              type="text"
              placeholder="e.g., TAG-004"
              required
              class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <!-- Status -->
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1"
              >Status</label
            >
            <select
              v-model="form.status"
              required
              class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option disabled value="">Select status</option>
              <option value="Equipped">Equipped</option>
              <option value="Not Equipped">Not Equipped</option>
            </select>
          </div>

          <!-- Assigned Student -->
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1"
              >Assigned Student</label
            >
            <input
              v-model="form.assignedStudent"
              type="text"
              placeholder="e.g., John Doe or leave blank"
              :disabled="form.status === 'Not Equipped'"
              class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <!-- Buttons -->
          <div class="flex justify-end mt-6 space-x-2">
            <button
              type="button"
              class="bg-gray-300 text-gray-800 px-4 py-2 rounded-xl hover:bg-gray-400 transition"
              @click="$emit('close')"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "save"]);

const form = ref({
  tagId: "",
  status: "",
  assignedStudent: "",
});

const handleSubmit = () => {
  emit("save", { ...form.value });
  // Clear form after saving
  form.value = { tagId: "", status: "", assignedStudent: "" };
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
