<template>
  <h1>Dito ko muna nilagay Payment</h1>
  <div class="reports">
    <attendanceTable :data="paymentData" />
  </div>
</template>

<script setup>
import attendanceTable from "@/components/Payment/paymentLogs.vue"
import { ref } from "vue"

const paymentData = ref([])
</script>