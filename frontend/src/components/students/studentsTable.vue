<template>
  <div class="p-4 max-w-7xl mx-auto">
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4"
    >
      <h2 class="text-2xl font-semibold">Students</h2>

      <div class="flex items-center gap-2">
        <div class="relative">
          <input
            v-model="filters.query"
            @input="goToPage(1)"
            placeholder="Search by name, email, course..."
            class="pl-10 pr-3 py-2 rounded-lg border shadow-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            aria-label="Search students"
          />
          <svg
            class="w-5 h-5 absolute left-3 top-2.5 text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-4.35-4.35"
            />
            <circle
              cx="11"
              cy="11"
              r="6"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>

        <select
          v-model.number="pageSize"
          class="py-2 px-3 rounded-lg border shadow-sm"
        >
          <option :value="5">5 / page</option>
          <option :value="10">10 / page</option>
          <option :value="20">20 / page</option>
        </select>

        <button
          @click="exportCSV(filteredData)"
          class="py-2 px-3 rounded-lg border bg-indigo-600 text-white shadow hover:opacity-95"
        >
          Export CSV
        </button>

        <div class="relative">
          <button
            @click="showColumns = !showColumns"
            class="py-2 px-3 rounded-lg border bg-white shadow"
          >
            Columns ▾
          </button>
          <div
            v-if="showColumns"
            class="absolute right-0 mt-2 w-48 bg-white border rounded shadow p-3 z-20"
          >
            <label
              v-for="col in columns"
              :key="col.key"
              class="flex items-center gap-2 mb-2"
            >
              <input type="checkbox" v-model="visible[col.key]" />
              <span class="text-sm">{{ col.label }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white border rounded-lg shadow overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left">
              <input
                type="checkbox"
                :checked="allSelected"
                @change="toggleSelectAll($event)"
                aria-label="Select all rows"
              />
            </th>

            <th
              v-for="col in visibleColumns"
              :key="col.key"
              class="px-4 py-3 text-left"
            >
              <button @click="sortBy(col.key)" class="flex items-center gap-2">
                <span>{{ col.label }}</span>
                <svg
                  v-if="sort.key === col.key"
                  class="w-3 h-3"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    v-if="sort.dir === 'asc'"
                    d="M6 15l6-6 6 6"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    v-else
                    d="M6 9l6 6 6-6"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </th>

            <th class="px-4 py-3">Actions</th>
          </tr>
        </thead>

        <tbody class="bg-white divide-y divide-gray-100">
          <tr
            v-for="student in pagedData"
            :key="student.id"
            class="hover:bg-gray-50"
          >
            <td class="px-4 py-3">
              <input
                type="checkbox"
                v-model="selectedIds"
                :value="student.id"
                aria-label="Select row"
              />
            </td>

            <td
              v-if="visible.firstName"
              class="px-4 py-3 flex items-center gap-3"
            >
              <div
                class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-sm font-medium"
              >
                {{ initials(student) }}
              </div>
              <div>
                <div class="font-medium">
                  {{ student.firstName }} {{ student.lastName }}
                </div>
                <div class="text-xs text-gray-500">{{ student.email }}</div>
              </div>
            </td>

            <td v-if="visible.course" class="px-4 py-3">
              {{ student.course }}
            </td>
            <td v-if="visible.year" class="px-4 py-3">{{ student.year }}</td>
            <td v-if="visible.gpa" class="px-4 py-3">
              {{ formatGPA(student.gpa) }}
            </td>
            <td v-if="visible.status" class="px-4 py-3">
              <span
                :class="statusClass(student.status)"
                class="px-2 py-1 rounded-full text-xs font-medium"
                >{{ student.status }}</span
              >
            </td>

            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <button
                  @click="$emit('edit', student)"
                  class="px-2 py-1 rounded border"
                >
                  Edit
                </button>
                <button
                  @click="$emit('delete', student)"
                  class="px-2 py-1 rounded border text-red-600"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="!pagedData.length">
            <td
              :colspan="visibleColumns.length + 2"
              class="p-6 text-center text-gray-500"
            >
              No students found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between mt-4">
      <div class="text-sm text-gray-600">
        Showing {{ startIndex }}-{{ endIndex }} of {{ filteredData.length }}
      </div>

      <div class="flex items-center gap-2">
        <button
          :disabled="page === 1"
          @click="goToPage(page - 1)"
          class="px-3 py-1 rounded border"
        >
          Prev
        </button>
        <button
          v-for="p in pageList"
          :key="p"
          @click="goToPage(p)"
          :class="[
            'px-3 py-1 rounded border',
            p === page ? 'bg-indigo-600 text-white' : 'bg-white',
          ]"
        >
          {{ p }}
        </button>
        <button
          :disabled="page === totalPages"
          @click="goToPage(page + 1)"
          class="px-3 py-1 rounded border"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Bulk actions -->
    <div class="mt-4 flex items-center gap-2">
      <button
        :disabled="!selectedIds.length"
        @click="exportCSV(selectedRows)"
        class="px-3 py-2 rounded border bg-green-600 text-white"
      >
        Export Selected
      </button>
      <button
        :disabled="!selectedIds.length"
        @click="clearSelection"
        class="px-3 py-2 rounded border"
      >
        Clear Selection
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch } from "vue";

