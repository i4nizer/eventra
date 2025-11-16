<template>
  <div class="chart surface p-4 rounded-lg shadow">
    <div class="chart-header">
      <h3 class="chart-title">Events: Sign-Ups & Participants</h3>

      <!-- ✅ Category Filter -->
      <select
        v-model="selectedCategory"
        class="category-select"
      >
        <option value="all">All Categories</option>
        <option v-for="cat in categoryList" :key="cat" :value="cat">
          {{ cat.charAt(0).toUpperCase() + cat.slice(1) }}
        </option>
      </select>
    </div>

    <div class="chart-container">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
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
    if (!raw) return "#10b981";
    return raw;
  } catch {
    return "#10b981";
  }
}

function hexToRgba(hex, alpha = 1) {
  if (!hex) return `rgba(16,185,129,${alpha})`;
  const h = hex.trim();
  if (/^rgba?\(/i.test(h)) {
    return h.replace(/^rgb\(/i, "rgba(").replace(/\)$/, `, ${alpha})`);
  }
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

const categoryColors = {
  special: { registered: registeredColor, attendees: attendeesColor },
  normal: { registered: registeredColor, attendees: attendeesColor },
  other: { registered: registeredColor, attendees: attendeesColor },
};

const colorFor = (category) => categoryColors[category] ?? categoryColors.other;

const categoryList = computed(() => [...new Set(props.events.map((e) => e.category))]);

const selectedCategory = ref("all");

const filteredEvents = computed(() =>
  selectedCategory.value === "all"
    ? props.events
    : props.events.filter((e) => e.category === selectedCategory.value)
);

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

const isDark = ref(document.documentElement.classList.contains("dark"));
let mo = null;

onMounted(() => {
  mo = new MutationObserver(() => {
    isDark.value = document.documentElement.classList.contains("dark");
  });
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
});

onBeforeUnmount(() => {
  if (mo) mo.disconnect();
});

function resolveMuted() {
  try {
    const raw = getComputedStyle(document.documentElement).getPropertyValue("--muted")?.trim();
    return raw || "#6b7280";
  } catch {
    return "#6b7280";
  }
}

const chartTextColor = computed(() => (isDark.value ? "#ffffff" : resolveMuted()));

// Detect mobile
const isMobile = ref(window.innerWidth < 768);

onMounted(() => {
  const handleResize = () => {
    isMobile.value = window.innerWidth < 768;
  };
  window.addEventListener('resize', handleResize);
  
  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
  });
});

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: "index", intersect: false },
  plugins: {
    legend: {
      position: isMobile.value ? "bottom" : "top",
      labels: { 
        color: chartTextColor.value,
        font: {
          size: isMobile.value ? 10 : 12
        },
        padding: isMobile.value ? 8 : 10
      },
    },
    tooltip: {
      titleColor: chartTextColor.value,
      bodyColor: chartTextColor.value,
      titleFont: {
        size: isMobile.value ? 11 : 13
      },
      bodyFont: {
        size: isMobile.value ? 10 : 12
      },
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
      maxBarThickness: isMobile.value ? 24 : 64,
      barPercentage: isMobile.value ? 0.5 : 0.65,
      categoryPercentage: isMobile.value ? 0.6 : 0.8,
    },
  },
  scales: {
    x: {
      ticks: {
        maxRotation: isMobile.value ? 90 : 45,
        minRotation: isMobile.value ? 45 : 0,
        autoSkip: true,
        autoSkipPadding: isMobile.value ? 4 : 8,
        color: chartTextColor.value,
        font: {
          size: isMobile.value ? 9 : 11
        }
      },
      grid: { display: false },
    },
    y: {
      beginAtZero: true,
      ticks: { 
        precision: 0, 
        color: chartTextColor.value,
        font: {
          size: isMobile.value ? 9 : 11
        }
      },
    },
  },
  layout: { 
    padding: isMobile.value ? 4 : 6 
  },
}));
</script>

<style scoped>
.chart {
  height: 100%;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  position: relative;
}

.surface {
  background: var(--surface2);
  color: var(--text);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.chart-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
}

.category-select {
  background: transparent;
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 0.375rem;
  padding: 0.375rem 0.5rem;
  font-size: 0.875rem;
}

.chart-container {
  height: calc(100% - 60px);
  width: 100%;
  position: relative;
}

.chart-container canvas,
.chart-container svg {
  width: 100% !important;
  max-width: 100% !important;
  height: 100% !important;
  display: block;
  box-sizing: border-box;
}

/* Tablet */
@media (max-width: 1024px) {
  .chart {
    padding: 0.875rem;
  }
  
  .chart-title {
    font-size: 1rem;
  }
  
  .chart-container {
    height: calc(100% - 55px);
  }
}

/* Mobile */
@media (max-width: 768px) {
  .chart {
    padding: 0.75rem;
  }
  
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.625rem;
    margin-bottom: 0.5rem;
  }
  
  .chart-title {
    font-size: 0.9375rem;
    line-height: 1.3;
  }
  
  .category-select {
    width: 100%;
    max-width: 200px;
    padding: 0.5rem;
    font-size: 0.8125rem;
  }
  
  .chart-container {
    height: calc(100% - 70px);
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .chart {
    padding: 0.625rem;
  }
  
  .chart-title {
    font-size: 0.875rem;
  }
  
  .category-select {
    font-size: 0.75rem;
    padding: 0.4375rem 0.5rem;
  }
  
  .chart-container {
    height: calc(100% - 65px);
  }
}
</style>