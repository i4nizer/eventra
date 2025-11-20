<template>
  <div class="w-full max-w-sm p-4 shadow-lg rounded-lg">
    <h3 class="text-sm text-muted mb-2">Summary</h3>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { Chart, PieController, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(PieController, ArcElement, Tooltip, Legend);

const props = defineProps({
  assignTags: { type: Number, default: 0 },
  unassignTags: { type: Number, default: 0 },
  totalTags: { type: Number, default: 0 },
});

const canvas = ref(null);
let chartInstance = null;

const renderChart = () => {
  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(canvas.value, {
    type: "pie",
    data: {
      labels: ["With RFID", "Without RFID", "RFID Tags"],
      datasets: [
        {
          data: [props.assignTags, props.unassignTags, props.totalTags],
          backgroundColor: [
            "#45d089", // main color (With RFID)
            "#8ee8b9", // lighter shade (Without RFID)
            "#2ca368", // darker shade (RFID Tags)
          ],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  });
};

onMounted(renderChart);
watch(props, renderChart);
</script>
