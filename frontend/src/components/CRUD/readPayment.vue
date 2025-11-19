<template>
  <transition name="fade">
    <div v-if="open" class="modal-backdrop-simple">
      <div class="modal-simple">
        <h2 class="modal-title-simple modal-title-center">View Student</h2>
        
        <div class="modal-content">
          <p><strong>Name:</strong> {{ payment?.name }}</p>
          <p><strong>Violation:</strong> {{ payment?.violation }}</p>
          <p><strong>Amount:</strong> {{ payment?.amount }}</p>
          <p><strong>Remarks:</strong> {{ payment?.remarks }}</p>
          <p><strong>Date:</strong> {{ payment?.date }}</p>
        </div>

        <div class="modal-footer-inline modal-footer-center">
          <button @click="onClose" class="btn-close">
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
  payment: Object,
});
</script>
