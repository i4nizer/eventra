<template>
  <div class="chart bg-white p-4 rounded-lg shadow">
    <div class="flex justify-between items-center mb-3 sort">
      <h3 class="text-lg font-semibold">Events: Sign-Ups & Participants</h3>

      <!-- ✅ Category Filter -->
      <select
        v-model="selectedCategory"
        class="border px-2 py-1 rounded text-sm"
      >
        <option value="all">All Categories</option>
        <option v-for="cat in categoryList" :key="cat" :value="cat">
          {{ cat.charAt(0).toUpperCase() + cat.slice(1) }}
        </option>
      </select>
    </div>

    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const props = defineProps({
  events: {
    type: Array,
    default: () => [
      {
        id: 1,
        title: "Orientation",
        registered: 150,
        attendees: 120,
        category: "special",
      },
      {
        id: 2,
        title: "Daily Attendance 2025-10-01",
        registered: 200,
        attendees: 190,
        category: "normal",
      },
      {
        id: 3,
        title: "Alumni Meet",
        registered: 250,
        attendees: 200,
        category: "special",
      },

      // ✅ Added 5 more sample data
      {
        id: 4,
        title: "TechFest",
        registered: 300,
        attendees: 250,
        category: "special",
      },
      {
        id: 5,
        title: "Coding Bootcamp",
        registered: 120,
        attendees: 100,
        category: "normal",
      },
      {
        id: 6,
        title: "Hackathon",
        registered: 180,
        attendees: 150,
        category: "special",
      },
      {
        id: 7,
        title: "Internship Orientation",
        registered: 220,
        attendees: 200,
        category: "normal",
      },
      {
        id: 8,
        title: "IT Summit",
        registered: 350,
        attendees: 300,
        category: "special",
      },
    ],
  },
});

// ✅ Category colors
const categoryColors = {
  special: { registered: "#7c3aed", attendees: "#6d28d9" },
  normal: { registered: "#06b6d4", attendees: "#0891b2" },
  other: { registered: "#f59e0b", attendees: "#d97706" },
};

const colorFor = (category) => categoryColors[category] ?? categoryColors.other;

// ✅ Extract unique categories
const categoryList = computed(() => [
  ...new Set(props.events.map((e) => e.category)),
]);

// ✅ Filter selection
const selectedCategory = ref("all");

// ✅ Computed: filter events based on selected category
const filteredEvents = computed(() =>
  selectedCategory.value === "all"
    ? props.events
    : props.events.filter((e) => e.category === selectedCategory.value)
);

// ✅ Computed chart data updated based on filtered events
const chartData = computed(() => {
  const labels = filteredEvents.value.map((e) => e.title);
  const registered = filteredEvents.value.map((e) => Number(e.registered ?? 0));
  const attendees = filteredEvents.value.map((e) => Number(e.attendees ?? 0));

  return {
    labels,
    datasets: [
      {
        label: "Registered",
        data: registered,
        backgroundColor: filteredEvents.value.map(
          (e) => colorFor(e.category).registered
        ),
        borderRadius: 6,
      },
      {
        label: "Attendees",
        data: attendees,
        backgroundColor: filteredEvents.value.map(
          (e) => colorFor(e.category).attendees
        ),
        borderRadius: 6,
      },
    ],
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: "index", intersect: false },
  plugins: {
    legend: { position: "top" },
    tooltip: {
      callbacks: {
        title: (ctx) => ctx[0].label,
        label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}`,
        afterBody: (ctx) => {
          const idx = ctx[0].dataIndex;
          const ev = filteredEvents.value[idx];
          const pct =
            ev && ev.registered
              ? Math.round(((ev.attendees ?? 0) / ev.registered) * 100)
              : 0;
          return `Present %: ${pct}%   •   Category: ${
            ev?.category ?? "other"
          }`;
        },
      },
    },
  },
  scales: {
    x: { ticks: { maxRotation: 30, minRotation: 0 } },
    y: { beginAtZero: true, ticks: { precision: 0 } },
  },
  layout: { padding: 6 },
};
</script>

<style scoped>
.sort {
  height: 10vh;
}

.chart {
  height: 70vh;
}
</style>
