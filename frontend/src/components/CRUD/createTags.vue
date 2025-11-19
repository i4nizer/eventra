<template>
  <div v-if="show" class="modal-backdrop-simple">
    <div class="modal-backdrop" @click="onClose"></div>
     <!-- Create Tag Form -->
        <form @submit.prevent="handleSubmit" class="modal-form">
            <header class="modal-header-inline">
                <div>
                  <h3 class="modal-title">Create Tags</h3>
                  <p class="modal-subtitle">Add a new tag to the system.</p>
                </div>
                <button type="button" @click="onClose" class="close-btn">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </header>
          <!-- Tag ID -->
          <div>
            <label class="input-label">
              Tag ID
            </label>
            <input
              v-model="form.tagId"
              type="text"
              placeholder="e.g., TAG-004"
              required
              class="input-field"
            />
          </div>

          <!-- Assigned Student -->
          <div>
            <label class="input-label">
              Assigned Student
            </label>
            <select
              v-model="form.assignedStudent"
              class="input-field"
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

      <footer class="modal-footer-inline">
        <button type="button" @click="onClose" class="btn-cancel" :disabled="submitting">
          Cancel
        </button>
        <button type="submit" class="btn-submit" :disabled="submitting">
          {{ submitting ? "Creating..." : "Create Student" }}
        </button>
      </footer>
        </form>
    </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  onClose: Function,
  onCreate: Function,
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

<style>
</style>  