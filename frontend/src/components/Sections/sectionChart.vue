<template>
  <div class="w-full max-w-sm p-4 shadow-lg rounded-lg">
    <h3 class="text-sm text-muted mb-2">Students per Section</h3>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { Chart, PieController, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(PieController, ArcElement, Tooltip, Legend);

const props = defineProps({
  sections: {
    type: Array,
    default: () => [
      // Example default data: { name: "Section 1", studentCount: 30 }
    ],
  },
});

const canvas = ref(null);
let chartInstance = null;

const baseColors = [
  "#32cc7d",
  "#28a663",
  "#8ee8b9",
  "#2ca368",
  "#60d08e",
  "#1f7f51",
  "#a1e5c2",
  "#239c65",
];

const renderChart = () => {
  if (chartInstance) chartInstance.destroy();

  const labels = props.sections.map((s) => s.name);
  const data = props.sections.map((s) => s.studentCount);

  const backgroundColor = labels.map(
    (_, i) => baseColors[i % baseColors.length]
  );

  chartInstance = new Chart(canvas.value, {
    type: "pie",
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor,
          borderWidth: 1,
          borderColor: "#fff",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            boxWidth: 14,
            padding: 12,
          },
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.label || "";
              const value = context.parsed || 0;
              return `${label}: ${value} student${value !== 1 ? "s" : ""}`;
            },
          },
        },
      },
    },
  });
};

onMounted(renderChart);
watch(props, renderChart);
</script>
