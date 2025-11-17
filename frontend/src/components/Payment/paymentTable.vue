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

        <button @click="$emit('refresh')" class="btn-refresh">
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

    <!-- Desktop Table -->
    <div class="desktop-table">
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
    <div class="mobile-cards">
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
              <span class="badgebadge-date">{{ formatDate(p.createdAt) }}</span>
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
import { ref, computed, watch } from "vue";
import AddPayment from "@/components/CRUD/addPayment.vue";
import AddPaymentAmount from "@/components/CRUD/addPaymentAmount.vue";
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
  payments: { type: Array, default: () => null },
  defaultPerPage: { type: Number, default: 10 },
});

const emit = defineEmits(["delete", "view", "refresh", "pay", "paymentSubmit"]);

const q = ref("");
const page = ref(1);
const perPage = ref(props.defaultPerPage);
const sort = ref({ field: "createdAt", dir: "desc" });

// Add Payment modal state (Step 1)
const isAddPaymentModalOpen = ref(false);
const scannedStudent = ref(null);

// Add Payment Amount modal state (Step 2)
const isAddPaymentAmountModalOpen = ref(false);

// View modal state
const isViewModalOpen = ref(false);
const selectedPaymentForView = ref(null);

// Delete modal state
const isDeleteModalOpen = ref(false);
const selectedPaymentForDelete = ref(null);

function openAddPaymentModal() {
  isAddPaymentModalOpen.value = true;
  emit('pay');
}

function closeAddPaymentModal() {
  isAddPaymentModalOpen.value = false;
}

function handleStudentScanned(studentInfo) {
  // Store the scanned student info
  scannedStudent.value = studentInfo;
  
  // Close the barcode scan modal
  closeAddPaymentModal();
  
  // Open the payment amount modal
  isAddPaymentAmountModalOpen.value = true;
  
  console.log('Student scanned:', studentInfo);
}

function closeAddPaymentAmountModal() {
  isAddPaymentAmountModalOpen.value = false;
  scannedStudent.value = null;
}

function handleBackToScan() {
  // Close amount modal and reopen scan modal
  closeAddPaymentAmountModal();
  isAddPaymentModalOpen.value = true;
}

function handlePaymentSubmit(paymentData) {
  // Emit the payment data to parent component
  emit('paymentSubmit', paymentData);
  
  console.log('Payment submitted:', paymentData);
  
  // Close the amount modal
  closeAddPaymentAmountModal();
  
  // You can add success notification here
  // toast.success('Payment recorded successfully!');
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
  emit('view', payment);
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

function confirmDelete() {
  emit('delete', selectedPaymentForDelete.value.originalData);
  closeDeleteModal();
}

const sample = [
  {
    id: 1,
    value: 100,
    remarks: "Paid in full",
    violationId: 201,
    violationType: "Late Attendance",
    studentId: 2021001,
    studentName: "Juan Dela Cruz",
    createdAt: "2024-01-15T14:30:00",
    updatedAt: "2024-01-15T14:30:00",
  },
  {
    id: 2,
    value: 150,
    remarks: "Partial payment",
    violationId: 202,
    violationType: "Dress Code Violation",
    studentId: 2021045,
    studentName: "Maria Santos",
    createdAt: "2024-01-16T10:15:00",
    updatedAt: "2024-01-16T10:15:00",
  },
  {
    id: 3,
    value: 200,
    remarks: "Cash payment",
    violationId: 203,
    violationType: "Missing ID",
    studentId: 2020123,
    studentName: "Jose Reyes",
    createdAt: "2024-01-17T09:45:00",
    updatedAt: "2024-01-17T09:45:00",
  },
  {
    id: 4,
    value: 50,
    remarks: "Trip Lang",
    violationId: 204,
    violationType: "Late Submission",
    studentId: 2019087,
    studentName: "Ana Lim",
    createdAt: "2024-01-18T13:20:00",
    updatedAt: "2024-01-18T13:20:00",
  },
  {
    id: 5,
    value: 100,
    remarks: "Paid via GCash",
    violationId: 205,
    violationType: "Late Attendance",
    studentId: 2021002,
    studentName: "Pedro Garcia",
    createdAt: "2024-01-19T08:00:00",
    updatedAt: "2024-01-19T08:00:00",
  },
  {
    id: 6,
    value: 175,
    remarks: "First offense",
    violationId: 206,
    violationType: "Improper Uniform",
    studentId: 2021078,
    studentName: "Sofia Reyes",
    createdAt: "2024-01-20T11:30:00",
    updatedAt: "2024-01-20T11:30:00",
  },
  {
    id: 7,
    value: 300,
    remarks: "Repeat violation",
    violationId: 207,
    violationType: "Absent Without Leave",
    studentId: 2020056,
    studentName: "Miguel Torres",
    createdAt: "2024-01-21T15:45:00",
    updatedAt: "2024-01-21T15:45:00",
  },
];

const dataSource = computed(() =>
  props.payments && props.payments.length ? props.payments : sample
);

const filtered = computed(() => {
  const qq = q.value.trim().toLowerCase();
  return dataSource.value.filter((p) => {
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
</script>

<style scoped>
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

/* Pay Button Section */
.pay-button-section {
  padding: 1rem;
  border-bottom: 1px solid var(--border);
  background: var(--surface);
  display: flex;
  justify-content: center;
}

/* Desktop Table */
.desktop-table {
  display: none;
  overflow-x: auto;
}

@media (min-width: 768px) {
  .desktop-table {
    display: block;
  }
}

/* Card */
.card-header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* Small Mobile Optimizations */
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