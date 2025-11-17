<template>
  <div v-if="open" class="modal-backdrop-simple">
    <div class="modal-backdrop" @click="onClose"></div>

    <form @submit.prevent="handleSubmit" class="modal-form scrollable">
      <header class="modal-header-inline">
        <div>
          <h3 class="modal-title">Create Student</h3>
          <p class="modal-subtitle">Add a new student to the system.</p>
        </div>
        <button type="button" @click="onClose" class="close-btn">
          <!-- SVG icon -->
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
              <option v-for="s in sections" :key="s" :value="s">{{ s }}</option>
            </select>
          </div>
      
      <footer class="modal-footer-inline">
        <button type="button" @click="onClose" class="btn-modal btn-modal-cancel" :disabled="submitting">
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
    tag: rfid.value,
    section: section.value,
  });
}
</script>
