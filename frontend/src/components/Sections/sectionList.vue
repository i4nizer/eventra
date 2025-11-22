<template>
  <div class="page-wrapper">
    <!-- Top Controls -->
    <div class="controls-wrapper">
      <div class="search-wrapper-section">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search sections..."
          class="search-input"
        />
        <i class="fa-solid fa-magnifying-glass search-icon"></i>
      </div>

      <button class="btn-add" @click="showModal = true">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/>
        </svg>
        <span class="btn-text">Add Section</span>
      </button>
    </div>

    <!-- Section Grid -->
    <div class="section-grid">
      <div v-for="section in filteredSections" :key="section.id" class="section-card">
        <div class="section-card-header">
          <h3 class="section-title">{{ section.name }}</h3>
          <p class="section-year">{{ section.year }}</p>
        </div>

        <div class="section-card-footer">
          <button class="btn-close" @click="viewSection(section)">
            <i class="fa-solid fa-eye"></i>
            View Students
          </button>
          <button class="btn-submit" @click="openEditModal(section)">
            <i class="fa-solid fa-pen-to-square"></i>
            Edit
          </button>
          <button class="btn-cancel" @click="openDeleteModal(section)">
            <i class="fa-solid fa-trash"></i>
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredSections.length === 0" class="empty-state-page">
      <i class="fa-solid fa-folder-open empty-icon"></i>
      <p class="empty-text">No sections found.</p>
    </div>

    <!-- Add Section Modal -->
    <addSection :show="showModal" @close="showModal = false" @add="confirmAdd"/>

    <!-- Edit Section Modal -->
    <editSection
      :show="showEditModal"
      :section="selectedSectionForEdit"
      @close="closeEditModal"
      @submit="confirmEdit"
    />

    <!-- Read Section Modal -->
    <readSection
      :open="showReadModal"
      :students="selectedSectionStudents"
      :section-name="selectedSectionName"
      @close="closeReadModal"
    />

    <!-- Delete Section Modal -->
    <deleteSection
      :open="showDeleteModal"
      :section="selectedSectionForDelete"
      :on-close="closeDeleteModal"
      :on-confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import addSection from "@/components/CRUD/addSection.vue";
import editSection from "@/components/CRUD/editSection.vue";
import deleteSection from "@/components/CRUD/deleteSection.vue";
import readSection from "@/components/CRUD/readSection.vue";
import { useApi } from "@/composables/api";
import { computed, onBeforeMount, ref } from "vue";

const { api } = useApi();

// --- Sections Fetching
const sections = ref([]);

const getSections = async () => {
  await api
    .get("/section")
    .then((res) => (sections.value = res.data))
    .catch(console.error);
};

// --- Section Create
const showModal = ref(false);

const confirmAdd = async (newSection) => {
  await api
    .post("/section", newSection)
    .then((res) => sections.value.push(res.data))
    .catch(console.error)
    .finally(() => (showModal.value = false));
};

// --- Section Edit
const showEditModal = ref(false);
const selectedSectionForEdit = ref(null);

const openEditModal = (section) => {
  selectedSectionForEdit.value = { ...section };
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  selectedSectionForEdit.value = null;
};

const confirmEdit = async (updatedSection) => {
  await api
    .put(`/section/${updatedSection.id}`, {
      name: updatedSection.name,
      year: updatedSection.year
    })
    .then((res) => {
      const idx = sections.value.findIndex((s) => s.id === updatedSection.id);
      if (idx !== -1) {
        sections.value[idx] = res.data;
      }
    })
    .catch(console.error)
    .finally(() => closeEditModal());
};

// --- Section Delete
const showDeleteModal = ref(false);
const selectedSectionForDelete = ref(null);

const openDeleteModal = (section) => {
  selectedSectionForDelete.value = { ...section };
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  selectedSectionForDelete.value = null;
};

const confirmDelete = async () => {
  if (!selectedSectionForDelete.value) return;
  
  await api
    .delete(`/section/${selectedSectionForDelete.value.id}`)
    .then(() => {
      sections.value = sections.value.filter(
        (s) => s.id !== selectedSectionForDelete.value.id
      );
    })
    .catch(console.error)
    .finally(() => closeDeleteModal());
};

// --- View Section (Read Modal)
const showReadModal = ref(false);
const selectedSection = ref(null);
const selectedSectionStudents = ref([]);
const selectedSectionName = ref("");

const viewSection = async (section) => {
  selectedSection.value = section;
  selectedSectionName.value = `${section.name} - ${section.year}`;
  
  await api
    .get(`/section/${section.id}/student`)
    .then((res) => {
      selectedSectionStudents.value = res.data;
      showReadModal.value = true;
    })
    .catch(console.error);
};

const closeReadModal = () => {
  showReadModal.value = false;
  selectedSection.value = null;
  selectedSectionStudents.value = [];
  selectedSectionName.value = "";
};

// --- Filtering
const searchQuery = ref("");

const filteredSections = computed(() => {
  const q = searchQuery.value.toLowerCase();
  return sections.value.filter(
    (s) => s.name.toLowerCase().includes(q) || s.year.toLowerCase().includes(q)
  );
});

onBeforeMount(getSections);
</script>

<style scoped>
.page-wrapper {
  width: 100%;
  padding: 2.5rem;
  min-height: 100vh;
}

@media (max-width: 768px) {
  .page-wrapper { padding: 1rem; }
}

.controls-wrapper {
  max-width: 64rem;
  margin: 0 auto 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@media (min-width: 768px) {
  .controls-wrapper {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.search-wrapper-section {
  position: relative;
  flex: 1;
}

.search-wrapper-section .search-input {
  padding-left: 2.5rem;
}

.search-wrapper-section .search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.section-grid {
  max-width: 64rem;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 640px) {
  .section-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1024px) {
  .section-grid { grid-template-columns: repeat(3, 1fr); }
}

.section-card {
  padding: 1.25rem;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  transition: all 0.2s;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-card:hover {
  background: var(--surface);
  border-color: var(--accent);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.section-card-header { flex: 1; }

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 0.25rem;
}

.section-year {
  font-size: 0.875rem;
  color: var(--muted);
}

.section-card-footer {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.section-card-footer button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.empty-state-page {
  max-width: 64rem;
  margin: 4rem auto;
  text-align: center;
  padding: 3rem 1rem;
}

.empty-icon {
  font-size: 4rem;
  color: var(--muted);
  opacity: 0.5;
  margin-bottom: 1rem;
}

.empty-text {
  font-size: 1.125rem;
  color: var(--muted);
  font-style: italic;
}

.h-5 { height: 1.25rem; }
.w-5 { width: 1.25rem; }
</style>