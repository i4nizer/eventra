<template>
  <div class="students">
    <div class="studentHeader mb-12">
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
