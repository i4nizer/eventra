<template>
  <div class="attendance-logs">
    <attendanceTable :data="attendanceData" />
  </div>
</template>

<script setup>
import attendanceTable from "@/components/Attendance/attendanceTable.vue"
import { ref } from "vue"

const attendanceData = ref([])
</script>
