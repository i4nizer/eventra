<template>
  <div class="violation-logs">
    <violationsTable :data="violationData" />
  </div>
</template>

<script setup>
import violationsTable from "@/components/violations/violationsTable.vue"
import { ref } from "vue"

const violationData = ref([])
</script>