<template>
  <transition name="fade">
    <div v-if="open" class="modal-backdrop-simple">
      <div class="modal-simple">
        <h2 class="modal-title-simple modal-title-center">View Student</h2>
        
        <div class="modal-content">
          <p><strong>Name:</strong> {{ attendance?.name }}</p>
          <p><strong>Student ID:</strong> {{ attendance?.studentId }}</p>
          <p><strong>Activity:</strong> {{ attendance?.activity }}</p>
          <p><strong>Date:</strong> {{ attendance?.date }}</p>
        </div>

        <div class="modal-footer-inline modal-footer-center">
          <button @click="onClose" class="btn-modal btn-modal-cancel">
            Close
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
const props = defineProps({
  open: Boolean,
  onClose: Function,
  attendance: Object,
});
</script>
