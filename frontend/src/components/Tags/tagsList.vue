<template>
  <div class="bg-white shadow-md rounded-lg p-6">
    <!-- Header -->
    <div class="flex flex-wrap justify-between items-center mb-4 gap-4">
      <h2 class="text-xl font-semibold text-gray-800">Tags List</h2>

      <!-- Search + Sort Controls -->
      <div class="flex items-center gap-3 flex-wrap">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search tag ID..."
          class="border border-gray-300 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          v-model="sortKey"
          class="border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option disabled value="">Sort By</option>
          <option value="id">Tag ID</option>
          <option value="status">Status</option>
          <option value="assignedStudent">Assigned Student</option>
        </select>

        <select
          v-model="sortOrder"
          class="border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="asc">Ascending ↑</option>
          <option value="desc">Descending ↓</option>
        </select>

        <button
          @click="$emit('addTag')"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
        >
          Add Tag
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-100 text-gray-700 text-sm">
            <th class="py-3 px-4 cursor-pointer" @click="headerSort('id')">
              Tag ID
            </th>
            <th class="py-3 px-4 cursor-pointer" @click="headerSort('status')">
              Status
            </th>
            <th
              class="py-3 px-4 cursor-pointer"
              @click="headerSort('assignedStudent')"
            >
              Assigned Student
            </th>
            <th class="py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="tag in sortedTags"
            :key="tag.id"
            class="border-b hover:bg-gray-50 transition"
          >
            <td class="py-3 px-4">{{ tag.id }}</td>
            <td class="py-3 px-4">
              <span
                :class="[
                  'px-3 py-1 text-xs font-medium rounded-full',
                  tag.status === 'Equipped'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-200 text-gray-600',
                ]"
              >
                {{ tag.status }}
              </span>
            </td>
            <td class="py-3 px-4">
              <span v-if="tag.status === 'Equipped' && tag.assignedStudent">
                {{ tag.assignedStudent }}
              </span>
              <span v-else class="text-gray-400">—</span>
            </td>
            <td class="py-3 px-4 flex gap-2">
              <button
                v-if="tag.status === 'Not Equipped'"
                @click="$emit('assign', tag)"
                class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-xs"
              >
                Assign
              </button>
              <button
                v-else
                @click="$emit('unassign', tag)"
                class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs"
              >
                Unassign
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Placeholder -->
    <div class="flex justify-between items-center mt-4 text-sm text-gray-600">
      <p>Showing {{ sortedTags.length }} of {{ tags.length }} tags</p>
      <div class="flex gap-2">
        <button class="px-3 py-1 border rounded-lg hover:bg-gray-100">
          Prev
        </button>
        <button class="px-3 py-1 border rounded-lg hover:bg-gray-100">
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const searchQuery = ref("");
const sortKey = ref("");
const sortOrder = ref("asc");

const tags = ref([
  { id: "TAG-001", status: "Equipped", assignedStudent: "John Doe" },
  { id: "TAG-002", status: "Not Equipped", assignedStudent: "" },
  { id: "TAG-003", status: "Equipped", assignedStudent: "Jane Smith" },
  { id: "TAG-004", status: "Not Equipped", assignedStudent: "" },
]);

const headerSort = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = key;
    sortOrder.value = "asc";
  }
};

const sortedTags = computed(() => {
  let result = [...tags.value].filter((tag) =>
    tag.id.toLowerCase().includes(searchQuery.value.toLowerCase())
  );

  if (sortKey.value) {
    result.sort((a, b) => {
      const x = (a[sortKey.value] || "").toString().toLowerCase();
      const y = (b[sortKey.value] || "").toString().toLowerCase();
      return sortOrder.value === "asc"
        ? x.localeCompare(y)
        : y.localeCompare(x);
    });
  }

  return result;
});
</script>
