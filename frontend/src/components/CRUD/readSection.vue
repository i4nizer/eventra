<template>
  <Transition name="modal">
    <div v-if="open" class="modal-overlay" @click.self="handleClose">
      <div class="modal-container modal-large">
        <!-- Header -->
        <div class="modal-header">
          <h2 class="modal-title">
            {{ sectionName || 'Section Students' }}
          </h2>
          <button @click="handleClose" class="close-btn">
            <i class="fa-solid fa-times"></i>
          </button>
        </div>

        <!-- Body -->
        <div class="modal-body modal-body-table">
          <!-- Desktop Table -->
          <div class="desktop-table">
            <table class="w-full text-left text-sm">
              <thead class="table-head">
                <tr>
                  <th class="p-3">#</th>
                  <th class="p-3">Student ID</th>
                  <th class="p-3">Name</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="(student, idx) in students"
                  :key="student.id"
                  class="table-row"
                >
                  <td class="p-3 align-middle row-number">
                    {{ idx + 1 }}
                  </td>
                  <td class="p-3 align-middle">
                    <span class="student-id">{{ student.studentId || student.id }}</span>
                  </td>
                  <td class="p-3 align-middle">
                    <div class="student-name">{{ student.name }}</div>
                    <div v-if="student.email" class="student-email">
                      {{ student.email }}
                    </div>
                  </td>
                </tr>

                <tr v-if="students.length === 0">
                  <td class="p-6 text-center text-sm empty-state" colspan="3">
                    No students found in this section.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mobile Cards -->
          <div class="mobile-cards">
            <div
              v-for="(student, idx) in students"
              :key="student.id"
              class="student-card"
            >
              <div class="card-header">
                <div class="card-number">{{ idx + 1 }}</div>
              </div>

              <div class="card-content">
                <div class="card-row">
                  <div class="card-label">Student ID</div>
                  <div class="card-value">
                    <span class="student-id">{{ student.studentId || student.id }}</span>
                  </div>
                </div>

                <div class="card-row">
                  <div class="card-label">Name</div>
                  <div class="card-value">
                    <div class="student-name">{{ student.name }}</div>
                    <div v-if="student.email" class="student-email">
                      {{ student.email }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="students.length === 0" class="empty-state-mobile">
              No students found in this section.
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <button @click="handleClose" class="btn-close">Close</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const props = defineProps({
  open: { type: Boolean, default: false },
  students: { type: Array, default: () => [] },
  sectionName: { type: String, default: '' },
});

const emit = defineEmits(['close']);

const handleClose = () => {
  emit('close');
};
</script>

<style scoped>


/* Desktop Table */
.desktop-table {
  display: none;
}

@media (min-width: 768px) {
  .desktop-table {
    display: block;
  }
}

/* Mobile Cards */
.mobile-cards {
  display: block;
}

@media (min-width: 768px) {
  .mobile-cards {
    display: none;
  }
}

/* Utility Classes */
.w-full {
  width: 100%;
}

.text-left {
  text-align: left;
}

.text-sm {
  font-size: 0.875rem;
}

.text-center {
  text-align: center;
}

.p-3 {
  padding: 0.75rem;
}

.p-6 {
  padding: 1.5rem;
}

.align-middle {
  vertical-align: middle;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.gap-2 {
  gap: 0.5rem;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .modal-large {
    max-width: 100%;
    margin: 0;
    border-radius: 0;
    max-height: 100vh;
  }

  .modal-body-table {
    max-height: calc(100vh - 180px);
  }
}
</style>