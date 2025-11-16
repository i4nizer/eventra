<template>
  <div class="home">
    <div class="stats">
      <studentCount />
      <eventsCount />
      <sectionCount />
      <tagCount />
      <accountsCount />
    </div>
    <div class="charts">
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
.home {
  padding: 0.5rem;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  width: 100%;
}

.charts {
  margin-top: 1.5rem;
  height: 40vh;
  min-height: 300px;
}

/* Tablet */
@media (max-width: 1024px) {
  .stats {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 0.875rem;
  }
  
  .charts {
    height: 45vh;
    min-height: 350px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .home {
    padding: 0.75rem;
  }
  
  .stats {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .charts {
    margin-top: 1rem;
    height: 350px;
    min-height: 300px;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .home {
    padding: 0.5rem;
  }
  
  .stats {
    gap: 0.625rem;
  }
  
  .charts {
    height: 55vh;
    min-height: 350px;
  }
}
</style>