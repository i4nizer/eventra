<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="open" class="modal-backdrop-simple">
        <div class="modal-backdrop" @click="handleClose"></div>

        <div class="modal-simple">
          <header>
            <div class="modal-title-simple modal-title-center">
              Student Balance
            </div>
          </header>

          <div class="modal-body-simple">
            <!-- Student Info Card -->
            <div class="info-card">
              <div class="info-icon">
                <i class="fa-solid fa-user"></i>
              </div>
              <div class="info-content">
                <div class="info-label">Student Name</div>
                <div class="info-value">{{ studentData.name }}</div>
              </div>
            </div>

            <!-- Balance Card -->
            <div class="info-card" style="margin-top: 0.75rem;">
              <div class="info-icon">
                <i class="fa-solid fa-wallet"></i>
              </div>
              <div class="info-content">
                <div class="info-label">Remaining Balance</div>
                <div class="info-value" :style="{ color: balanceColor }">
                  ₱{{ formatBalance(studentData.balance) }}
                </div>
              </div>
            </div>

            <!-- Balance Status Banner -->
<!-- Balance Status Banner -->
            <div v-if="studentData.balance <= 0" class="info-banner" style="margin-top: 1rem; border-color: rgba(34, 197, 94, 0.3); background: rgba(34, 197, 94, 0.1);">
              <div class="info-row">
                <i class="fa-solid fa-circle-check" style="color: #22c55e;"></i>
                <span style="font-size: 0.875rem; color: #22c55e;">Balance fully paid!</span>
              </div>
            </div>
            
            <div v-else-if="studentData.balance < 100" class="info-banner" style="margin-top: 1rem; border-color: rgba(251, 191, 36, 0.3); background: rgba(251, 191, 36, 0.1);">
              <div class="info-row">
                <i class="fa-solid fa-exclamation-circle" style="color: #f59e0b;"></i>
                <span style="font-size: 0.875rem; color: #f59e0b;">Low remaining balance</span>
              </div>
            </div>
            
            <div v-else class="info-banner" style="margin-top: 1rem; border-color: rgba(239, 68, 68, 0.3); background: rgba(239, 68, 68, 0.1);">
              <div class="info-row">
                <i class="fa-solid fa-exclamation-triangle" style="color: #ef4444;"></i>
                <span style="font-size: 0.875rem; color: #ef4444;">Outstanding balance requires payment</span>
              </div>
            </div>
          </div>

          <footer class="modal-footer-inline modal-footer-center">
            <button type="button" @click="handleClose" class="btn-close">
              Close
            </button>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  studentData: {
    type: Object,
    required: true,
    default: () => ({
      name: '',
      balance: 0
    })
  },
  onClose: {
    type: Function,
    required: true
  }
});

const balanceColor = computed(() => {
  if (props.studentData.balance <= 0) return '#ef4444';
  if (props.studentData.balance < 100) return '#f59e0b';
  return 'var(--accent)';
});

function formatBalance(balance) {
  return Number(balance).toFixed(2);
}

function handleClose() {
  props.onClose();
}
</script>

<style scoped>
/* Using global CSS classes - minimal additional styling */
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 5;
}

/* Small spacing adjustment only */
.info-content {
  flex: 1;
}
</style>