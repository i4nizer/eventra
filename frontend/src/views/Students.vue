<template>
  <div class="students">
    <div class="studentTable">
      <studentTable />
    </div>
    <div class="stats">
      <div class="studentHeader">
        <studentCounts />
      </div>
      <div class="studentWithRFID">
        <studentWithRFID />
      </div>
      <div class="studentWithoutRFID">
        <studentWithoutRFID />
      </div>
    </div>
  </div>
</template>

<script setup>
import studentCounts from "@/components/students/studentCounts.vue";
import studentTable from "@/components/students/studentTable.vue";
import studentWithRFID from "@/components/students/studentWithRFID.vue";
import studentWithoutRFID from "@/components/students/studentWithoutRFID.vue";
</script>

<style scoped>
.students {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 2rem;
}

.stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 30vw;
}

.studentTable {
  width: 100%;
}

/* Tablet */
@media (max-width: 1024px) {
  .students {
    padding: 0.875rem;
  }

  .studentHeader {
    margin-bottom: 1.25rem;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .students {
    padding: 0.75rem;
  }

  .studentHeader {
    margin-bottom: 1rem;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .students {
    padding: 0.5rem;
  }

  .studentHeader {
    margin-bottom: 0.875rem;
  }
}
</style>
