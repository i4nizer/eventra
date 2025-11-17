<template>
  <transition name="fade">
    <div
      v-if="show"
      class="modal-overlay"
    >
      <div class="modal-container">
        <!-- Header -->
        <h2 class="modal-title">
          Create New Tag
        </h2>

        <!-- Create Tag Form -->
        <form @submit.prevent="handleSubmit" class="modal-form">
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

          <!-- Buttons -->
          <div class="button-group">
            <button
              type="button"
              class="btn-cancel"
              @click="$emit('close')"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn-submit"
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

<style>
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

/* Modal Container */
.modal-container {
  background: var(--surface);
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  padding: 1.5rem;
  width: 24rem;
  position: relative;
  transform: scale(1);
  transition: all 0.3s;
  border: 1px solid var(--border);
}

/* Header */
.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 1rem;
  text-align: center;
}

/* Form */
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: var(--text);
}

/* Input Label */
.input-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text);
  margin-bottom: 0.25rem;
}

/* Input Field */
.input-field {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  padding: 0.5rem;
  background: var(--bg);
  color: var(--text);
  outline: none;
  transition: all 0.2s;
}

.input-field:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.input-field::placeholder {
  color: var(--muted);
}

/* Button Group */
.button-group {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
  gap: 0.5rem;
}

/* Cancel Button */
.btn-cancel {
  background: var(--surface);
  color: var(--text);
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border);
  transition: all 0.2s;
  cursor: pointer;
  font-weight: 500;
}

.btn-cancel:hover {
  background: var(--surface2);
}

/* Dark Mode Adjustments */
.dark .modal-container {
  background: var(--surface2);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}


/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>