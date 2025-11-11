<template>
  <div class="student-table-wrapper">
    <!-- Header -->
    <div class="table-header">
      <div class="flex items-center gap-3">
        <div class="relative">
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

        <button
          @click="openCreateModal"
          class="create-student-btn"
        >
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
          Add
        </button>
      </div>

      <div class="flex items-center gap-2">
        <select v-model="perPage" class="select-input">
          <option v-for="n in [5, 10, 20, 50]" :key="n" :value="n">
            {{ n }} / page
          </option>
        </select>

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
              <span class="badge-balance">
                ₱ {{ s.balance }}
              </span>
            </td>

            <td class="p-3 align-middle">
              <div class="flex items-center gap-2">
                <button
                  @click="$emit('edit', s)"
                  class="action-btn btn-edit"
                  title="Edit"
                >
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button
                  @click="$emit('view', s)"
                  class="action-btn btn-view"
                  title="View"
                >
                  <i class="fa-solid fa-eye"></i>
                </button>
                <button
                  @click="$emit('delete', s)"
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

    <!-- Create Student Modal -->
    <createStudent
      :open="isCreateModalOpen"
      :onClose="closeCreateModal"
      :onCreate="handleCreateStudent"
      :sections="sections"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import createStudent from "@/components/CRUD/createStudent.vue";

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

// State
const q = ref("");
const page = ref(1);
const perPage = ref(props.defaultPerPage);
const sort = ref({ field: "name", dir: "asc" });
const isCreateModalOpen = ref(false);

// Modal functions
function openCreateModal() {
  isCreateModalOpen.value = true;
}

function closeCreateModal() {
  isCreateModalOpen.value = false;
}

async function handleCreateStudent(studentData) {
  // Implement your student creation logic here
  console.log('Creating student:', studentData);
  
  // Example API call (uncomment and modify as needed):
  // try {
  //   await api.createStudent(studentData);
  //   emit('refresh');
  // } catch (error) {
  //   throw new Error('Failed to create student');
  // }
  
  // Emit refresh after creation
  emit('refresh');
}

// Sorting function
function sortBy(field) {
  if (sort.value.field === field) {
    sort.value.dir = sort.value.dir === "asc" ? "desc" : "asc";
  } else {
    sort.value.field = field;
    sort.value.dir = "asc";
  }
}

// Sample data
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
  {
    id: 7,
    name: "Grace Park",
    email: "grace@example.com",
    section: "C1",
    tag: "TAG-007",
    balance: "20.00",
  },
];

// Computed properties
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

// Watchers
watch([q, perPage], () => (page.value = 1));
</script>

<style scoped>
/* Container */
.student-table-wrapper {
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
.create-student-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: var(--accent);
  color: white;
  border-radius: 0.375rem;
  border: 1px solid var(--accent);
  transition: all 0.2s;
  font-weight: 500;
  cursor: pointer;
  font-size: 0.875rem;
}

.create-student-btn:hover {
  opacity: 0.9;
}

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
:global(.dark) .student-table-wrapper {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.dark .create-student-btn {
  color: var(--accent);
  background: var(--surface);
  border-color: var(--accent);
}

.dark .create-student-btn:hover {
  background: var(--surface2);
}
</style>