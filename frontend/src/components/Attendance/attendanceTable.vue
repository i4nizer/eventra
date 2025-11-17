<template>
  <div class="table-wrapper">
    <!-- Header -->
    <div class="table-header">
      <div class="header-top">
        <div class="relative search-wrapper">
          <input
            v-model="q"
            type="search"
            placeholder="Search by student name or activity..."
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
            <th class="p-3 cursor-pointer" @click="sortBy('studentId')">
              Student ID
              <SortIcon :field="'studentId'" :sort="sort" />
            </th>
            <th class="p-3 cursor-pointer" @click="sortBy('activityName')">
              Activity
              <SortIcon :field="'activityName'" :sort="sort" />
            </th>
            <th class="p-3 cursor-pointer" @click="sortBy('createdAt')">
              Date Logged
              <SortIcon :field="'createdAt'" :sort="sort" />
            </th>
            <th class="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(a, idx) in paged"
            :key="a.id || idx"
            class="table-row"
          >
            <td class="p-3 align-middle row-number">
              {{ startIndex + idx + 1 }}
            </td>
            <td class="p-3 align-middle">
              <div class="student-name">{{ a.studentName }}</div>
            </td>
            <td class="p-3 align-middle section-text">
              <span class="badge badge-id">
                {{ a.studentId }}
              </span>
            </td>
            <td class="p-3 align-middle activity-text">
              {{ a.activityName }}
            </td>
            <td class="p-3 align-middle">
              <span class="badge badge-date">
                {{ formatDate(a.createdAt) }}
              </span>
            </td>

            <td class="p-3 align-middle">
              <div class="flex items-center gap-2">
                <button
                  @click="handleView(a)"
                  class="action-btn btn-view"
                  title="View"
                >
                  <i class="fa-solid fa-eye"></i>
                </button>
                <button
                  @click="handleDelete(a)"
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
              No attendance records found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Cards -->
    <div class="mobile-cards">
      <div
        v-for="(a, idx) in paged"
        :key="a.id || idx"
        class="attendance-card"
      >
        <div class="card-header">
          <div class="card-number">{{ startIndex + idx + 1 }}</div>
          <div class="card-actions">
            <button
              @click="handleView(a)"
              class="action-btn btn-view"
              title="View"
            >
              <i class="fa-solid fa-eye"></i>
            </button>
            <button
              @click="handleDelete(a)"
              class="action-btn btn-delete"
              title="Delete"
            >
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>

        <div class="card-content">
          <div class="card-row">
            <div class="card-label">Student Name</div>
            <div class="card-value student-name">{{ a.studentName }}</div>
          </div>

          <div class="card-row">
            <div class="card-label">Student ID</div>
            <div class="card-value">
              <span class="badgebadge-id">{{ a.studentId }}</span>
            </div>
          </div>

          <div class="card-row">
            <div class="card-label">Activity</div>
            <div class="card-value activity-text">{{ a.activityName }}</div>
          </div>

          <div class="card-row">
            <div class="card-label">Date Logged</div>
            <div class="card-value">
              <span class="badgebadge-date">{{ formatDate(a.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="paged.length === 0" class="empty-state-mobile">
        No attendance records found.
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

    <!-- Read Attendance Modal -->
    <ReadAttendance
      :open="isModalOpen"
      :onClose="closeModal"
      :attendance="selectedAttendance"
    />

    <!-- Delete Attendance Modal -->
    <DeleteAttendance
      :open="isDeleteModalOpen"
      :onClose="closeDeleteModal"
      :onConfirm="confirmDelete"
      :attendance="selectedAttendanceForDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import ReadAttendance from "@/components/CRUD/readAttendance.vue";
import DeleteAttendance from "@/components/CRUD/deleteAttendance.vue";

const SortIcon = {
  props: ["field", "sort"],
  template: `<span class="inline-block ml-2 text-xs sort-icon">
    <i v-if="sort.field===field && sort.dir==='asc'" class="fa-solid fa-caret-up"></i>
    <i v-else-if="sort.field===field && sort.dir==='desc'" class="fa-solid fa-caret-down"></i>
    <i v-else class="fa-solid fa-sort opacity-30"></i>
  </span>`,
};

const props = defineProps({
  attendance: { type: Array, default: () => null },
  defaultPerPage: { type: Number, default: 10 },
});

const emit = defineEmits(["delete", "view", "refresh"]);

const q = ref("");
const page = ref(1);
const perPage = ref(props.defaultPerPage);
const sort = ref({ field: "createdAt", dir: "desc" });

// Modal state
const isModalOpen = ref(false);
const selectedAttendance = ref(null);

// Delete modal state
const isDeleteModalOpen = ref(false);
const selectedAttendanceForDelete = ref(null);

function sortBy(field) {
  if (sort.value.field === field) {
    sort.value.dir = sort.value.dir === "asc" ? "desc" : "asc";
  } else {
    sort.value.field = field;
    sort.value.dir = field === "createdAt" ? "desc" : "asc";
  }
}

function handleView(attendance) {
  // Map the attendance data to match the modal's expected format
  selectedAttendance.value = {
    name: attendance.studentName,
    tag: attendance.studentId,
    activity: attendance.activityName,
    date: formatDate(attendance.createdAt),
  };
  isModalOpen.value = true;
  emit('view', attendance);
}

function closeModal() {
  isModalOpen.value = false;
  selectedAttendance.value = null;
}

function handleDelete(attendance) {
  // Map the attendance data to match the modal's expected format
  selectedAttendanceForDelete.value = {
    name: attendance.studentName,
    tag: attendance.studentId,
    activity: attendance.activityName,
    date: formatDate(attendance.createdAt),
    originalData: attendance, // Keep original data for the emit
  };
  isDeleteModalOpen.value = true;
}

function closeDeleteModal() {
  isDeleteModalOpen.value = false;
  selectedAttendanceForDelete.value = null;
}

function confirmDelete() {
  // Emit the delete event with the original attendance data
  emit('delete', selectedAttendanceForDelete.value.originalData);
  closeDeleteModal();
}

const sample = [
  {
    id: 1,
    studentId: 2021001,
    studentName: "Juan Dela Cruz",
    activityEntryId: 101,
    activityName: "Orientation - BSIT 1A",
    createdAt: "2024-01-15T08:30:00",
    updatedAt: "2024-01-15T08:30:00",
  },
  {
    id: 2,
    studentId: 2021045,
    studentName: "Maria Santos",
    activityEntryId: 102,
    activityName: "Tech Fair - BSCS 2B",
    createdAt: "2024-01-16T13:15:00",
    updatedAt: "2024-01-16T13:15:00",
  },
  {
    id: 3,
    studentId: 2020123,
    studentName: "Jose Reyes",
    activityEntryId: 103,
    activityName: "Hackathon - BSIT 3C",
    createdAt: "2024-01-17T09:00:00",
    updatedAt: "2024-01-17T09:00:00",
  },
  {
    id: 4,
    studentId: 2019087,
    studentName: "Ana Lim",
    activityEntryId: 104,
    activityName: "General Assembly - BSIT 4A",
    createdAt: "2024-01-18T10:30:00",
    updatedAt: "2024-01-18T10:30:00",
  },
  {
    id: 5,
    studentId: 2021002,
    studentName: "Pedro Garcia",
    activityEntryId: 101,
    activityName: "Orientation - BSIT 1A",
    createdAt: "2024-01-15T08:35:00",
    updatedAt: "2024-01-15T08:35:00",
  },
  {
    id: 6,
    studentId: 2021078,
    studentName: "Sofia Reyes",
    activityEntryId: 102,
    activityName: "Tech Fair - BSCS 2B",
    createdAt: "2024-01-16T13:20:00",
    updatedAt: "2024-01-16T13:20:00",
  },
  {
    id: 7,
    studentId: 2020056,
    studentName: "Miguel Torres",
    activityEntryId: 103,
    activityName: "Hackathon - BSIT 3C",
    createdAt: "2024-01-17T09:05:00",
    updatedAt: "2024-01-17T09:05:00",
  },
];

const dataSource = computed(() =>
  props.attendance && props.attendance.length ? props.attendance : sample
);

const filtered = computed(() => {
  const qq = q.value.trim().toLowerCase();
  return dataSource.value.filter((a) => {
    if (!qq) return true;
    return (
      (a.studentName || "").toLowerCase().includes(qq) ||
      (a.activityName || "").toLowerCase().includes(qq) ||
      (a.studentId || "").toString().toLowerCase().includes(qq)
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

  .attendance-card {
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