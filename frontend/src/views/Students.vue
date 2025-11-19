<template>
  <div class="students">
    <div class="studentHeader">
      <studentCounts />
    </div>
    <div class="studentTable">
      <studentTable />
    </div>
  </div>
</template>

<script setup>
import studentCounts from "@/components/students/studentCounts.vue";
import studentTable from "@/components/students/studentTable.vue";
</script>

<style scoped>
.students {
  padding: 1rem;
}

.studentHeader {
  margin-bottom: 1.5rem;
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