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
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </button>
          </header>

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
                  :class="{ 'input-error': barcode && !isValid && !isLoading }"
                  :disabled="isLoading"
                  @input="handleBarcodeInput"
                  @keyup.enter="handleNext"
                  autofocus
                />
                <i v-if="isLoading" class="fa-solid fa-spinner fa-spin validation-icon loading"></i>
                <i v-else-if="isValid" class="fa-solid fa-circle-check validation-icon valid"></i>
                <i v-else-if="barcode && !isValid" class="fa-solid fa-circle-xmark validation-icon invalid"></i>
              </div>
              <p v-if="error" class="error-message">
                <i class="fa-solid fa-triangle-exclamation"></i>
                {{ error }}
              </p>
            </div>

            <div v-if="isValid && studentInfo" class="student-info-section">
              <div class="info-card">
                <div class="info-icon"><i class="fa-solid fa-user"></i></div>
                <div class="info-content">
                  <div class="info-label">Student Name</div>
                  <div class="info-value">{{ studentInfo.name }}</div>
                </div>
              </div>
              <div class="info-card">
                <div class="info-icon"><i class="fa-solid fa-id-card"></i></div>
                <div class="info-content">
                  <div class="info-label">Student ID</div>
                  <div class="info-value">{{ studentInfo.sid }}</div>
                </div>
              </div>
              <div class="info-card">
                <div class="info-icon"><i class="fa-solid fa-wallet"></i></div>
                <div class="info-content">
                  <div class="info-label">Current Balance</div>
                  <div class="info-value balance">₱{{ studentBalance.toFixed(2) }}</div>
                </div>
              </div>
              <div v-if="studentViolations.length > 0" class="info-card">
                <div class="info-icon"><i class="fa-solid fa-exclamation-triangle"></i></div>
                <div class="info-content">
                  <div class="info-label">Unpaid Violations</div>
                  <div class="info-value">{{ studentViolations.length }}</div>
                </div>
              </div>
            </div>
          </div>

          <footer class="modal-footer-inline">
            <button type="button" @click="handleClose" class="btn-cancel" :disabled="isLoading">Cancel</button>
            <Transition name="button-slide">
              <button v-if="isValid && studentBalance > 0" type="button" @click="handleNext" class="btn-submit" :disabled="isLoading">
                Next <i class="fa-solid fa-arrow-right"></i>
              </button>
            </Transition>
            <span v-if="isValid && studentBalance <= 0" class="no-balance-msg">No outstanding balance</span>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue';
import axios from 'axios';

const props = defineProps({
  open: { type: Boolean, default: false },
  onClose: { type: Function, required: true },
  onNext: { type: Function, required: true },
  apiBaseUrl: { type: String, default: 'http://localhost:4000' }
});

const barcode = ref('');
const isValid = ref(false);
const isLoading = ref(false);
const studentInfo = ref(null);
const studentBalance = ref(0);
const studentViolations = ref([]); // NEW: Store violations with remaining amounts
const error = ref('');
const barcodeInput = ref(null);
let searchTimeout = null;

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

function isValidBarcodeFormat(value) {
  return /^\d{4}-\d{4}$/.test(value.trim());
}

async function fetchStudentBySid(sid) {
  try {
    isLoading.value = true;
    error.value = '';
    const response = await axios.get(`${props.apiBaseUrl}/section/student`, {
      headers: getAuthHeader()
    });
    const student = response.data.find(s => s.sid === sid);
    if (!student) throw new Error('Student not found in database');
    return student;
  } catch (err) {
    console.error('Error fetching student:', err);
    throw err;
  } finally {
    isLoading.value = false;
  }
}

