<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="open" class="modal-backdrop-simple">
        <div class="modal-backdrop" @click="handleClose"></div>

        <div class="modal-form scrollable">
          <header class="modal-header-inline">
            <div>
              <h3 class="modal-title with-icon">
                <i class="fa-solid fa-peso-sign"></i>
                Enter Payment Amount
              </h3>
              <p class="modal-subtitle">Enter the payment amount to process</p>
            </div>
            <button type="button" @click="handleClose" class="close-btn">
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

          <!-- Form content -->
          <div class="space-y-4">
            <!-- Student Info -->
            <div v-if="studentInfo" class="student-info-section">
              <div class="info-card">
                <div class="info-icon">
                  <i class="fa-solid fa-user"></i>
                </div>
                <div class="info-content">
                  <div class="info-label">Student Name</div>
                  <div class="info-value">{{ studentInfo.name }}</div>
                </div>
              </div>
              <div class="info-card">
                <div class="info-icon">
                  <i class="fa-solid fa-id-card"></i>
                </div>
                <div class="info-content">
                  <div class="info-label">Student ID</div>
                  <div class="info-value">{{ studentInfo.id }}</div>
                </div>
              </div>
            </div>

            <!-- Amount Input -->
            <div>
              <label class="input-label">Payment Amount</label>
              <div class="amount-input-container">
                <span class="currency-symbol">₱</span>
                <input
                  id="amount"
                  ref="amountInput"
                  v-model="amount"
                  type="number"
                  placeholder="0.00"
                  class="input-field amount-input"
                  @input="validateAmount"
                  @keyup.enter="handlePay"
                  min="0"
                  step="0.01"
                  autofocus
                />
                <i
                  v-if="isValidAmount"
                  class="fa-solid fa-circle-check validation-icon valid"
                ></i>
              </div>

              <p v-if="amount && !isValidAmount" class="error-message">
                <i class="fa-solid fa-triangle-exclamation"></i>
                Please enter a valid amount greater than 0.
              </p>

              <!-- Amount Preview -->
              <div v-if="isValidAmount" class="amount-preview">
                <div class="preview-label">Total Amount</div>
                <div class="preview-amount">₱{{ formatAmount(amount) }}</div>
              </div>
            </div>
          </div>

          <footer class="modal-footer-inline">
            <button type="button" @click="handleBack" class="btn-close">
              <i class="fa-solid fa-arrow-left"></i>
              Back
            </button>
            <Transition name="button-slide">
              <button
                v-if="isValidAmount"
                type="button"
                @click="handlePay"
                class="btn-submit"
              >
                <i class="fa-solid fa-check"></i>
                Pay
              </button>
            </Transition>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  studentInfo: {
    type: Object,
    default: null
  },
  onClose: {
    type: Function,
    required: true
  },
  onBack: {
    type: Function,
    required: true
  },
  onPay: {
    type: Function,
    required: true
  }
});

const amount = ref('');
const isValidAmount = ref(false);
const amountInput = ref(null);

function validateAmount() {
  const numAmount = parseFloat(amount.value);
  isValidAmount.value = !isNaN(numAmount) && numAmount > 0;
}

function formatAmount(value) {
  const num = parseFloat(value);
  return num.toLocaleString('en-US', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
}

function handlePay() {
  if (isValidAmount.value) {
    const paymentData = {
      studentInfo: props.studentInfo,
      amount: parseFloat(amount.value)
    };
    props.onPay(paymentData);
    handleClose();
  }
}

function handleBack() {
  props.onBack();
}

function handleClose() {
  props.onClose();
  // Reset state
  setTimeout(() => {
    amount.value = '';
    isValidAmount.value = false;
  }, 300);
}

// Auto-focus input when modal opens
watch(() => props.open, (newVal) => {
  if (newVal) {
    nextTick(() => {
      amountInput.value?.focus();
    });
  }
});
</script>

<style scoped>
.space-y-4 > * + * {
  margin-top: 1rem;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 5;
}

/* Student Info Section */
.student-info-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  animation: slideDown 0.3s ease;
}

/* Amount Input Container */
.amount-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.currency-symbol {
  position: absolute;
  left: 0.75rem;
  color: var(--accent);
  font-size: 1.25rem;
  font-weight: 600;
  pointer-events: none;
}

.amount-input {
  padding-left: 2.5rem !important;
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.025em;
}

.validation-icon {
  position: absolute;
  right: 0.75rem;
  font-size: 1.5rem;
  animation: scaleIn 0.3s ease;
}

.validation-icon.valid {
  color: var(--accent);
}

/* Remove spinner buttons for number input */
.amount-input::-webkit-outer-spin-button,
.amount-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.amount-input[type=number] {
  -moz-appearance: textfield;
}

/* Amount Preview */
.amount-preview {
  margin-top: 1rem;
  padding: 1.25rem;
  background: rgba(16, 185, 129, 0.1);
  border: 2px solid var(--accent);
  border-radius: 0.75rem;
  text-align: center;
  animation: slideDown 0.3s ease;
}

.preview-label {
  font-size: 0.75rem;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.preview-amount {
  font-size: 2rem;
  color: var(--accent);
  font-weight: 700;
  letter-spacing: 0.025em;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Button Transition */
.button-slide-enter-active,
.button-slide-leave-active {
  transition: all 0.3s ease;
}

.button-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.button-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.btn-submit,
.btn-close {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Responsive */
@media (max-width: 480px) {
  .amount-input {
    font-size: 1.125rem;
    padding-left: 2.25rem !important;
  }

  .currency-symbol {
    font-size: 1.125rem;
  }

  .preview-amount {
    font-size: 1.5rem;
  }
}
</style>