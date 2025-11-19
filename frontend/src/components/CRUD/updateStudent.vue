<template>
  <div v-if="open" class="modal-backdrop-simple">
    <div class="modal-backdrop" @click="onClose"></div>

    <form @submit.prevent="handleSubmit" class="modal-form scrollable">
      <header class="modal-header-inline">
        <div>
          <h3 class="modal-title">Edit Student</h3>
          <p class="modal-subtitle">Update the student's information.</p>
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
          <div>
            <label class="input-label"
              >Full Name</label
            >
            <input
              v-model="name"
              type="text"
              class="input-field"
            />
          </div>

          <div>
            <label class="input-label"
              >RFID Tag</label
            >
            <select
              v-model="rfid"
              class="input-field"
            >
              <option value="">Select RFID tag</option>
              <option v-for="tag in availableTags" :key="tag" :value="tag">
                {{ tag }}
              </option>
            </select>
          </div>

          <div>
            <label class="input-label"
              >Section</label
            >
            <select
              v-model="section"
              class="input-field"
            >
              <option value="">Select section</option>
              <option v-for="s in sections" :key="s.id" :value="s.id">{{ s.name }}</option>
            </select>
          </div>
      
      <footer class="modal-footer-inline">
        <button type="button" @click="onClose" class="btn-cancel" :disabled="submitting">
          Cancel
        </button>
        <button type="submit" class="btn-submit" :disabled="submitting" @click="handleUpdate">
          {{ submitting ? "Updating..." : "Update Student" }}
        </button>
      </footer>
    </form>
  </div>
</template>
<script setup>
import { ref, watch } from "vue";
const props = defineProps({
  open: Boolean,
  onClose: Function,
  onUpdate: Function,
  student: Object,
  sections: Array,
  availableTags: Array,
});
const name = ref("");
const rfid = ref("");
const section = ref("");

watch(
  () => props.student,
  (s) => {
    if (s) {
      name.value = s.name;
      rfid.value = s.tag;
      section.value = s.section;
    }
  },
  { immediate: true }
);

function handleUpdate() {
  props.onUpdate({
    ...props.student,
    name: name.value,
    rfid: rfid.value,
    section: section.value,
  });
}
</script>
