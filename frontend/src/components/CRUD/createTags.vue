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
            <label class="block text-sm font-medium text-gray-600 mb-1">
              Tag ID
            </label>
            <input
              v-model="form.tagId"
              type="text"
              placeholder="e.g., TAG-004"
              required
              class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
          </div>

          <!-- Assigned Student -->
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">
              Assigned Student
            </label>
            <select
              v-model="form.assignedStudent"
              class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
            >
              <option value="">Not assigned (unequipped)</option>
              <option
                v-for="student in students"
                :key="student"
                :value="student"
              >
                {{ student }}
              </option>
            </select>
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
              class="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition"
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
  show: { type: Boolean, default: false },
  students: {
    type: Array,
    default: () => ["John Doe", "Jane Smith", "Michael Cruz", "Anna Lopez"],
  },
});

const emit = defineEmits(["close", "save"]);

const form = ref({
  tagId: "",
  assignedStudent: "",
});

const handleSubmit = () => {
  const tagData = {
    tagId: form.value.tagId,
    assignedStudent: form.value.assignedStudent,
    status: form.value.assignedStudent ? "Equipped" : "Not Equipped",
  };

  emit("save", tagData);

  // Clear form after saving
  form.value = { tagId: "", assignedStudent: "" };
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
