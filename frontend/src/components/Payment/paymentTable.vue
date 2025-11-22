<template>
  <div class="table-wrapper">
    <!-- Header -->
    <div class="table-header">
      <div class="header-top">
        <div class="relative search-wrapper">
          <input
            v-model="q"
            type="search"
            placeholder="Search by student, violation or remarks..."
            class="search-input"
          />
          <i
            class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 search-icon"
          ></i>
        </div>
      </div>

      <div class="header-bottom">
        <select v-model="perPage" class="select-input">
          <option v-for="n in [5, 10, 20, 50]" :key="n" :value="n">
            {{ n }} / page
          </option>
        </select>

        <button @click="refreshData" class="btn-refresh">
          <i class="fa-solid fa-arrows-rotate"></i>
          <span class="btn-text">Refresh</span>
        </button>
        <slot name="controls"></slot>
      </div>
    </div>

    <!-- Pay Button Section -->
    <div class="pay-button-section">
      <button @click="openAddPaymentModal" class="btn-add">
        <i class="fa-solid fa-credit-card"></i>
        <span>Pay</span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <i class="fa-solid fa-spinner fa-spin"></i>
      <span>Loading payments...</span>
    </div>

    <!-- Desktop Table -->
    <div v-else class="desktop-table">
      <table class="w-full text-left text-sm">
        <thead class="table-head">
          <tr>
            <th class="p-3">#</th>
            <th class="p-3 cursor-pointer" @click="sortBy('studentName')">
              Student Name
              <SortIcon :field="'studentName'" :sort="sort" />
            </th>
            <th class="p-3 cursor-pointer" @click="sortBy('violationType')">
              Violation
              <SortIcon :field="'violationType'" :sort="sort" />
            </th>
            <th class="p-3 cursor-pointer" @click="sortBy('value')">
              Amount
              <SortIcon :field="'value'" :sort="sort" />
            </th>
            <th class="p-3">Remarks</th>
            <th class="p-3 cursor-pointer" @click="sortBy('createdAt')">
              Payment Date
              <SortIcon :field="'createdAt'" :sort="sort" />
            </th>
            <th class="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(p, idx) in paged"
            :key="p.id || idx"
            class="table-row"
          >
            <td class="p-3 align-middle row-number">
              {{ startIndex + idx + 1 }}
            </td>
            <td class="p-3 align-middle">
              <div class="student-name">{{ p.studentName }}</div>
              <div class="student-id">ID: {{ p.studentId }}</div>
            </td>
            <td class="p-3 align-middle">
              <span class="badge badge-violation">
                {{ p.violationType }}
              </span>
            </td>
            <td class="p-3 align-middle">
              <span class="badge badge-amount">
                ₱{{ p.value.toLocaleString() }}
              </span>
            </td>
            <td class="p-3 align-middle remarks-text">
              {{ p.remarks || '-' }}
            </td>
            <td class="p-3 align-middle">
              <span class="badge badge-date">
                {{ formatDate(p.createdAt) }}
              </span>
            </td>

            <td class="p-3 align-middle">
              <div class="flex items-center gap-2">
                <button
                  @click="handleView(p)"
                  class="action-btn btn-view"
                  title="View Receipt"
                >
                  <i class="fa-solid fa-eye"></i>
                </button>
                <button
                  @click="handleDelete(p)"
                  class="action-btn btn-delete"
                  title="Delete"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="paged.length === 0">
            <td class="p-6 text-center text-sm empty-state" :colspan="7">
              No payment records found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Cards -->
    <div v-if="!loading" class="mobile-cards">
      <div
        v-for="(p, idx) in paged"
        :key="p.id || idx"
        class="payment-card"
      >
        <div class="card-header">
          <div class="card-number">{{ startIndex + idx + 1 }}</div>
          <div class="card-header-right">
            <span class="badge badge-amount">₱{{ p.value.toLocaleString() }}</span>
            <div class="card-actions">
              <button
                @click="handleView(p)"
                class="action-btn btn-view"
                title="View Receipt"
              >
                <i class="fa-solid fa-receipt"></i>
              </button>
              <button
                @click="handleDelete(p)"
                class="action-btn btn-delete"
                title="Delete"
              >
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="card-content">
          <div class="card-row">
            <div class="card-label">Student</div>
            <div class="card-value">
              <div class="student-name">{{ p.studentName }}</div>
              <div class="student-id">ID: {{ p.studentId }}</div>
            </div>
          </div>

          <div class="card-row">
            <div class="card-label">Violation</div>
            <div class="card-value">
              <span class="badge badge-violation">{{ p.violationType }}</span>
            </div>
          </div>

          <div class="card-row">
            <div class="card-label">Remarks</div>
            <div class="card-value remarks-text">{{ p.remarks || '-' }}</div>
          </div>

          <div class="card-row">
            <div class="card-label">Payment Date</div>
            <div class="card-value">
              <span class="badge badge-date">{{ formatDate(p.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="paged.length === 0" class="empty-state-mobile">
        No payment records found.
      </div>
    </div>

    <!-- Pagination -->
    <div class="table-footer">
      <div class="pagination-info">
        Showing {{ startIndex + 1 }} - {{ startIndex + paged.length }} of
        {{ filtered.length }}
      </div>

      <div class="flex items-center gap-2">
        <button
          class="pagination-btn"
          :disabled="page === 1"
          @click="page--"
        >
          Prev
        </button>
        <div class="pagination-current">
          {{ page }}
        </div>
        <button
          class="pagination-btn"
          :disabled="page >= totalPages"
          @click="page++"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Add Payment Modal (Step 1: Scan Barcode) -->
    <AddPayment
      :open="isAddPaymentModalOpen"
      :onClose="closeAddPaymentModal"
      :onNext="handleStudentScanned"
    />

    <!-- Add Payment Amount Modal (Step 2: Enter Amount) -->
    <AddPaymentAmount
      :open="isAddPaymentAmountModalOpen"
      :studentInfo="scannedStudent"
      :onClose="closeAddPaymentAmountModal"
      :onBack="handleBackToScan"
      :onPay="handlePaymentSubmit"
    />

    <!-- Show Balance Modal (Step 3: Show Updated Balance) -->
    <ShowBalance
      :open="isBalanceModalOpen"
      :studentData="balanceData"
      :onClose="closeBalanceModal"
    />

    <!-- Read Payment Modal -->
    <ReadPayment
      :open="isViewModalOpen"
      :onClose="closeViewModal"
      :payment="selectedPaymentForView"
    />

    <!-- Delete Payment Modal -->
    <DeletePayment
      :open="isDeleteModalOpen"
      :onClose="closeDeleteModal"
      :onConfirm="confirmDelete"
      :payment="selectedPaymentForDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import axios from "axios";
import AddPayment from "@/components/CRUD/addPayment.vue";
import AddPaymentAmount from "@/components/CRUD/addPaymentAmount.vue";
import ShowBalance from "@/components/CRUD/showBalance.vue";
import ReadPayment from "@/components/CRUD/readPayment.vue";
import DeletePayment from "@/components/CRUD/deletePayment.vue";

const SortIcon = {
  props: ["field", "sort"],
  template: `<span class="inline-block ml-2 text-xs sort-icon">
    <i v-if="sort.field===field && sort.dir==='asc'" class="fa-solid fa-arrow-up"></i>
    <i v-else-if="sort.field===field && sort.dir==='desc'" class="fa-solid fa-arrow-down"></i>
  </span>`,
};

const props = defineProps({
  violationId: { type: Number, default: null },
  defaultPerPage: { type: Number, default: 10 },
  apiUrl: { type: String, default: "http://localhost:4000" },
});

const emit = defineEmits(["error", "success"]);

const API_BASE = props.apiUrl;
const getAuthHeader = () => {
  const token = localStorage.getItem('token'); // Adjust based on your auth storage
  return { Authorization: `Bearer ${token}` };
};

const payments = ref([]);
const loading = ref(false);

const q = ref("");
const page = ref(1);
const perPage = ref(props.defaultPerPage);
const sort = ref({ field: "createdAt", dir: "desc" });

const isAddPaymentModalOpen = ref(false);
const scannedStudent = ref(null);
const isAddPaymentAmountModalOpen = ref(false);
const isBalanceModalOpen = ref(false);
const balanceData = ref({ name: '', balance: 0 });
const isViewModalOpen = ref(false);
const selectedPaymentForView = ref(null);
const isDeleteModalOpen = ref(false);
const selectedPaymentForDelete = ref(null);

async function fetchPayments() {
  loading.value = true;
  try {
    const endpoint = props.violationId 
      ? `/payment/violation/${props.violationId}`
      : '/payment';
    
    const response = await axios.get(`${API_BASE}${endpoint}`, {
      headers: getAuthHeader(),
    });
    
    payments.value = response.data;
  } catch (error) {
    console.error('Error fetching payments:', error);
    emit('error', error.response?.data || 'Failed to fetch payments');
  } finally {
    loading.value = false;
  }
}

async function refreshData() {
  await fetchPayments();
  emit('success', 'Payments refreshed');
}

async function createPayment(violationId, paymentData) {
  try {
    const response = await axios.post(
      `${API_BASE}/payment/violation/${violationId}`,
      paymentData,
      { headers: getAuthHeader() }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
}

async function updatePayment(paymentId, updateData) {
  try {
    const response = await axios.patch(
      `${API_BASE}/payment/${paymentId}`,
      updateData,
      { headers: getAuthHeader() }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error updating payment:', error);
    throw error;
  }
}

// Delete payment
async function deletePayment(paymentId) {
  try {
    const response = await axios.delete(
      `${API_BASE}/payment/${paymentId}`,
      { headers: getAuthHeader() }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error deleting payment:', error);
    throw error;
  }
}

// Modal handlers
function openAddPaymentModal() {
  isAddPaymentModalOpen.value = true;
}

function closeAddPaymentModal() {
  isAddPaymentModalOpen.value = false;
}

function handleStudentScanned(studentInfo) {
  scannedStudent.value = studentInfo;
  closeAddPaymentModal();
  isAddPaymentAmountModalOpen.value = true;
}

function closeAddPaymentAmountModal() {
  isAddPaymentAmountModalOpen.value = false;
  scannedStudent.value = null;
}

function handleBackToScan() {
  closeAddPaymentAmountModal();
  isAddPaymentModalOpen.value = true;
}

async function handlePaymentSubmit(paymentData) {
  try {
    const newPayment = await createPayment(
      paymentData.violationId,
      {
        value: paymentData.amount,
        remarks: paymentData.remarks || ""
      }
    );
    
    emit('success', 'Payment created successfully');
    
    closeAddPaymentAmountModal();
    
    const newBalance = calculateNewBalance(paymentData);
    
    balanceData.value = {
      name: paymentData.studentInfo.name,
      balance: newBalance
    };
    
    isBalanceModalOpen.value = true;
    
    await fetchPayments();
  } catch (error) {
    emit('error', error.response?.data || 'Failed to create payment');
    closeAddPaymentAmountModal();
  }
}

function calculateNewBalance(paymentData) {
  const outstandingBalance = paymentData.studentInfo.balance || 0;
  const newBalance = outstandingBalance - paymentData.amount;
  return Math.max(0, newBalance);
}

function closeBalanceModal() {
  isBalanceModalOpen.value = false;
  balanceData.value = { name: '', balance: 0 };
}

function sortBy(field) {
  if (sort.value.field === field) {
    sort.value.dir = sort.value.dir === "asc" ? "desc" : "asc";
  } else {
    sort.value.field = field;
    sort.value.dir = field === "createdAt" ? "desc" : "asc";
  }
}

function handleView(payment) {
  selectedPaymentForView.value = {
    name: payment.studentName,
    violation: payment.violationType,
    amount: `₱${payment.value.toLocaleString()}`,
    remarks: payment.remarks || '-',
    date: formatDate(payment.createdAt),
  };
  isViewModalOpen.value = true;
}

function closeViewModal() {
  isViewModalOpen.value = false;
  selectedPaymentForView.value = null;
}

function handleDelete(payment) {
  selectedPaymentForDelete.value = {
    name: payment.studentName,
    tag: payment.studentId,
    activity: payment.violationType,
    date: formatDate(payment.createdAt),
    originalData: payment,
  };
  isDeleteModalOpen.value = true;
}

function closeDeleteModal() {
  isDeleteModalOpen.value = false;
  selectedPaymentForDelete.value = null;
}

async function confirmDelete() {
  try {
    await deletePayment(selectedPaymentForDelete.value.originalData.id);
    emit('success', 'Payment deleted successfully');
    closeDeleteModal();
    await fetchPayments();
  } catch (error) {
    emit('error', error.response?.data || 'Failed to delete payment');
  }
}

const filtered = computed(() => {
  const qq = q.value.trim().toLowerCase();
  return payments.value.filter((p) => {
    if (!qq) return true;
    return (
      (p.studentName || "").toLowerCase().includes(qq) ||
      (p.violationType || "").toLowerCase().includes(qq) ||
      (p.remarks || "").toLowerCase().includes(qq) ||
      (p.studentId || "").toString().toLowerCase().includes(qq)
    );
  });
});

const sorted = computed(() => {
  const arr = [...filtered.value];
  const f = sort.value.field;
  const dir = sort.value.dir === "asc" ? 1 : -1;
  
  arr.sort((a, b) => {
    if (f === "createdAt") {
      const dateA = new Date(a[f]);
      const dateB = new Date(b[f]);
      return (dateA - dateB) * dir;
    }
    
    if (f === "value") {
      return (a[f] - b[f]) * dir;
    }
    
    const va = (a[f] || "").toString().toLowerCase();
    const vb = (b[f] || "").toString().toLowerCase();
    if (va < vb) return -1 * dir;
    if (va > vb) return 1 * dir;
    return 0;
  });
  return arr;
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(sorted.value.length / perPage.value))
);

const startIndex = computed(() => (page.value - 1) * perPage.value);

const paged = computed(() =>
  sorted.value.slice(startIndex.value, startIndex.value + perPage.value)
);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

watch([q, perPage], () => (page.value = 1));

onMounted(() => {
  fetchPayments();
});
</script>

<style scoped>
.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 3rem;
  color: var(--text-secondary);
}

.loading-state i {
  font-size: 1.5rem;
}

@media (min-width: 640px) {
  .header-top {
    flex-direction: row;
    align-items: center;
    gap: 0.75rem;
  }
}

@media (min-width: 768px) {
  .table-header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .header-top {
    flex: 1;
  }

  .header-bottom {
    flex-shrink: 0;
  }
}

.pay-button-section {
  padding: 1rem;
  border-bottom: 1px solid var(--border);
  background: var(--surface);
  display: flex;
  justify-content: center;
}

.desktop-table {
  display: none;
  overflow-x: auto;
}

@media (min-width: 768px) {
  .desktop-table {
    display: block;
  }
}

.card-header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

@media (max-width: 480px) {
  .table-header {
    padding: 0.75rem;
  }

  .search-input {
    font-size: 0.8125rem;
  }

  .btn-refresh,
  .select-input {
    font-size: 0.8125rem;
    padding: 0.4rem 0.6rem;
  }

  .pay-button-section {
    padding: 0.75rem;
  }

  .btn-add {
    padding: 0.625rem 1.25rem;
    font-size: 0.875rem;
  }

  .payment-card {
    padding: 0.875rem;
  }

  .card-header {
    margin-bottom: 0.625rem;
    padding-bottom: 0.625rem;
  }

  .card-number {
    font-size: 0.9375rem;
  }

  .card-header-right {
    gap: 0.5rem;
  }

  .card-row {
    gap: 0.75rem;
  }

  .card-label {
    font-size: 0.6875rem;
    min-width: 80px;
  }

  .student-name {
    font-size: 0.875rem;
  }

  .action-btn {
    padding: 0.375rem 0.5rem;
    font-size: 0.8125rem;
  }

  .table-footer {
    padding: 0.625rem 0.75rem;
  }

  .pagination-info {
    font-size: 0.6875rem;
  }

  .pagination-btn,
  .pagination-current {
    font-size: 0.8125rem;
    padding: 0.375rem 0.625rem;
  }
}
</style>