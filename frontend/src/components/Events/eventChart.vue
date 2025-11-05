<template>
  <div class="chart surface p-4 rounded-lg shadow">
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
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
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
      { id: 1, title: "Orientation", registered: 150, attendees: 120, category: "special" },
      { id: 2, title: "Daily Attendance 2025-10-01", registered: 200, attendees: 190, category: "normal" },
      { id: 3, title: "Alumni Meet", registered: 250, attendees: 200, category: "special" },
      { id: 4, title: "TechFest", registered: 300, attendees: 250, category: "special" },
      { id: 5, title: "Coding Bootcamp", registered: 120, attendees: 100, category: "normal" },
      { id: 6, title: "Hackathon", registered: 180, attendees: 150, category: "special" },
      { id: 7, title: "Internship Orientation", registered: 220, attendees: 200, category: "normal" },
      { id: 8, title: "IT Summit", registered: 350, attendees: 300, category: "special" },
    ],
  },
});

// Resolve --accent CSS variable to a usable color string
function getAccent() {
  try {
    const raw = getComputedStyle(document.documentElement).getPropertyValue("--accent")?.trim();
    if (!raw) return "#10b981"; // fallback
    return raw;
  } catch {
    return "#10b981";
  }
}

function hexToRgba(hex, alpha = 1) {
  if (!hex) return `rgba(16,185,129,${alpha})`;
  const h = hex.trim();
  // already rgba()/rgb()
  if (/^rgba?\(/i.test(h)) {
    return h.replace(/^rgb\(/i, "rgba(").replace(/\)$/, `, ${alpha})`);
  }
  // named colors or other formats: return as-is (alpha won't be applied)
  if (!/^#/.test(h)) return h;
  let v = h.slice(1);
  if (v.length === 3) v = v.split("").map((c) => c + c).join("");
  const num = parseInt(v, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const accentRaw = getAccent();
const registeredColor = accentRaw;
const attendeesColor = hexToRgba(accentRaw, 0.78);

// Category colors (kept as fallbacks for category-based coloring)
const categoryColors = {
  special: { registered: registeredColor, attendees: attendeesColor },
  normal: { registered: registeredColor, attendees: attendeesColor },
  other: { registered: registeredColor, attendees: attendeesColor },
};

const colorFor = (category) => categoryColors[category] ?? categoryColors.other;

// Extract unique categories
const categoryList = computed(() => [...new Set(props.events.map((e) => e.category))]);

// Filter selection
const selectedCategory = ref("all");

// Computed: filter events based on selected category
const filteredEvents = computed(() =>
  selectedCategory.value === "all"
    ? props.events
    : props.events.filter((e) => e.category === selectedCategory.value)
);

// Computed chart data updated based on filtered events
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
        backgroundColor: filteredEvents.value.map(() => registeredColor),
        borderRadius: 6,
      },
      {
        label: "Attendees",
        data: attendees,
        backgroundColor: filteredEvents.value.map(() => attendeesColor),
        borderRadius: 6,
      },
    ],
  };
});

// reactive dark-mode flag (keeps chart text updating when theme toggles)
const isDark = ref(document.documentElement.classList.contains("dark"));
let mo = null;

onMounted(() => {
  // Watch for class changes on <html> so chartTextColor updates when toggle is used
  mo = new MutationObserver(() => {
    isDark.value = document.documentElement.classList.contains("dark");
  });
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
});

onBeforeUnmount(() => {
  if (mo) mo.disconnect();
});

// compute text color: white when darkmode, otherwise use --muted resolved value
function resolveMuted() {
  try {
    const raw = getComputedStyle(document.documentElement).getPropertyValue("--muted")?.trim();
    return raw || "#6b7280";
  } catch {
    return "#6b7280";
  }
}

const chartTextColor = computed(() => (isDark.value ? "#ffffff" : resolveMuted()));

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: "index", intersect: false },
  plugins: {
    legend: {
      position: "top",
      labels: { color: chartTextColor.value },
    },
    tooltip: {
      titleColor: chartTextColor.value,
      bodyColor: chartTextColor.value,
      callbacks: {
        title: (ctx) => ctx[0].label,
        label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}`,
        afterBody: (ctx) => {
          const idx = ctx[0].dataIndex;
          const ev = filteredEvents.value[idx];
          const pct = ev && ev.registered ? Math.round(((ev.attendees ?? 0) / ev.registered) * 100) : 0;
          return `Present %: ${pct}%   •   Category: ${ev?.category ?? "other"}`;
        },
      },
    },
  },
  elements: {
    bar: {
      maxBarThickness: 64,
      barPercentage: 0.65,
      categoryPercentage: 0.8,
    },
  },
  scales: {
    x: {
      ticks: {
        maxRotation: 45,
        minRotation: 0,
        autoSkip: false,
        autoSkipPadding: 8,
        color: chartTextColor.value,
      },
      grid: { display: false },
    },
    y: {
      beginAtZero: true,
      ticks: { precision: 0, color: chartTextColor.value },
    },
  },
  layout: { padding: 6 },
}));
</script>

<style scoped>
.sort {
  height: 10vh;
}

.chart {
  height: 60vh;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  position: relative;
}

/* make chart container follow theme surface */
.surface {
  background: var(--surface2);
  color: var(--text);
}

/* ensure chart canvas fills container */
.chart canvas,
.chart svg {
  width: 100% !important;
  max-width: 100% !important;
  height: 100% !important;
  display: block;
  box-sizing: border-box;
}

/* small select theming */
select {
  background: transparent;
  color: var(--text);
  border-color: var(--border);
}
</style>
