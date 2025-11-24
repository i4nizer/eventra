<template>
  <div class="chart surface p-4 rounded-lg shadow">
    <div class="chart-header">
      <h3 class="chart-title">Events: Sign-Ups & Participants</h3>

      <!-- Category Filter -->
      <select
        v-model="selectedCategory"
        class="category-select"
        @change="fetchChartData"
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
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
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

import { useApi } from "@/composables/api";
const { api } = useApi();

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const selectedCategory = ref("all");
const events = ref([]);
const attendances = ref([]);
const sections = ref([]);

// Get distinct categories for filter, based on sections' names or years or other attribute
const categoryList = computed(() => {
  // Extract unique categories from sections or events
  // For demo, assume category is section name's first part (like "F4")
  const cats = new Set();
  sections.value.forEach((sec) => {
    if (sec.name) cats.add(sec.name.toLowerCase());
  });
  return Array.from(cats);
});

// Fetch sections from API
async function fetchSections() {
  try {
    const res = await api.get("/section");
    sections.value = res.data;
  } catch (e) {
    console.error("Failed to fetch sections:", e);
  }
}

// Fetch all activities (events)
async function fetchEvents() {
  try {
    const res = await api.get("/activity");
    events.value = res.data;
  } catch (e) {
    console.error("Failed to fetch activities:", e);
  }
}

// Fetch attendances
async function fetchAttendances() {
  try {
    const res = await api.get("/attendance");
    attendances.value = res.data;
  } catch (e) {
    console.error("Failed to fetch attendances:", e);
  }
}

// Fetch and prepare chart data based on selected category (section filter)
async function fetchChartData() {
  await Promise.all([fetchEvents(), fetchSections(), fetchAttendances()]);

  // Filter events by section/category if not all
  let filteredEvents = events.value;

  // If category is selected, filter events by sections having that category
  if (selectedCategory.value !== "all") {
    // Find section IDs matching selected category
    const matchingSectionIds = sections.value
      .filter((s) => s.name.toLowerCase() === selectedCategory.value)
      .map((s) => s.id);

    // Filter events that have sections matching these section IDs
    // But events' sections are not directly in event, so fetch sections per event

    // For each event, fetch its sections and keep events that have matching section ids
    // But here, to keep it simple, filter events whose activityId's sections include matchingSectionIds

    // Since we don't have direct event->sections mapping here, we call API per event to get sections
    // To optimize, fetch all event sections once:
    const eventSectionsMap = {};

    await Promise.all(
      filteredEvents.map(async (event) => {
        try {
          const res = await api.get(`/activity/${event.id}/section`);
          eventSectionsMap[event.id] = res.data.map((s) => s.id);
        } catch {
          eventSectionsMap[event.id] = [];
        }
      })
    );

    filteredEvents = filteredEvents.filter((event) =>
      eventSectionsMap[event.id]?.some((secId) =>
        matchingSectionIds.includes(secId)
      )
    );
  }

  // Prepare chart data arrays: labels, registered counts, attendees counts
  const labels = [];
  const registeredCounts = [];
  const attendeesCounts = [];

  for (const event of filteredEvents) {
    labels.push(event.name);

    // Count registered: sum of attendances for this event's activity entries
    // First get activity entries for event
    let activityEntries = [];
    try {
      const res = await api.get(`/activity/${event.id}/entry`);
      activityEntries = res.data;
    } catch {
      activityEntries = [];
    }

    // Registered count = total attendance entries for this event's activity entries
    let registered = 0;
    let attendees = 0;

    // For each activity entry, count attendance records
    for (const entry of activityEntries) {
      // Get attendances for this entry
      const entryAttendances = attendances.value.filter(
        (a) => a.entryId === entry.id
      );
      registered += entryAttendances.length;

      // For attendees count, we can consider attendances with createdAt within startAt to finishAt of entry
      // But since we don't have detailed attendance status, assume all attendances are attendees
      attendees += entryAttendances.length;
    }

    registeredCounts.push(registered);
    attendeesCounts.push(attendees);
  }

  chartRawData.value = {
    labels,
    registeredCounts,
    attendeesCounts,
  };
}

// Reactive raw chart data holder
const chartRawData = ref({
  labels: [],
  registeredCounts: [],
  attendeesCounts: [],
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

const chartData = computed(() => ({
  labels: chartRawData.value.labels,
  datasets: [
    {
      label: "Registered",
      data: chartRawData.value.registeredCounts,
      backgroundColor: chartRawData.value.labels.map(() => registeredColor),
      borderRadius: 6,
    },
    {
      label: "Attendees",
      data: chartRawData.value.attendeesCounts,
      backgroundColor: chartRawData.value.labels.map(() => attendeesColor),
      borderRadius: 6,
    },
  ],
}));

const isDark = ref(document.documentElement.classList.contains("dark"));
let mo = null;

onMounted(() => {
  fetchChartData();

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
          const reg = chartRawData.value.registeredCounts[idx] || 1;
          const att = chartRawData.value.attendeesCounts[idx] || 0;
          const pct = Math.round((att / reg) * 100);
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
