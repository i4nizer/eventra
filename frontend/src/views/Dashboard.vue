<template>
  <div class="home">
    <div class="stats">
      <studentCount />
      <eventsCount />
      <sectionCount />
      <tagCount />
      <accountsCount />
    </div>
    <div class="charts mt-6">
      <eventChart />
    </div>
    <!-- <div class="tables">
      <studentTable />
    </div> -->
  </div>
</template>
<script setup>
import studentCount from "@/components/students/studentCounts.vue";
import sectionCount from "@/components/Department/sectionCount.vue";
import tagCount from "@/components/Tags/tagCount.vue";
import accountsCount from "@/components/Accounts/accountsCount.vue";
import eventsCount from "@/components/Events/eventsCount.vue";
import eventChart from "@/components/Events/eventChart.vue";
// import studentTable from "@/components/students/studentTable.vue";
</script>

<style scoped>
.stats {
  display: flex;
  gap: 1rem;
}
</style>
