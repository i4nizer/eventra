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
              <i class="fa-solid fa-barcode"></i>
              Scan Student Barcode
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
            <div class="barcode-input-wrapper">
              <label for="barcode" class="input-label">
                Student Barcode / ID
              </label>
              <div class="input-container">
                <i class="fa-solid fa-barcode input-icon"></i>
                <input
                  id="barcode"
                  ref="barcodeInput"
                  v-model="barcode"
                  type="text"
                  placeholder="Scan or enter student barcode..."
                  class="barcode-input"
                  @input="validateBarcode"
                  @keyup.enter="handleNext"
                  autofocus
                />
                <i
                  v-if="isValid"
                  class="fa-solid fa-circle-check validation-icon valid"
                ></i>
                <i
                  v-else-if="barcode && !isValid"
                  class="fa-solid fa-circle-xmark validation-icon invalid"
                ></i>
              </div>
              
              <div v-if="barcode && !isValid" class="error-message">
                <i class="fa-solid fa-triangle-exclamation"></i>
                Invalid barcode format. Please scan a valid student barcode.
              </div>
              
              <div v-if="isValid && studentInfo" class="student-info">
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
            </div>
          </div>

          <div class="modal-footer">
            <button
              @click="handleClose"
              class="btn btn-cancel"
            >
              Cancel
            </button>
            <Transition name="button-slide">
              <button
                v-if="isValid"
                @click="handleNext"
                class="btn btn-next"
              >
                Next
                <i class="fa-solid fa-arrow-right"></i>
              </button>
            </Transition>
          </div>
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
  onClose: {
    type: Function,
    required: true
  },
  onNext: {
    type: Function,
    required: true
  }
});

const barcode = ref('');
const isValid = ref(false);
const studentInfo = ref(null);
const barcodeInput = ref(null);

// Sample student database (replace with actual API call)
const studentDatabase = {
  '2021001': { id: '2021001', name: 'Juan Dela Cruz' },
  '2021045': { id: '2021045', name: 'Maria Santos' },
  '2020123': { id: '2020123', name: 'Jose Reyes' },
  '2019087': { id: '2019087', name: 'Ana Lim' },
  '2021002': { id: '2021002', name: 'Pedro Garcia' },
  '2021078': { id: '2021078', name: 'Sofia Reyes' },
  '2020056': { id: '2020056', name: 'Miguel Torres' }
};

function validateBarcode() {
  const trimmed = barcode.value.trim();
  
  // Basic validation: must be 7 digits
  const isValidFormat = /^\d{7}$/.test(trimmed);
  
  if (isValidFormat) {
    // Check if student exists in database
    const student = studentDatabase[trimmed];
    if (student) {
      isValid.value = true;
      studentInfo.value = student;
    } else {
      isValid.value = false;
      studentInfo.value = null;
    }
  } else {
    isValid.value = false;
    studentInfo.value = null;
  }
}

function handleNext() {
  if (isValid.value && studentInfo.value) {
    props.onNext(studentInfo.value);
    handleClose();
  }
}

function handleClose() {
  props.onClose();
  // Reset state
  setTimeout(() => {
    barcode.value = '';
    isValid.value = false;
    studentInfo.value = null;
  }, 300);
}

// Auto-focus input when modal opens
watch(() => props.open, (newVal) => {
  if (newVal) {
    nextTick(() => {
      barcodeInput.value?.focus();
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
}

.close-button:hover {
  background: var(--surface2);
  color: var(--text);
}

/* Modal Body */
.modal-body {
  padding: 2rem 1.5rem;
}

.barcode-input-wrapper {
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

.input-icon {
  position: absolute;
  left: 1rem;
  color: var(--accent);
  font-size: 1.25rem;
  pointer-events: none;
}

.barcode-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border-radius: 0.5rem;
  border: 2px solid var(--border);
  background: var(--bg);
  color: var(--text);
  font-size: 1rem;
  font-weight: 500;
  outline: none;
  transition: all 0.2s;
  letter-spacing: 0.05em;
}

.barcode-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
}

.barcode-input.error {
  border-color: #ef4444;
}

.validation-icon {
  position: absolute;
  right: 1rem;
  font-size: 1.5rem;
  animation: scaleIn 0.3s ease;
}

.validation-icon.valid {
  color: var(--accent);
}

.validation-icon.invalid {
  color: #ef4444;
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

/* Student Info */
.student-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  animation: slideDown 0.3s ease;
}

.info-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--surface);
  border-radius: 0.5rem;
  border: 1px solid var(--border);
}

.info-icon {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(16, 185, 129, 0.1);
  color: var(--accent);
  border-radius: 0.5rem;
  font-size: 1.25rem;
}

.info-content {
  flex: 1;
}

.info-label {
  font-size: 0.75rem;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
}

.info-value {
  font-size: 1rem;
  color: var(--text);
  font-weight: 600;
  margin-top: 0.25rem;
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
  justify-content: flex-end;
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
}

.btn-cancel {
  background: var(--surface2);
  color: var(--text);
  border: 1px solid var(--border);
}

.btn-cancel:hover {
  background: var(--bg);
}

.btn-next {
  background: var(--accent);
  color: white;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
}

.btn-next:hover {
  background: #0ea574;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
}

.btn-next:active {
  transform: translateY(0);
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

  .barcode-input {
    padding: 0.875rem 0.875rem 0.875rem 2.75rem;
    font-size: 0.9375rem;
  }

  .input-icon {
    font-size: 1.125rem;
    left: 0.875rem;
  }

  .modal-footer {
    padding: 1.25rem;
  }

  .btn {
    padding: 0.625rem 1.25rem;
    font-size: 0.875rem;
  }

  .info-card {
    padding: 0.875rem;
  }

  .info-icon {
    width: 2.25rem;
    height: 2.25rem;
    font-size: 1.125rem;
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