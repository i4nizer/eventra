<template>
  <div class="payment-table-wrapper">
    <!-- Header -->
    <div class="table-header">
      <div class="flex items-center gap-3">
        <div class="relative">
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

        <select v-model="perPage" class="select-input">
          <option v-for="n in [5, 10, 20, 50]" :key="n" :value="n">
            {{ n }} / page
          </option>
        </select>
      </div>

      <div class="flex items-center gap-2">
        <button @click="$emit('refresh')" class="btn-refresh">
          <i class="fa-solid fa-arrows-rotate mr-2"></i> Refresh
        </button>
        <slot name="controls"></slot>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
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
              <span class="badge-violation">
                {{ p.violationType }}
              </span>
            </td>
            <td class="p-3 align-middle">
              <span class="badge-amount">
                ₱{{ p.value.toLocaleString() }}
              </span>
            </td>
            <td class="p-3 align-middle remarks-text">
              {{ p.remarks || '-' }}
            </td>
            <td class="p-3 align-middle">
              <span class="badge-date">
                {{ formatDate(p.createdAt) }}
              </span>
            </td>

            <td class="p-3 align-middle">
              <div class="flex items-center gap-2">
                <button
                  @click="$emit('view', p)"
                  class="action-btn btn-view"
                  title="View Receipt"
                >
                  <i class="fa-solid fa-receipt"></i>
                </button>
                <button
                  @click="$emit('delete', p)"
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
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

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

const emit = defineEmits(["delete", "view", "refresh"]);

const q = ref("");
const page = ref(1);
const perPage = ref(props.defaultPerPage);
const sort = ref({ field: "createdAt", dir: "desc" });

function sortBy(field) {
  if (sort.value.field === field) {
    sort.value.dir = sort.value.dir === "asc" ? "desc" : "asc";
  } else {
    sort.value.field = field;
    sort.value.dir = field === "createdAt" ? "desc" : "asc";
  }
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
/* Container */
.payment-table-wrapper {
  background: var(--bg);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid var(--border);
}

/* Header */
.table-header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  border-bottom: 1px solid var(--border);
  background: var(--surface);
}

@media (min-width: 768px) {
  .table-header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

/* Search Input */
.search-input {
  padding-left: 2.5rem;
  padding-right: 0.75rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text);
  outline: none;
  transition: all 0.2s;
}

.search-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.search-icon {
  color: var(--accent);
}

/* Select Input */
.select-input {
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text);
  outline: none;
  transition: all 0.2s;
}

.select-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

/* Buttons */
.btn-refresh {
  padding: 0.5rem 0.75rem;
  background: var(--surface);
  color: var(--accent);
  border-radius: 0.375rem;
  border: 1px solid var(--border);
  transition: all 0.2s;
  font-weight: 500;
}

.btn-refresh:hover {
  background: var(--surface2);
  border-color: var(--accent);
}

/* Table */
.table-head {
  background: var(--surface);
  color: var(--text);
  font-weight: 600;
}

.table-row {
  border-bottom: 1px solid var(--border);
  transition: background 0.15s;
}

.table-row:hover {
  background: var(--surface);
}

.row-number,
.remarks-text {
  color: var(--text);
}

.student-name {
  font-weight: 500;
  color: var(--text);
}

.student-id {
  font-size: 0.75rem;
  color: var(--muted);
}

/* Badges */
.badge-violation {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.badge-amount {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  background: rgba(16, 185, 129, 0.1);
  color: var(--accent);
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.badge-date {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  background: var(--surface);
  color: var(--text);
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid var(--border);
}

/* Action Buttons */
.action-btn {
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.15s;
  border: 1px solid transparent;
}

.btn-view {
  color: var(--accent);
}

.btn-view:hover {
  background: rgba(16, 185, 129, 0.1);
  border-color: var(--accent);
}

.btn-delete {
  color: #ef4444;
}

.btn-delete:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: #ef4444;
}

/* Empty State */
.empty-state {
  color: var(--muted);
}

/* Sort Icon */
.sort-icon {
  color: var(--accent);
}

/* Footer */
.table-footer {
  padding: 0.75rem;
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--surface);
}

.pagination-info {
  font-size: 0.875rem;
  color: var(--muted);
}

.pagination-btn {
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text);
  transition: all 0.15s;
  font-weight: 500;
}

.pagination-btn:hover:not(:disabled) {
  background: var(--surface2);
  border-color: var(--accent);
  color: var(--accent);
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination-current {
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text);
  font-weight: 500;
}

/* Dark mode specific adjustments */
:global(.dark) .payment-table-wrapper {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}
</style>