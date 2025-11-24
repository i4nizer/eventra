<template>
  <div class="page-wrapper">
    <!-- Top Controls -->
    <div class="controls-wrapper">
      <div class="search-wrapper">
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
        <span>Add Section</span>
      </button>
    </div>

    <!-- Section List -->
    <div class="section-list">
      <div
        v-for="section in filteredSections"
        :key="section.id"
        class="section-card"
      >
        <div class="section-info">
          <h3 class="section-title">
            {{ section.name }}
            <span class="text-muted section-year">{{ formatYear(section.year) }} year</span>
          </h3>
          <div class="section-dates">
            <small class="text-muted">Created: {{ formatDate(section.createdAt) }}</small>
            <small class="text-muted">Updated: {{ formatDate(section.updatedAt) }}</small>
          </div>
        </div>
        <div class="section-actions">
          <button class="action-btn btn-view" @click="viewSection(section)">
            <i class="fa-solid fa-eye"></i>
            <span class="sr-only">View Students</span>
          </button>
          <button class="action-btn btn-edit" @click="openEditModal(section)">
            <i class="fa-solid fa-pen-to-square"></i>
            <span class="sr-only">Edit Section</span>
          </button>
          <button class="action-btn btn-delete" @click="openDeleteModal(section)">
            <i class="fa-solid fa-trash"></i>
            <span class="sr-only">Delete Section</span>
          </button>
        </div>
      </div>

      <div v-if="filteredSections.length === 0" class="empty-state">
        <i class="fa-solid fa-folder-open empty-icon"></i>
        <p class="text-muted">No sections found.</p>
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
  try {
    const res = await api.get("/section");
    sections.value = res.data;
  } catch (error) {
    console.error(error);
  }
};

const showModal = ref(false);

const confirmAdd = async (newSection) => {
  if (!newSection.name || !newSection.year) {
    alert("Please provide both section name and year.");
    return;
  }
  try {
    const res = await api.post("/section", newSection);
    sections.value.push(res.data);
    showModal.value = false;
  } catch (error) {
    console.error(error);
    alert("Failed to add section. Please try again.");
  }
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
  if (!updatedSection.name || !updatedSection.year) {
    alert("Please provide both section name and year.");
    return;
  }
  try {
    const res = await api.put(`/section/${updatedSection.id}`, {
      name: updatedSection.name,
      year: updatedSection.year,
    });
    const idx = sections.value.findIndex((s) => s.id === updatedSection.id);
    if (idx !== -1) {
      sections.value[idx] = res.data;
    }
    closeEditModal();
  } catch (error) {
    console.error(error);
    alert("Failed to update section. Please try again.");
  }
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
  try {
    await api.delete(`/section/${selectedSectionForDelete.value.id}`);
    sections.value = sections.value.filter(
      (s) => s.id !== selectedSectionForDelete.value.id
    );
    closeDeleteModal();
  } catch (error) {
    console.error(error);
    alert("Failed to delete section. Please try again.");
  }
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

const formatDate = (dateString) => {
  if (!dateString) return "";
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return new Date(dateString).toLocaleString(undefined, options);
};

const showReadModal = ref(false);
const selectedSection = ref(null);
const selectedSectionStudents = ref([]);
const selectedSectionName = ref("");

const viewSection = async (section) => {
  selectedSection.value = section;
  selectedSectionName.value = `${section.name} - ${section.year}`;

  try {
    const res = await api.get(`/section/${section.id}/student`);
    selectedSectionStudents.value = res.data;
    showReadModal.value = true;
  } catch (error) {
    console.error(error);
  }
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
    (s) =>
      s.name.toLowerCase().includes(q) ||
      String(s.year).toLowerCase().includes(q)
  );
});

onBeforeMount(getSections);
</script>

<style scoped>
/* Page Layout */
.page-wrapper {
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  font-family: "Poppins", sans-serif;
}

.controls-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-wrapper {
  position: relative;
  flex: 1 1 250px;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  font-size: 1rem;
}

.icon-add {
  width: 1.25rem;
  height: 1.25rem;
}

/* Section List Cards */
.section-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-card {
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

.section-card:hover {
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
  font-weight: 500;
  margin-left: 0.5rem;
}

.section-dates {
  margin-top: 0.25rem;
  font-size: 0.75rem;
  display: flex;
  gap: 1rem;
}

.section-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

/* Empty State */
.empty-state {
  text-align: center;
  margin: 4rem 0;
  user-select: none;
}

.empty-icon {
  font-size: 3rem;
  opacity: 0.4;
  margin-bottom: 1rem;
  color: var(--muted);
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