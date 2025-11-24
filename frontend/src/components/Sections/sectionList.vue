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

      <button
        class="btn-add"
        @click="showModal = true"
        aria-label="Add Section"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon-add"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="btn-text">Add Section</span>
      </button>
    </div>

    <!-- Section List -->
    <div class="section-list">
      <div
        v-for="section in filteredSections"
        :key="section.id"
        class="section-item"
      >
        <div class="section-info">
          <h3 class="section-title">
            {{ section.name }}
            <span class="section-year"
              >{{ formatYear(section.year) }} year</span
            >
          </h3>
        </div>
        <div class="section-actions">
          <button class="btn-view" @click="viewSection(section)">
            <i class="fa-solid fa-eye"></i>
            <span class="sr-only">View Students</span>
          </button>
          <button class="btn-edit" @click="openEditModal(section)">
            <i class="fa-solid fa-pen-to-square"></i>
            <span class="sr-only">Edit Section</span>
          </button>
          <button class="btn-delete" @click="openDeleteModal(section)">
            <i class="fa-solid fa-trash"></i>
            <span class="sr-only">Delete Section</span>
          </button>
        </div>
      </div>

      <div v-if="filteredSections.length === 0" class="empty-state-page">
        <i class="fa-solid fa-folder-open empty-icon"></i>
        <p class="empty-text">No sections found.</p>
      </div>
    </div>

    <!-- Modals -->
    <addSection
      :show="showModal"
      @close="showModal = false"
      @add="confirmAdd"
    />
    <editSection
      :show="showEditModal"
      :section="selectedSectionForEdit"
      @close="closeEditModal"
      @submit="confirmEdit"
    />
    <readSection
      :open="showReadModal"
      :students="selectedSectionStudents"
      :section-name="selectedSectionName"
      @close="closeReadModal"
    />
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

const sections = ref([]);

const getSections = async () => {
  await api
    .get("/section")
    .then((res) => (sections.value = res.data))
    .catch(console.error);
};

const showModal = ref(false);

const confirmAdd = async (newSection) => {
  await api
    .post("/section", newSection)
    .then((res) => sections.value.push(res.data))
    .catch(console.error)
    .finally(() => (showModal.value = false));
};

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
      year: updatedSection.year,
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

const formatYear = (year) => {
  const y = parseInt(year);
  const last = y % 10;
  const lastTwo = y % 100;

  if (lastTwo >= 11 && lastTwo <= 13) return `${y}th`;

  if (last === 1) return `${y}st`;
  if (last === 2) return `${y}nd`;
  if (last === 3) return `${y}rd`;
  return `${y}th`;
};

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
  margin: 0 auto;
  padding: 2rem 1.5rem;
  font-family: "Poppins", sans-serif;
  color: var(--text);
}

.controls-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-wrapper-section {
  position: relative;
  flex: 1 1 250px;
}

.search-input {
  width: 100%;
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  border-radius: 12px;
  border: 1.5px solid var(--border);
  font-size: 1rem;
  color: var(--text);
  transition: border-color 0.3s ease;
  background: var(--surface);
}

.search-input::placeholder {
  color: var(--muted);
}

.search-input:focus {
  border-color: var(--accent);
  outline: none;
  box-shadow: 0 0 6px var(--accent);
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted);
  pointer-events: none;
  font-size: 1rem;
}

.btn-add {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  white-space: nowrap;
}

.btn-add:hover {
  background: #28b06d; /* Slightly darker accent */
}

.icon-add {
  width: 1.25rem;
  height: 1.25rem;
}

.btn-text {
  line-height: 1;
}

/* Section List as vertical minimal cards */

.section-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1rem 1.5rem;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
  cursor: default;
}

.section-item:hover {
  border-color: var(--accent);
  box-shadow: 0 8px 24px rgba(50, 204, 125, 0.15);
}

.section-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  max-width: 70%;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.section-year {
  font-size: 0.875rem;
  color: var(--muted);
  font-weight: 500;
}

.section-actions {
  display: flex;
  gap: 0.75rem;
  flex-shrink: 0;
}

.section-actions button {
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--muted);
  font-size: 1.125rem;
  padding: 0.25rem;
  border-radius: 8px;
  transition: color 0.3s ease, background-color 0.3s ease;
  display: flex;
  align-items: center;
}

.section-actions button:hover {
  color: var(--accent);
  background: rgba(50, 204, 125, 0.15);
}

.empty-state-page {
  text-align: center;
  color: var(--muted);
  font-style: italic;
  margin: 4rem 0;
  user-select: none;
}

.empty-icon {
  font-size: 3rem;
  opacity: 0.4;
  margin-bottom: 1rem;
}

/* Accessibility helper */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>
