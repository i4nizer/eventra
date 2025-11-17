<template>
  <transition name="fade">
    <div v-if="open" class="modal-backdrop-simple">
      <div class="modal-simple">
        <h2 class="modal-title-simple modal-title-center">View Student</h2>
        
        <div class="modal-content">
          <p><strong>Name:</strong> {{ student?.name }}</p>
          <p><strong>Email:</strong> {{ student?.email }}</p>
          <p><strong>Section:</strong> {{ student?.section }}</p>
          <p><strong>RFID Tag:</strong> {{ student?.tag }}</p>
          <p><strong>Balance:</strong> ₱{{ student?.balance }}</p>
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
  student: Object,
});
</script>
