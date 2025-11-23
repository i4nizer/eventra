<template>
  <div v-if="open" class="modal-backdrop-simple">
    <div class="modal-backdrop" @click="onClose"></div>

    <div class="modal-form scrollable">
      <header class="modal-header-inline">
        <div>
          <h3 class="modal-title with-icon">
            <i class="fa-solid fa-exclamation-triangle" style="color: var(--danger);"></i>
            Violation Details
          </h3>
          <p class="modal-subtitle">View violation and payment information</p>
        </div>
        <button type="button" @click="onClose" class="close-btn">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </button>
      </header>

      <div v-if="violation">
        <!-- Student Info -->
        <div class="info-card">
          <div class="info-icon"><i class="fa-solid fa-user"></i></div>
          <div class="info-content">
            <div class="info-label">Student</div>
            <div class="info-value">{{ violation.studentName }}</div>
            <div class="text-muted" style="font-size: 0.75rem;">{{ violation.studentSid }}</div>
          </div>
        </div>

        <!-- Activity Info -->
        <div class="info-card" style="margin-top: 0.75rem;">
          <div class="info-icon"><i class="fa-solid fa-calendar-xmark"></i></div>
          <div class="info-content">
            <div class="info-label">Activity</div>
            <div class="info-value">{{ violation.activityName }}</div>
            <div class="text-muted" style="font-size: 0.75rem;">{{ violation.entryName }}</div>
          </div>
        </div>

        <!-- Financial Summary -->
        <div class="info-banner" style="margin-top: 0.75rem;">
          <div class="info-row" style="justify-content: space-between;">
            <div style="text-align: center; flex: 1;">
              <div class="info-label">Fine</div>
              <div class="info-value" style="color: var(--danger);">₱{{ violation.fine?.toLocaleString() }}</div>
            </div>
            <div style="text-align: center; flex: 1;">
              <div class="info-label">Paid</div>
              <div class="info-value" style="color: var(--accent);">₱{{ violation.totalPaid?.toLocaleString() }}</div>
            </div>
            <div style="text-align: center; flex: 1;">
              <div class="info-label">Balance</div>
              <div class="info-value" :style="{ color: violation.remaining > 0 ? 'var(--danger)' : 'var(--accent)' }">₱{{ violation.remaining?.toLocaleString() }}</div>
            </div>
          </div>
        </div>

        <!-- Status Banner -->
        <div class="info-banner" :style="getStatusStyle()" style="margin-top: 0.75rem;">
          <div class="info-row" style="justify-content: center;">
            <i :class="getStatusIcon()"></i>
            <span>{{ getStatusMessage() }}</span>
          </div>
        </div>

        <!-- Payment History -->
        <div v-if="violation.payments?.length > 0" class="info-banner" style="margin-top: 0.75rem;">
          <div class="info-row" style="margin-bottom: 0.5rem;">
            <i class="fa-solid fa-history"></i>
            <span class="info-value">Payment History</span>
          </div>
          <div v-for="p in violation.payments" :key="p.id" class="info-card" style="padding: 0.75rem; margin-top: 0.5rem;">
            <div class="info-content">
              <div class="info-value" style="color: var(--accent);">₱{{ p.value?.toLocaleString() }}</div>
              <div class="text-muted" style="font-size: 0.75rem;">{{ p.remarks || 'No remarks' }}</div>
            </div>
            <div class="text-muted" style="font-size: 0.75rem;">{{ formatDate(p.createdAt) }}</div>
          </div>
        </div>

        <!-- No Payments -->
        <div v-else class="info-banner" style="margin-top: 0.75rem; text-align: center;">
          <div class="info-row" style="justify-content: center;">
            <i class="fa-solid fa-info-circle text-muted"></i>
            <span class="text-muted">No payments recorded yet</span>
          </div>
        </div>

        <!-- Violation Date -->
        <div class="info-card" style="margin-top: 0.75rem;">
          <div class="info-icon"><i class="fa-solid fa-clock"></i></div>
          <div class="info-content">
            <div class="info-label">Violation Date</div>
            <div class="info-value">{{ formatDate(violation.createdAt) }}</div>
          </div>
        </div>
      </div>

      <footer class="modal-footer-inline">
        <button type="button" @click="onClose" class="btn-close">Close</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  open: { type: Boolean, default: false },
  violation: { type: Object, default: null },
  onClose: { type: Function, required: true }
});

function getStatusStyle() {
  if (!props.violation) return {};
  if (props.violation.remaining <= 0) return { borderColor: 'rgba(16, 185, 129, 0.3)', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent)' };
  if (props.violation.totalPaid > 0) return { borderColor: 'rgba(251, 191, 36, 0.3)', background: 'rgba(251, 191, 36, 0.1)', color: '#f59e0b' };
  return { borderColor: 'rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' };
}

function getStatusIcon() {
  if (!props.violation) return '';
  if (props.violation.remaining <= 0) return 'fa-solid fa-circle-check';
  if (props.violation.totalPaid > 0) return 'fa-solid fa-clock';
  return 'fa-solid fa-circle-xmark';
}

function getStatusMessage() {
  if (!props.violation) return '';
  if (props.violation.remaining <= 0) return 'This violation has been fully paid';
  if (props.violation.totalPaid > 0) return `Partial payment - ₱${props.violation.remaining} remaining`;
  return 'This violation is unpaid';
}

function formatDate(d) {
  if (!d) return 'N/A';
  return new Date(d).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
</script>

<style scoped>
.modal-backdrop { position: fixed; inset: 0; z-index: 5; }
.info-content { flex: 1; }
</style>