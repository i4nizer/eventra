<template>
  <div class="table-wrapper">
    <!-- Header -->
    <div class="table-header">
      <div class="header-top">
        <div class="relative search-wrapper">
          <input
            v-model="q"
            type="search"
            placeholder="Search by name, TAG or section..."
            class="search-input"
          />
          <i
            class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 search-icon"
          ></i>
        </div>

        <button @click="openCreateModal" class="btn-add">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="btn-text">Add</span>
        </button>
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

    <!-- Desktop Table -->
    <div class="desktop-table">
      <table class="w-full text-left text-sm">
        <thead class="table-head">
          <tr>
            <th class="p-3">#</th>
            <th class="p-3 cursor-pointer" @click="sortBy('name')">
              Name
              <SortIcon :field="'name'" :sort="sort" />
            </th>
            <th class="p-3 cursor-pointer" @click="sortBy('section')">
              Section
              <SortIcon :field="'section'" :sort="sort" />
            </th>
            <th class="p-3">RFID Tags</th>
            <th class="p-3 cursor-pointer" @click="sortBy('balance')">
              Balance
              <SortIcon :field="'balance'" :sort="sort" />
            </th>
            <th class="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(s, idx) in paged"
            :key="s.id || s.tag || idx"
            class="table-row"
          >
            <td class="p-3 align-middle row-number">
              {{ startIndex + idx + 1 }}
            </td>
            <td class="p-3 align-middle">
              <div class="student-name">{{ s.name }}</div>
              <div class="student-email">{{ s.email }}</div>
            </td>
            <td class="p-3 align-middle section-text">{{ s.section }}</td>
            <td class="p-3 align-middle">
              <span class="badge-tag">
                {{ s.tag }}
              </span>
            </td>
            <td class="p-3 align-middle">
              <span class="badge-balance"> ₱ {{ s.balance }} </span>
            </td>
            <td class="p-3 align-middle">
              <div class="flex items-center gap-2">
                <button
                  @click="openEditModal(s)"
                  class="action-btn btn-edit"
                  title="Edit"
                >
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button
                  @click="openViewModal(s)"
                  class="action-btn btn-view"
                  title="View"
                >
                  <i class="fa-solid fa-eye"></i>
                </button>
                <button
                  @click="openDeleteModal(s)"
                  class="action-btn btn-delete"
                  title="Delete"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="paged.length === 0">
            <td class="p-6 text-center text-sm empty-state" :colspan="6">
              No students found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Cards -->
    <div class="mobile-cards">
      <div
        v-for="(s, idx) in paged"
        :key="s.id || s.tag || idx"
        class="student-card"
      >
        <div class="card-header">
          <div class="card-number">{{ startIndex + idx + 1 }}</div>
          <div class="card-actions">
            <button
              @click="openEditModal(s)"
              class="action-btn btn-edit"
              title="Edit"
            >
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button
              @click="openViewModal(s)"
              class="action-btn btn-view"
              title="View"
            >
              <i class="fa-solid fa-eye"></i>
            </button>
            <button
              @click="openDeleteModal(s)"
              class="action-btn btn-delete"
              title="Delete"
            >
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>

        <div class="card-content">
          <div class="card-row">
            <div class="card-label">Name</div>
            <div class="card-value">
              <div class="student-name">{{ s.name }}</div>
              <div class="student-email">{{ s.email }}</div>
            </div>
          </div>

          <div class="card-row">
            <div class="card-label">Section</div>
            <div class="card-value section-text">{{ s.section }}</div>
          </div>

          <div class="card-row">
            <div class="card-label">RFID Tag</div>
            <div class="card-value">
              <span class="badge-tag">{{ s.tag }}</span>
            </div>
          </div>

          <div class="card-row">
            <div class="card-label">Balance</div>
            <div class="card-value">
              <span class="badge-balance">₱ {{ s.balance }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="paged.length === 0" class="empty-state-mobile">
        No students found.
      </div>
    </div>

    <!-- Pagination -->
    <div class="table-footer">
      <div class="pagination-info">
        Showing {{ startIndex + 1 }} - {{ startIndex + paged.length }} of
        {{ filtered.length }}
      </div>

      <div class="flex items-center gap-2">
        <button class="pagination-btn" :disabled="page === 1" @click="page--">
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

    <!-- Create Student Modal -->
    <createStudent
      :open="isCreateModalOpen"
      :onClose="closeCreateModal"
      :onCreate="handleCreateStudent"
      :sections="sections"
    />
  </div>

  <!-- Edit Student Modal -->
  <editStudent
    :open="isEditModalOpen"
    :student="selectedStudent"
    :onClose="closeEditModal"
    :onUpdate="handleUpdateStudent"
    :sections="sections"
    :availableTags="availableTags"
  />

  <!-- View Student Modal -->
  <viewStudent
    :open="isViewModalOpen"
    :student="selectedStudent"
    :onClose="closeViewModal"
  />

  <!-- Delete Confirmation Modal -->
  <confirmDelete
    :open="isDeleteModalOpen"
    :student="selectedStudent"
    :onClose="closeDeleteModal"
    :onConfirm="handleConfirmDelete"
  />
</template>

<script setup>
import { ref, computed, watch } from "vue";
import createStudent from "@/components/CRUD/createStudent.vue";
import editStudent from "@/components/CRUD/updateStudent.vue";
import viewStudent from "@/components/CRUD/readStudent.vue";
import confirmDelete from "@/components/CRUD/deleteStudent.vue";

const SortIcon = {
  props: ["field", "sort"],
  template: `<span class="inline-block ml-2 text-xs sort-icon">
    <i v-if="sort.field===field && sort.dir==='asc'" class="fa-solid fa-arrow-up"></i>
    <i v-else-if="sort.field===field && sort.dir==='desc'" class="fa-solid fa-arrow-down"></i>
  </span>`,
};

const props = defineProps({
  students: { type: Array, default: () => null },
  defaultPerPage: { type: Number, default: 10 },
  sections: { type: Array, default: () => [] },
});

const emit = defineEmits(["edit", "delete", "view", "refresh"]);

const q = ref("");
const page = ref(1);
const perPage = ref(props.defaultPerPage);
const sort = ref({ field: "name", dir: "asc" });

// Modals
const isCreateModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isViewModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const selectedStudent = ref(null);

// RFID Tags (for dropdown)
const availableTags = ref([
  "TAG-001",
  "TAG-002",
  "TAG-003",
  "TAG-004",
  "TAG-005",
  "TAG-006",
]);

// =======================
// Modal Functions
// =======================
function openCreateModal() {
  isCreateModalOpen.value = true;
}
function closeCreateModal() {
  isCreateModalOpen.value = false;
}

async function handleCreateStudent(studentData) {
  console.log("Creating student:", studentData);
  emit("refresh");
  closeCreateModal();
}

// ---- Edit ----
function openEditModal(student) {
  selectedStudent.value = student;
  isEditModalOpen.value = true;
}
function closeEditModal() {
  isEditModalOpen.value = false;
  selectedStudent.value = null;
}
function handleUpdateStudent(updatedStudent) {
  console.log("Updating student:", updatedStudent);
  emit("refresh");
  closeEditModal();
}

// ---- View ----
function openViewModal(student) {
  selectedStudent.value = student;
  isViewModalOpen.value = true;
}
function closeViewModal() {
  isViewModalOpen.value = false;
  selectedStudent.value = null;
}

// ---- Delete ----
function openDeleteModal(student) {
  selectedStudent.value = student;
  isDeleteModalOpen.value = true;
}
function closeDeleteModal() {
  isDeleteModalOpen.value = false;
  selectedStudent.value = null;
}
function handleConfirmDelete() {
  console.log("Deleting student:", selectedStudent.value);
  emit("refresh");
  closeDeleteModal();
}

function sortBy(field) {
  if (sort.value.field === field) {
    sort.value.dir = sort.value.dir === "asc" ? "desc" : "asc";
  } else {
    sort.value.field = field;
    sort.value.dir = "asc";
  }
}

const sample = [
  {
    id: 1,
    name: "Alice Cruz",
    email: "alice@example.com",
    section: "A1",
    tag: "TAG-001",
    balance: "40.00",
  },
  {
    id: 2,
    name: "Ben Torres",
    email: "ben@example.com",
    section: "B2",
    tag: "TAG-002",
    balance: "50.00",
  },
  {
    id: 3,
    name: "Clara Reyes",
    email: "clara@example.com",
    section: "A1",
    tag: "TAG-003",
    balance: "30.00",
  },
  {
    id: 4,
    name: "David Li",
    email: "david@example.com",
    section: "C1",
    tag: "TAG-004",
    balance: "100.00",
  },
  {
    id: 5,
    name: "Ella Gomez",
    email: "ella@example.com",
    section: "B2",
    tag: "TAG-005",
    balance: "60.00",
  },
  {
    id: 6,
    name: "Frank Yu",
    email: "frank@example.com",
    section: "A2",
    tag: "TAG-006",
    balance: "80.00",
  },
];

// =======================
// Computed Properties
// =======================
const dataSource = computed(() =>
  props.students && props.students.length ? props.students : sample
);

const filtered = computed(() => {
  const qq = q.value.trim().toLowerCase();
  return dataSource.value.filter((s) => {
    if (!qq) return true;
    return (
      (s.name || "").toLowerCase().includes(qq) ||
      (s.tag || "").toLowerCase().includes(qq) ||
      (s.section || "").toLowerCase().includes(qq) ||
      (s.email || "").toLowerCase().includes(qq)
    );
  });
});

const sorted = computed(() => {
  const arr = [...filtered.value];
  const f = sort.value.field;
  const dir = sort.value.dir === "asc" ? 1 : -1;
  arr.sort((a, b) => {
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

// Reset to page 1 when filters change
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
.section-text {
  color: var(--text);
}

.student-name {
  font-weight: 500;
  color: var(--text);
}

.student-email {
  font-size: 0.75rem;
  color: var(--muted);
}

/* Badges */
.badge-tag {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  background: var(--surface);
  color: var(--accent);
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid var(--border);
}

.badge-balance {
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
  font-size: 0.875rem;
}

.btn-edit {
  color: var(--accent);
}

.btn-edit:hover {
  background: var(--surface);
  border-color: var(--accent);
}

.btn-view {
  color: var(--muted);
}

.btn-view:hover {
  background: var(--surface);
  color: var(--text);
}

.btn-delete {
  color: #ef4444;
}

.btn-delete:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: #ef4444;
}

/* Mobile Cards */
.mobile-cards {
  display: block;
}

@media (min-width: 768px) {
  .mobile-cards {
    display: none;
  }
}

.student-card {
  padding: 1rem;
  border-bottom: 1px solid var(--border);
  background: var(--bg);
  transition: background 0.15s;
}

.student-card:hover {
  background: var(--surface);
}

.student-card:last-child {
  border-bottom: none;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border);
}

.card-number {
  font-weight: 600;
  color: var(--text);
  font-size: 1rem;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.card-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.card-label {
  font-size: 0.75rem;
  color: var(--muted);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  flex-shrink: 0;
  min-width: 70px;
}

.card-value {
  text-align: right;
  flex: 1;
}

/* Empty State */
.empty-state {
  color: var(--muted);
}

.empty-state-mobile {
  padding: 2rem 1rem;
  text-align: center;
  color: var(--muted);
  font-size: 0.875rem;
}

/* Sort Icon */
.sort-icon {
  color: var(--accent);
}

/* Footer */
.table-footer {
  padding: 0.75rem 1rem;
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: var(--surface);
}

@media (min-width: 640px) {
  .table-footer {
    flex-direction: row;
    justify-content: space-between;
  }
}

.pagination-info {
  font-size: 0.75rem;
  color: var(--muted);
}

@media (min-width: 640px) {
  .pagination-info {
    font-size: 0.875rem;
  }
}

.pagination-btn {
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text);
  transition: all 0.15s;
  font-weight: 500;
  font-size: 0.875rem;
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
  font-size: 0.875rem;
}

/* Dark mode specific adjustments */
:global(.dark) .table-wrapper {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* Small Mobile Optimizations */
@media (max-width: 480px) {
  .table-header {
    padding: 0.75rem;
  }

  .search-input {
    font-size: 0.8125rem;
  }

  .btn-add,
  .btn-refresh,
  .select-input {
    font-size: 0.8125rem;
    padding: 0.4rem 0.6rem;
  }

  .student-card {
    padding: 0.875rem;
  }

  .card-header {
    margin-bottom: 0.625rem;
    padding-bottom: 0.625rem;
  }

  .card-number {
    font-size: 0.9375rem;
  }

  .card-row {
    gap: 0.75rem;
  }

  .card-label {
    font-size: 0.6875rem;
    min-width: 60px;
  }

  .student-name {
    font-size: 0.875rem;
  }

  .student-email {
    font-size: 0.6875rem;
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