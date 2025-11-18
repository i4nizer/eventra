<template>
  <transition name="fade">
    <div v-if="open" class="modal-backdrop-simple">
      <div class="modal-simple">
        <h2 class="modal-title-simple modal-title-center">Delete Payment</h2>
        <div class="modal-body-simple">
          <p class="text-sm" style="color: var(--muted); text-align: center;">
            Are you sure you want to delete
            <strong>{{ payment?.name }}</strong>?
          </p>
        </div>

        <div class="modal-footer-inline modal-footer-center" style="gap: 0.5rem;">
          <button @click="onClose" class="btn-close">
            Cancel
          </button>
          <button @click="onConfirm" class="btn-cancel">
            Delete
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
  onConfirm: Function,
  payment: Object,
});
</script>
