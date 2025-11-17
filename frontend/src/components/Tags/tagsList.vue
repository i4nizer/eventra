<template>
  <div class="table-wrapper">
    <!-- Header -->
    <div class="table-header">
      <div class="header-top">
        <div class="relative search-wrapper">
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Search Tag ID..."
            class="search-input"
          />
          <i
            class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 search-icon"
          ></i>
        </div>

        <button @click="showCreateModal = true" class="btn-add">
          <span class="add-icon">+</span>
          <span class="btn-text">Add</span>
        </button>
      </div>

      <div class="header-bottom">
        <select v-model="perPage" class="select-input">
          <option v-for="n in [5, 10, 20, 50]" :key="n" :value="n">
            {{ n }} / page
          </option>
        </select>

        <button @click="refreshTags" class="btn-refresh">
          <i class="fa-solid fa-arrows-rotate"></i>
          <span class="btn-text">Refresh</span>
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm">
        <thead class="table-head">
          <tr>
            <th class="p-3 cursor-pointer" @click="headerSort('id')">
              Tag ID
              <SortIcon :field="'id'" :sort="sort" />
            </th>
            <th class="p-3 cursor-pointer" @click="headerSort('status')">
              Status
              <SortIcon :field="'status'" :sort="sort" />
            </th>
            <th
              class="p-3 cursor-pointer"
              @click="headerSort('assignedStudent')"
            >
              Assigned Student
              <SortIcon :field="'assignedStudent'" :sort="sort" />
            </th>
            <th class="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tag in paginatedTags" :key="tag.id" class="table-row">
            <td class="p-3 align-middle tag-id">{{ tag.id }}</td>
            <td class="p-3 align-middle">
              <span :class="getStatusClass(tag.status)">
                {{ tag.status }}
              </span>
            </td>
            <td class="p-3 align-middle assigned-student">
              <span v-if="tag.status === 'Equipped' && tag.assignedStudent">
                {{ tag.assignedStudent }}
              </span>
              <span v-else class="unassigned">—</span>
            </td>
            <td class="p-3 align-middle text-center">
              <div class="flex justify-center gap-2">
                <button
                  v-if="tag.status === 'Not Equipped'"
                  @click="assignTag(tag)"
                  class="action-btn btn-assign"
                >
                  Assign
                </button>
                <button
                  v-else
                  @click="unassignTag(tag)"
                  class="action-btn btn-unassign"
                >
                  Unassign
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="paginatedTags.length === 0">
            <td colspan="4" class="p-6 text-center empty-state">
              No tags found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="tags-footer">
      <div class="pagination-info">
        Showing {{ paginatedTags.length }} of {{ filtered.length }} (Page
        {{ page }} / {{ totalPages }})
      </div>
      <div class="flex items-center gap-2">
        <button class="pagination-btn" :disabled="page === 1" @click="page--">
          Prev
        </button>
        <div class="pagination-current">{{ page }}</div>
        <button
          class="pagination-btn"
          :disabled="page >= totalPages"
          @click="page++"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Create Tag Modal Component -->
    <CreateTagModal
      :show="showCreateModal"
      :students="studentList"
      @close="showCreateModal = false"
      @save="addTagFromModal"
    />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import CreateTagModal from "@/components/CRUD/createTags.vue";

/* Inline Sort Icon */
const SortIcon = {
  props: ["field", "sort"],
  template: `<span class="inline-block ml-1 text-xs sort-icon">
    <i v-if="sort.field===field && sort.dir==='asc'" class="fa-solid fa-arrow-up"></i>
    <i v-else-if="sort.field===field && sort.dir==='desc'" class="fa-solid fa-arrow-down"></i>
  </span>`,
};

const searchQuery = ref("");
const sort = ref({ field: "id", dir: "asc" });
const page = ref(1);
const perPage = ref(10);
const showCreateModal = ref(false);

const tags = ref([
  { id: "TAG-001", status: "Equipped", assignedStudent: "John Doe" },
  { id: "TAG-002", status: "Not Equipped", assignedStudent: "" },
  { id: "TAG-003", status: "Equipped", assignedStudent: "Jane Smith" },
]);

const studentList = ref([
  "John Doe",
  "Jane Smith",
  "Chris Evans",
  "Anna Lopez",
]);

function addTagFromModal(tag) {
  tags.value.push({
    id: tag.tagId,
    status: tag.status,
    assignedStudent: tag.assignedStudent || "",
  });
  showCreateModal.value = false;
}

function assignTag(tag) {
  tag.status = "Equipped";
  tag.assignedStudent = prompt("Enter student name:") || "Unknown";
}

function unassignTag(tag) {
  tag.status = "Not Equipped";
  tag.assignedStudent = "";
}

function refreshTags() {
  alert("Tag list refreshed!");
}

/* Filtering, sorting, and pagination */
const filtered = computed(() =>
  tags.value.filter(
    (t) =>
      t.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      t.assignedStudent.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

const sortedTags = computed(() => {
  const arr = [...filtered.value];
  const key = sort.value.field;
  const dir = sort.value.dir === "asc" ? 1 : -1;
  arr.sort((a, b) => {
    const va = (a[key] || "").toString().toLowerCase();
    const vb = (b[key] || "").toString().toLowerCase();
    if (va < vb) return -1 * dir;
    if (va > vb) return 1 * dir;
    return 0;
  });
  return arr;
});

const totalPages = computed(() =>
  Math.ceil(sortedTags.value.length / perPage.value)
);

const paginatedTags = computed(() => {
  const start = (page.value - 1) * perPage.value;
  return sortedTags.value.slice(start, start + perPage.value);
});

function headerSort(field) {
  if (sort.value.field === field) {
    sort.value.dir = sort.value.dir === "asc" ? "desc" : "asc";
  } else {
    sort.value.field = field;
    sort.value.dir = "asc";
  }
}

function getStatusClass(status) {
  return status === "Equipped"
    ? "status-badge equipped"
    : "status-badge not-equipped";
}
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

/* Select Input */
.select-input {
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text);
  outline: none;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.select-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

/* Table */
table {
  border-spacing: 0;
}

.table-head {
  background: var(--surface);
  color: var(--text);
  font-weight: 600;
  border-bottom: 1px solid var(--border);
}

.table-row {
  border-bottom: 1px solid var(--border);
  transition: background 0.15s;
}

.table-row:hover {
  background: var(--surface);
}

.tag-id {
  font-weight: 500;
  color: var(--text);
}

/* Status Badges */
.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.status-badge.equipped {
  background: rgba(16, 185, 129, 0.15);
  color: var(--accent);
}

.status-badge.not-equipped {
  background: var(--surface);
  color: var(--muted);
  border: 1px solid var(--border);
}

.assigned-student {
  color: var(--text);
}

.unassigned {
  color: var(--muted);
}

/* Action Buttons */
.action-btn {
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid;
  transition: all 0.15s;
}

.btn-assign {
  color: var(--accent);
  border-color: var(--accent);
  background: transparent;
}

.btn-assign:hover {
  background: rgba(16, 185, 129, 0.1);
}

.btn-unassign {
  color: #ef4444;
  border-color: #ef4444;
  background: transparent;
}

.btn-unassign:hover {
  background: rgba(239, 68, 68, 0.1);
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
.tags-footer {
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
  .tags-footer {
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

  .tags-footer {
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