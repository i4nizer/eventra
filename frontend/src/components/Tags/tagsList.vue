<template>
  <div class="bg-white shadow rounded-lg overflow-hidden">
    <!-- Header -->
    <div
      class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 border-b border-emerald-100"
    >
      <div class="flex items-center gap-3 flex-wrap">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Search Tag ID..."
            class="pl-10 pr-3 py-2 rounded-md border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-white"
          />
          <i
            class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          ></i>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="$emit('refresh')"
          class="px-3 py-2 bg-emerald-50 text-emerald-700 rounded-md hover:bg-emerald-100"
        >
          <i class="fa-solid fa-arrows-rotate mr-2"></i> Refresh
        </button>
        <button
          @click="$emit('addTag')"
          class="px-3 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 shadow-sm"
        >
          + Add Tag
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm">
        <thead
          class="bg-emerald-50 text-emerald-900 border-b border-emerald-100"
        >
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
          <tr
            v-for="tag in paginatedTags"
            :key="tag.id"
            class="border-b hover:bg-emerald-50/50 transition-colors"
          >
            <td class="p-3 align-middle font-medium">{{ tag.id }}</td>
            <td class="p-3 align-middle">
              <span
                :class="[
                  'inline-block px-3 py-1 rounded-full text-xs font-medium shadow-sm',
                  tag.status === 'Equipped'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-gray-100 text-gray-600',
                ]"
              >
                {{ tag.status }}
              </span>
            </td>
            <td class="p-3 align-middle">
              <span v-if="tag.status === 'Equipped' && tag.assignedStudent">
                {{ tag.assignedStudent }}
              </span>
              <span v-else class="text-gray-400">—</span>
            </td>
            <td class="p-3 align-middle text-center">
              <div class="flex justify-center gap-2">
                <button
                  v-if="tag.status === 'Not Equipped'"
                  @click="$emit('assign', tag)"
                  class="px-3 py-1 rounded-md border text-emerald-700 border-emerald-300 hover:bg-emerald-50 text-xs"
                >
                  Assign
                </button>
                <button
                  v-else
                  @click="$emit('unassign', tag)"
                  class="px-3 py-1 rounded-md border text-red-600 border-red-300 hover:bg-red-50 text-xs"
                >
                  Unassign
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="paginatedTags.length === 0">
            <td colspan="4" class="p-6 text-center text-gray-500">
              No tags found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="p-3 border-t flex items-center justify-between">
      <div class="text-sm text-gray-600">
        Showing {{ paginatedTags.length }} of {{ filtered.length }} (Page
        {{ page }} / {{ totalPages }})
      </div>
      <div class="flex items-center gap-2">
        <button
          class="px-3 py-1 rounded-md border disabled:opacity-40"
          :disabled="page === 1"
          @click="page--"
        >
          Prev
        </button>
        <div class="px-3 py-1 rounded-md border">{{ page }}</div>
        <button
          class="px-3 py-1 rounded-md border disabled:opacity-40"
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
import { ref, computed } from "vue";

/* Inline Sort Icon */
const SortIcon = {
  props: ["field", "sort"],
  template: `<span class="inline-block ml-1 text-xs text-gray-400">
    <i v-if="sort.field===field && sort.dir==='asc'" class="fa-solid fa-arrow-up"></i>
    <i v-else-if="sort.field===field && sort.dir==='desc'" class="fa-solid fa-arrow-down"></i>
  </span>`,
};

const searchQuery = ref("");
const sort = ref({ field: "id", dir: "asc" });
const page = ref(1);
const perPage = ref(10);

const tags = ref([
  { id: "TAG-001", status: "Equipped", assignedStudent: "John Doe" },
  { id: "TAG-002", status: "Not Equipped", assignedStudent: "" },
  { id: "TAG-003", status: "Equipped", assignedStudent: "Jane Smith" },
  { id: "TAG-004", status: "Not Equipped", assignedStudent: "" },
  { id: "TAG-005", status: "Equipped", assignedStudent: "Alice Cruz" },
  { id: "TAG-006", status: "Equipped", assignedStudent: "Michael Tan" },
  { id: "TAG-007", status: "Not Equipped", assignedStudent: "" },
  { id: "TAG-008", status: "Equipped", assignedStudent: "Sarah Lee" },
  { id: "TAG-009", status: "Equipped", assignedStudent: "Carlos Reyes" },
  { id: "TAG-010", status: "Not Equipped", assignedStudent: "" },
  { id: "TAG-011", status: "Equipped", assignedStudent: "Anna Marie" },
  { id: "TAG-012", status: "Not Equipped", assignedStudent: "" },
]);

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
</script>

<style scoped>
table {
  border-spacing: 0;
}
</style>
