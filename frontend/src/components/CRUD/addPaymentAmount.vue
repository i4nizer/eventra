<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="modal-overlay"
        @click.self="handleClose"
      >
        <div class="modal-container">
          <div class="modal-header">
            <h2 class="modal-title">
              <i class="fa-solid fa-peso-sign"></i>
              Enter Payment Amount
            </h2>
            <button
              @click="handleClose"
              class="close-button"
              title="Close"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div class="modal-body">
            <!-- Student Info Display -->
            <div v-if="studentInfo" class="student-info-banner">
              <div class="info-row">
                <span class="info-label">Student:</span>
                <span class="info-value">{{ studentInfo.name }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">ID:</span>
                <span class="info-value">{{ studentInfo.id }}</span>
              </div>
            </div>

            <!-- Amount Input -->
            <div class="amount-input-wrapper">
              <label for="amount" class="input-label">
                Payment Amount
              </label>
              <div class="input-container">
                <span class="currency-symbol">₱</span>
                <input
                  id="amount"
                  ref="amountInput"
                  v-model="amount"
                  type="number"
                  placeholder="0.00"
                  class="amount-input"
                  @input="validateAmount"
                  @keyup.enter="handlePay"
                  min="0"
                  step="0.01"
                  autofocus
                />
              </div>
              
              <div v-if="amount && !isValidAmount" class="error-message">
                <i class="fa-solid fa-triangle-exclamation"></i>
                Please enter a valid amount greater than 0.
              </div>

              <!-- Quick Amount Buttons -->
              <div class="quick-amounts">
                <button
                  v-for="quickAmount in [50, 100, 150, 200, 500]"
                  :key="quickAmount"
                  @click="setAmount(quickAmount)"
                  class="quick-amount-btn"
                  :class="{ active: amount == quickAmount }"
                >
                  ₱{{ quickAmount }}
                </button>
              </div>

              <!-- Amount Preview -->
              <div v-if="isValidAmount" class="amount-preview">
                <div class="preview-label">Total Amount:</div>
                <div class="preview-amount">₱{{ formatAmount(amount) }}</div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button
              @click="handleBack"
              class="btn btn-back"
            >
              <i class="fa-solid fa-arrow-left"></i>
              Back
            </button>
            <button
              @click="handlePay"
              class="btn btn-pay"
              :disabled="!isValidAmount"
            >
              <i class="fa-solid fa-check"></i>
              Pay
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick, computed } from 'vue';

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

function setAmount(value) {
  amount.value = value.toString();
  validateAmount();
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
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

/* Modal Container */
.modal-container {
  background: var(--bg);
  border-radius: 1rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border);
  overflow: hidden;
}

/* Modal Header */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border);
  background: var(--surface);
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.modal-title i {
  color: var(--accent);
  font-size: 1.5rem;
}

.close-button {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--muted);
  transition: all 0.2s;
  border: none;
  background: transparent;
  cursor: pointer;
}

.close-button:hover {
  background: var(--surface2);
  color: var(--text);
}

/* Modal Body */
.modal-body {
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Student Info Banner */
.student-info-banner {
  padding: 1rem;
  background: var(--surface);
  border-radius: 0.5rem;
  border: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-label {
  font-size: 0.875rem;
  color: var(--muted);
  font-weight: 500;
}

.info-value {
  font-size: 0.875rem;
  color: var(--text);
  font-weight: 600;
}

/* Amount Input */
.amount-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 0.5rem;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.currency-symbol {
  position: absolute;
  left: 1rem;
  color: var(--accent);
  font-size: 1.5rem;
  font-weight: 600;
  pointer-events: none;
}

.amount-input {
  width: 100%;
  padding: 1rem 1rem 1rem 2.5rem;
  border-radius: 0.5rem;
  border: 2px solid var(--border);
  background: var(--bg);
  color: var(--text);
  font-size: 1.5rem;
  font-weight: 600;
  outline: none;
  transition: all 0.2s;
}

.amount-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
}

.amount-input::placeholder {
  color: var(--muted);
  opacity: 0.5;
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

/* Error Message */
.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  border: 1px solid rgba(239, 68, 68, 0.2);
  animation: slideDown 0.3s ease;
}

/* Quick Amount Buttons */
.quick-amounts {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.quick-amount-btn {
  flex: 1;
  min-width: calc(33.333% - 0.5rem);
  padding: 0.75rem;
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s;
  cursor: pointer;
}

.quick-amount-btn:hover {
  background: var(--surface2);
  border-color: var(--accent);
  color: var(--accent);
}

.quick-amount-btn.active {
  background: rgba(16, 185, 129, 0.1);
  border-color: var(--accent);
  color: var(--accent);
}

/* Amount Preview */
.amount-preview {
  padding: 1.25rem;
  background: rgba(16, 185, 129, 0.1);
  border: 2px solid var(--accent);
  border-radius: 0.75rem;
  text-align: center;
  animation: slideDown 0.3s ease;
}

.preview-label {
  font-size: 0.875rem;
  color: var(--muted);
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.preview-amount {
  font-size: 2rem;
  color: var(--accent);
  font-weight: 700;
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

/* Modal Footer */
.modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid var(--border);
  background: var(--surface);
}

/* Buttons */
.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.9375rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  cursor: pointer;
  flex: 1;
  justify-content: center;
}

.btn-back {
  background: var(--surface2);
  color: var(--text);
  border: 1px solid var(--border);
}

.btn-back:hover {
  background: var(--bg);
  border-color: var(--muted);
}

.btn-pay {
  background: var(--accent);
  color: white;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
}

.btn-pay:hover:not(:disabled) {
  background: #0ea574;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
}

.btn-pay:active:not(:disabled) {
  transform: translateY(0);
}

.btn-pay:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.95) translateY(-20px);
}

/* Responsive */
@media (max-width: 480px) {
  .modal-container {
    margin: 0;
    border-radius: 0.75rem;
  }

  .modal-header {
    padding: 1.25rem;
  }

  .modal-title {
    font-size: 1.125rem;
  }

  .modal-body {
    padding: 1.5rem 1.25rem;
  }

  .amount-input {
    padding: 0.875rem 0.875rem 0.875rem 2.25rem;
    font-size: 1.25rem;
  }

  .currency-symbol {
    font-size: 1.25rem;
    left: 0.875rem;
  }

  .quick-amount-btn {
    min-width: calc(50% - 0.25rem);
    padding: 0.625rem;
    font-size: 0.8125rem;
  }

  .preview-amount {
    font-size: 1.75rem;
  }

  .modal-footer {
    padding: 1.25rem;
    flex-direction: column;
  }

  .btn {
    padding: 0.625rem 1.25rem;
    font-size: 0.875rem;
    width: 100%;
  }
}

/* Dark mode specific adjustments */
:global(.dark) .modal-overlay {
  background: rgba(0, 0, 0, 0.8);
}

:global(.dark) .modal-container {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.6);
}
</style>