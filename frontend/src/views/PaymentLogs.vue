<template>
  <div class="payment-logs">
    <attendanceTable :data="paymentData" />
  </div>
</template>

<script setup>
import attendanceTable from "@/components/Payment/paymentLogs.vue"
import { ref } from "vue"

const paymentData = ref([])
</script>