<template>
  <div class="chart surface p-4 rounded-lg shadow">
    <div class="chart-header">
      <h3 class="chart-title">Events: Sign-Ups & Participants</h3>

      <!-- ✅ Category Filter -->
      <select v-model="selectedCategory" class="category-select">
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
      { id: 1, title: "Orientation", registered: 150, attendees: 120 },
      {
        id: 2,
        title: "Daily Attendance 2025-10-01",
        registered: 200,
        attendees: 190,
      },
      { id: 3, title: "Alumni Meet", registered: 250, attendees: 200 },
      { id: 4, title: "TechFest", registered: 300, attendees: 250 },
      { id: 5, title: "Coding Bootcamp", registered: 120, attendees: 100 },
      { id: 6, title: "Hackathon", registered: 180, attendees: 150 },
      {
        id: 7,
        title: "Internship Orientation",
        registered: 220,
        attendees: 200,
      },
      { id: 8, title: "IT Summit", registered: 350, attendees: 300 },
    ],
  },
});

// Accent Color Resolver
function getAccent() {
  try {
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue("--accent")
      ?.trim();
    return raw || "#10b981";
  } catch {
    return "#10b981";
  }
}

function hexToRgba(hex, alpha = 1) {
  if (!hex) return `rgba(16,185,129,${alpha})`;
  const v = hex.replace("#", "");
  const num = parseInt(v.length === 3 ? v.repeat(2) : v, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const accentRaw = getAccent();
const registeredColor = accentRaw;
const attendeesColor = hexToRgba(accentRaw, 0.78);

// DIRECTLY USE props.events (no filtering)
const chartData = computed(() => {
  const labels = props.events.map((e) => e.title);
  const registered = props.events.map((e) => Number(e.registered ?? 0));
  const attendees = props.events.map((e) => Number(e.attendees ?? 0));

  return {
    labels,
    datasets: [
      {
        label: "Registered",
        data: registered,
        backgroundColor: labels.map(() => registeredColor),
        borderRadius: 6,
      },
      {
        label: "Attendees",
        data: attendees,
        backgroundColor: labels.map(() => attendeesColor),
        borderRadius: 6,
      },
    ],
  };
});

// Dark mode handling
const isDark = ref(document.documentElement.classList.contains("dark"));
let mo = null;

onMounted(() => {
  mo = new MutationObserver(() => {
    isDark.value = document.documentElement.classList.contains("dark");
  });
  mo.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
});

onBeforeUnmount(() => {
  if (mo) mo.disconnect();
});

function resolveMuted() {
  try {
    return (
      getComputedStyle(document.documentElement)
        .getPropertyValue("--muted")
        ?.trim() || "#6b7280"
    );
  } catch {
    return "#6b7280";
  }
}

const chartTextColor = computed(() =>
  isDark.value ? "#ffffff" : resolveMuted()
);

// Mobile detection
const isMobile = ref(window.innerWidth < 768);

onMounted(() => {
  const handleResize = () => {
    isMobile.value = window.innerWidth < 768;
  };
  window.addEventListener("resize", handleResize);

  onBeforeUnmount(() => {
    window.removeEventListener("resize", handleResize);
  });
});

// Chart Options
const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: isMobile.value ? "bottom" : "top",
      labels: {
        color: chartTextColor.value,
        font: { size: isMobile.value ? 10 : 12 },
      },
    },
    tooltip: {
      titleColor: chartTextColor.value,
      bodyColor: chartTextColor.value,
      callbacks: {
        title: (ctx) => ctx[0].label,
        label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}`,
        afterBody: (ctx) => {
          const idx = ctx[0].dataIndex;
          const ev = props.events[idx];
          const pct = Math.round(
            ((ev.attendees ?? 0) / (ev.registered || 1)) * 100
          );
          return `Present %: ${pct}%`;
        },
      },
    },
  },
  scales: {
    x: {
      ticks: {
        color: chartTextColor.value,
        font: { size: isMobile.value ? 9 : 11 },
      },
      grid: { display: false },
    },
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0,
        color: chartTextColor.value,
      },
    },
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
