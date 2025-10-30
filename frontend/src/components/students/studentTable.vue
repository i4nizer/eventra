<template>
  <div class="bg-white shadow-md rounded-lg overflow-hidden">
    <!-- Header -->
    <div
      class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 border-b border-emerald-100"
    >
      <div class="flex items-center gap-3">
        <div class="relative">
          <input
            v-model="q"
            type="search"
            placeholder="Search by name, TAG or section..."
            class="pl-10 pr-3 py-2 rounded-md border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-white"
          />
          <i
            class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500"
          ></i>
        </div>

        <select
          v-model="perPage"
          class="py-2 px-3 rounded-md border border-emerald-200 text-gray-700 focus:ring-2 focus:ring-emerald-300"
        >
          <option v-for="n in [5, 10, 20, 50]" :key="n" :value="n">
            {{ n }} / page
          </option>
        </select>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="$emit('refresh')"
          class="px-3 py-2 bg-emerald-100 text-emerald-700 rounded-md hover:bg-emerald-200 transition-all"
        >
          <i class="fa-solid fa-arrows-rotate mr-2"></i> Refresh
        </button>
        <slot name="controls"></slot>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm">
        <thead class="bg-emerald-50">
          <tr class="text-emerald-800">
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
            class="border-b border-emerald-100 hover:bg-emerald-50 transition-all"
          >
            <td class="p-3 align-middle text-gray-700">
              {{ startIndex + idx + 1 }}
            </td>
            <td class="p-3 align-middle">
              <div class="font-medium text-gray-800">{{ s.name }}</div>
              <div class="text-xs text-gray-500">{{ s.email }}</div>
            </td>
            <td class="p-3 align-middle text-gray-700">{{ s.section }}</td>
            <td class="p-3 align-middle">
              <span
                class="inline-block px-2 py-1 rounded bg-emerald-100 text-emerald-700 text-xs font-medium"
              >
                {{ s.tag }}
              </span>
            </td>
            <td class="p-3 align-middle">
              <span
                class="inline-block px-2 py-1 rounded bg-emerald-50 text-emerald-800 text-xs font-medium"
              >
                ₱ {{ s.balance }}
              </span>
            </td>

            <td class="p-3 align-middle">
              <div class="flex items-center gap-2">
                <button
                  @click="$emit('edit', s)"
                  class="px-2 py-1 rounded-md text-emerald-700 hover:bg-emerald-50 transition"
                  title="Edit"
                >
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button
                  @click="$emit('view', s)"
                  class="px-2 py-1 rounded-md text-gray-700 hover:bg-gray-100 transition"
                  title="View"
                >
                  <i class="fa-solid fa-eye"></i>
                </button>
                <button
                  @click="$emit('delete', s)"
                  class="px-2 py-1 rounded-md text-red-600 hover:bg-red-50 transition"
                  title="Delete"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="paged.length === 0">
            <td class="p-6 text-center text-sm text-gray-500" :colspan="6">
              No students found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div
      class="p-3 border-t border-emerald-100 flex items-center justify-between bg-emerald-50/40"
    >
      <div class="text-sm text-gray-600">
        Showing {{ startIndex + 1 }} - {{ startIndex + paged.length }} of
        {{ filtered.length }}
      </div>

      <div class="flex items-center gap-2">
        <button
          class="px-3 py-1 rounded-md border border-emerald-200 text-emerald-700 hover:bg-emerald-100 disabled:opacity-40"
          :disabled="page === 1"
          @click="page--"
        >
          Prev
        </button>
        <div
          class="px-3 py-1 rounded-md border border-emerald-200 bg-white text-emerald-700"
        >
          {{ page }}
        </div>
        <button
          class="px-3 py-1 rounded-md border border-emerald-200 text-emerald-700 hover:bg-emerald-100 disabled:opacity-40"
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
  template: `<span class="inline-block ml-2 text-xs text-emerald-500">
    <i v-if="sort.field===field && sort.dir==='asc'" class="fa-solid fa-arrow-up"></i>
    <i v-else-if="sort.field===field && sort.dir==='desc'" class="fa-solid fa-arrow-down"></i>
  </span>`,
};

const props = defineProps({
  students: { type: Array, default: () => null },
  defaultPerPage: { type: Number, default: 10 },
});

const emit = defineEmits(["edit", "delete", "view", "refresh"]);

const q = ref("");
const page = ref(1);
const perPage = ref(props.defaultPerPage);
const sort = ref({ field: "name", dir: "asc" });

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

watch([q, perPage], () => (page.value = 1));
</script>