// Sample data (replace with props or API fetch in real app)
const students = ref([
  {
    id: 1,
    firstName: "Aiden",
    lastName: "Reyes",
    email: "aiden.reyes@example.com",
    course: "BSCS",
    year: "3",
    gpa: 3.6,
    status: "Active",
  },
  {
    id: 2,
    firstName: "Maya",
    lastName: "Lopez",
    email: "maya.lopez@example.com",
    course: "BSEd",
    year: "4",
    gpa: 3.9,
    status: "Active",
  },
  {
    id: 3,
    firstName: "Noah",
    lastName: "Santos",
    email: "noah.santos@example.com",
    course: "BSIT",
    year: "2",
    gpa: 2.8,
    status: "Probation",
  },
  {
    id: 4,
    firstName: "Luna",
    lastName: "Garcia",
    email: "luna.garcia@example.com",
    course: "BSBA",
    year: "1",
    gpa: 3.1,
    status: "Active",
  },
  {
    id: 5,
    firstName: "Ethan",
    lastName: "Cruz",
    email: "ethan.cruz@example.com",
    course: "BSCS",
    year: "4",
    gpa: 3.4,
    status: "Graduated",
  },
  // add more sample rows as needed
]);

// Columns definition
const columns = [
  { key: "firstName", label: "Student" },
  { key: "course", label: "Course" },
  { key: "year", label: "Year" },
  { key: "gpa", label: "GPA" },
  { key: "status", label: "Status" },
];

const visible = reactive({
  firstName: true,
  course: true,
  year: true,
  gpa: true,
  status: true,
});
const showColumns = ref(false);
const page = ref(1);
const pageSize = ref(10);
const sort = reactive({ key: "lastName", dir: "asc" });
const filters = reactive({ query: "" });
const selectedIds = ref([]);

const allSelected = computed(
  () => filteredData.length && selectedIds.value.length === filteredData.length
);

const visibleColumns = computed(() => columns.filter((c) => visible[c.key]));

function initials(s) {
  return ((s.firstName?.[0] || "") + (s.lastName?.[0] || "")).toUpperCase();
}

function formatGPA(g) {
  return typeof g === "number" ? g.toFixed(2) : g;
}

function statusClass(status) {
  if (status === "Active") return "bg-green-100 text-green-800";
  if (status === "Probation") return "bg-yellow-100 text-yellow-800";
  if (status === "Graduated") return "bg-blue-100 text-blue-800";
  return "bg-gray-100 text-gray-800";
}

function sortBy(key) {
  if (sort.key === key) sort.dir = sort.dir === "asc" ? "desc" : "asc";
  else {
    sort.key = key;
    sort.dir = "asc";
  }
}

const filteredData = computed(() => {
  const q = filters.query.trim().toLowerCase();
  let arr = students.value.slice();
  if (q) {
    arr = arr.filter((s) =>
      [s.firstName, s.lastName, s.email, s.course, String(s.year)]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }

  arr.sort((a, b) => {
    const aV = (a[sort.key] ?? "").toString().toLowerCase();
    const bV = (b[sort.key] ?? "").toString().toLowerCase();
    if (aV < bV) return sort.dir === "asc" ? -1 : 1;
    if (aV > bV) return sort.dir === "asc" ? 1 : -1;
    return 0;
  });

  return arr;
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredData.value.length / pageSize.value))
);

watch([pageSize, filteredData], () => {
  if (page.value > totalPages.value) page.value = totalPages.value;
});

const startIndex = computed(() =>
  filteredData.value.length === 0 ? 0 : (page.value - 1) * pageSize.value + 1
);
const endIndex = computed(() =>
  Math.min(filteredData.value.length, page.value * pageSize.value)
);

const pagedData = computed(() => {
  const start = (page.value - 1) * pageSize.value;
  return filteredData.value.slice(start, start + pageSize.value);
});

function goToPage(p) {
  if (p < 1) p = 1;
  if (p > totalPages.value) p = totalPages.value;
  page.value = p;
}

function pageList() {
  const pages = [];
  for (let i = 1; i <= totalPages.value; i++) pages.push(i);
  return pages;
}

function toggleSelectAll(e) {
  if (e.target.checked) selectedIds.value = filteredData.value.map((s) => s.id);
  else selectedIds.value = [];
}

function clearSelection() {
  selectedIds.value = [];
}

const selectedRows = computed(() =>
  students.value.filter((s) => selectedIds.value.includes(s.id))
);

function exportCSV(rows) {
  const csvRows = [];
  const headers = [
    "ID",
    "First Name",
    "Last Name",
    "Email",
    "Course",
    "Year",
    "GPA",
    "Status",
  ];
  csvRows.push(headers.join(","));

  rows.forEach((r) => {
    csvRows.push(
      [
        r.id,
        `"${r.firstName}"`,
        `"${r.lastName}"`,
        `"${r.email}"`,
        `"${r.course}"`,
        r.year,
        r.gpa,
        `"${r.status}"`,
      ].join(",")
    );
  });

  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `students_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
</script>

<style scoped>
/* small utilities to improve table look */
table th button {
  appearance: none;
}
</style>
