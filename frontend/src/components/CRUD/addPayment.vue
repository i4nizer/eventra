<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="open" class="modal-backdrop-simple">
        <div class="modal-backdrop" @click="handleClose"></div>

        <div class="modal-form scrollable">
          <header class="modal-header-inline">
            <div>
              <h3 class="modal-title with-icon">
                <i class="fa-solid fa-barcode"></i>
                Scan Student Barcode
              </h3>
              <p class="modal-subtitle">Scan or enter student barcode to continue</p>
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
            <div>
              <label class="input-label">Student Barcode / ID</label>
              <div class="barcode-input-container">
                <i class="fa-solid fa-barcode barcode-icon"></i>
                <input
                  id="barcode"
                  ref="barcodeInput"
                  v-model="barcode"
                  type="text"
                  placeholder="Scan or enter student barcode..."
                  class="input-field barcode-input"
                  :class="{ 'input-error': barcode && !isValid }"
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

              <p v-if="barcode && !isValid" class="error-message">
                <i class="fa-solid fa-triangle-exclamation"></i>
                Invalid barcode format. Please scan a valid student barcode.
              </p>
            </div>

            <!-- Student Info -->
            <div v-if="isValid && studentInfo" class="student-info-section">
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

          <footer class="modal-footer-inline">
            <button type="button" @click="handleClose" class="btn-cancel">
              Cancel
            </button>
            <Transition name="button-slide">
              <button
                v-if="isValid"
                type="button"
                @click="handleNext"
                class="btn-submit"
              >
                Next
                <i class="fa-solid fa-arrow-right"></i>
              </button>
            </Transition>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue';

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
  '2022-0377': { id: '2022-0377', name: 'Ariston Bading' },
  '2021-0045': { id: '2021-0045', name: 'Maria Santos' },
  '2020-0123': { id: '2020-0123', name: 'Jose Reyes' },
  '2019-0087': { id: '2019-0087', name: 'Ana Lim' },
  '2021-0002': { id: '2021-0002', name: 'Pedro Garcia' },
  '2021-0078': { id: '2021-0078', name: 'Sofia Reyes' },
  '2020-0056': { id: '2020-0056', name: 'Miguel Torres' }
};

function validateBarcode() {
  const trimmed = barcode.value.trim();
  
  // Validation format: YYYY-NNNN (e.g., 2022-0377)
  const isValidFormat = /^\d{4}-\d{4}$/.test(trimmed);
  
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

// Focus management for barcode scanner
function ensureFocus() {
  if (props.open && barcodeInput.value) {
    barcodeInput.value.focus();
  }
}

// Handle clicks anywhere in modal to refocus input
function handleModalClick(event) {
  if (props.open && !event.target.closest('.btn')) {
    ensureFocus();
  }
}

// Auto-focus input when modal opens
watch(() => props.open, (newVal) => {
  if (newVal) {
    nextTick(() => {
      ensureFocus();
      // Set up a recurring focus check for barcode scanners
      const focusInterval = setInterval(() => {
        if (!props.open) {
          clearInterval(focusInterval);
          return;
        }
        ensureFocus();
      }, 100);
    });
  }
});

// Keep focus on input even if user clicks elsewhere in modal
onMounted(() => {
  document.addEventListener('click', handleModalClick);
});

onUnmounted(() => {
  document.removeEventListener('click', handleModalClick);
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

/* Barcode Input Container */
.barcode-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.barcode-icon {
  position: absolute;
  left: 0.75rem;
  color: var(--accent);
  font-size: 1.25rem;
  pointer-events: none;
}

.barcode-input {
  padding-left: 3rem !important;
  letter-spacing: 0.05em;
  font-weight: 500;
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

/* Student Info Section */
.student-info-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  animation: slideDown 0.3s ease;
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

.btn-submit {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>