// NEW: Fetch violations with their remaining balances
async function fetchStudentViolationsWithBalance(studentId) {
  try {
    const violationsResponse = await axios.get(
      `${props.apiBaseUrl}/violation/student/${studentId}`,
      { headers: getAuthHeader() }
    );
    
    const violations = violationsResponse.data;
    if (!violations || violations.length === 0) {
      return { violations: [], balance: 0 };
    }
    
    const violationsWithPayments = await Promise.all(
      violations.map(async (violation) => {
        try {
          const paymentsResponse = await axios.get(
            `${props.apiBaseUrl}/payment/violation/${violation.id}`,
            { headers: getAuthHeader() }
          );
          const payments = Array.isArray(paymentsResponse.data) ? paymentsResponse.data : [];
          const totalPaid = payments.reduce((sum, p) => sum + (Number(p.value) || 0), 0);
          const remaining = violation.fine - totalPaid;
          return { ...violation, totalPaid, remaining: Math.max(0, remaining) };
        } catch {
          return { ...violation, totalPaid: 0, remaining: violation.fine };
        }
      })
    );
    
    const unpaidViolations = violationsWithPayments.filter(v => v.remaining > 0);
    const totalBalance = unpaidViolations.reduce((sum, v) => sum + v.remaining, 0);
    
    return { violations: unpaidViolations, balance: totalBalance };
  } catch (err) {
    console.error('Error fetching violations:', err);
    return { violations: [], balance: 0 };
  }
}

function handleBarcodeInput() {
  const trimmed = barcode.value.trim();
  isValid.value = false;
  studentInfo.value = null;
  studentBalance.value = 0;
  studentViolations.value = [];
  error.value = '';
  
  if (searchTimeout) clearTimeout(searchTimeout);
  if (!trimmed) return;
  
  if (!isValidBarcodeFormat(trimmed)) {
    error.value = 'Invalid barcode format. Expected: YYYY-NNNN';
    return;
  }
  
  searchTimeout = setTimeout(async () => {
    try {
      const student = await fetchStudentBySid(trimmed);
      const { violations, balance } = await fetchStudentViolationsWithBalance(student.id);
      
      studentInfo.value = student;
      studentViolations.value = violations;
      studentBalance.value = balance;
      isValid.value = true;
    } catch (err) {
      isValid.value = false;
      studentInfo.value = null;
      error.value = err.response?.data || err.message || 'Student not found';
    }
  }, 500);
}

function handleNext() {
  if (isValid.value && studentInfo.value && studentBalance.value > 0) {
    props.onNext({
      ...studentInfo.value,
      balance: studentBalance.value,
      violations: studentViolations.value // Pass violations to next step
    });
    handleClose();
  }
}

function handleClose() {
  props.onClose();
  setTimeout(() => {
    barcode.value = '';
    isValid.value = false;
    isLoading.value = false;
    studentInfo.value = null;
    studentBalance.value = 0;
    studentViolations.value = [];
    error.value = '';
    if (searchTimeout) clearTimeout(searchTimeout);
  }, 300);
}

watch(() => props.open, (newVal) => {
  if (newVal) nextTick(() => barcodeInput.value?.focus());
});

onUnmounted(() => { if (searchTimeout) clearTimeout(searchTimeout); });
</script>

<style scoped>
.space-y-4 > * + * { margin-top: 1rem; }
.modal-backdrop { position: fixed; inset: 0; z-index: 5; }
.barcode-input-container { position: relative; display: flex; align-items: center; }
.barcode-icon { position: absolute; left: 0.75rem; color: var(--accent); font-size: 1.25rem; }
.barcode-input { padding-left: 3rem !important; letter-spacing: 0.05em; font-weight: 500; }
.validation-icon { position: absolute; right: 0.75rem; font-size: 1.5rem; }
.validation-icon.valid { color: var(--accent); }
.validation-icon.invalid { color: #ef4444; }
.student-info-section { display: flex; flex-direction: column; gap: 0.75rem; }
.info-value.balance { color: var(--accent); font-size: 1.125rem; }
.no-balance-msg { color: #22c55e; font-size: 0.875rem; font-weight: 500; }
.btn-submit { display: flex; align-items: center; gap: 0.5rem; }
</style>