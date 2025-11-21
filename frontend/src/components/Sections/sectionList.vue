<template>
  <div class="w-full p-10">
    <!-- Top Controls -->
    <div
      class="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 mb-8"
    >
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search sections..."
        class="w-full md:w-80 px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
      />

      <button
        class="bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-green-700 transition"
        @click="showModal = true"
      >
        + Add
      </button>
    </div>

    <!-- Section List -->
    <div
      class="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <div
        v-for="section in filteredSections"
        :key="section.id"
        class="p-5 bg-white border border-gray-200 rounded-lg hover:border-green-500 transition cursor-pointer"
      >
        <h3 class="text-xl font-semibold text-gray-800 mb-1">
          {{ section.name }}
        </h3>

        <p class="text-gray-500 text-sm mb-4">
          {{ section.year }}
        </p>

        <button
          class="w-full bg-green-500 text-white py-2 rounded-lg text-sm hover:bg-green-600 transition"
          @click="viewSection(section.id)"
        >
          View
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <p
      v-if="filteredSections.length === 0"
      class="text-center text-gray-400 text-lg italic mt-10"
    >
      No sections found.
    </p>

    <!-- Imported Modal -->
    <addSection
      :show="showModal"
      @close="showModal = false"
      @add="confirmAdd"
    />
  </div>
</template>

<script setup>
import addSection from "@/components/CRUD/addSection.vue";
import { useApi } from "@/composables/api";
import { computed, onBeforeMount, ref } from "vue";

//

// --- Api
const { api } = useApi()

// --- Sections Fetching
const sections = ref([])

const getSections = async () => {
  await api.get("/section")
    .then((res) => sections.value = res.data)
    .catch(console.error)
}

// --- Section Create
const showModal = ref(false)

const confirmAdd = async (newSection) => {
  await api.post("/section", newSection)
    .then((res) => sections.value.push(res.data))
    .catch(console.error)
    .finally(() => showModal.value = false)
}

const viewSection = (id) => {
  alert(`Viewing section with ID: ${id}`);
}

// --- Filtering
const searchQuery = ref("")

const filteredSections = computed(() => {
  const q = searchQuery.value.toLowerCase();
  return sections.value.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.year.toLowerCase().includes(q)
  );
})

// --- Data Fetching
onBeforeMount(getSections)

//

</script>
