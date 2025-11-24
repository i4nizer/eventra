<template>
  <div class="chart surface p-4 rounded-lg shadow">
    <div class="chart-header">
      <h3 class="chart-title">Events: Registered vs Attendees</h3>

      <!-- Category Filter -->
      <select
        v-model="selectedCategory"
        class="category-select"
        @change="fetchChartData"
      >
        <option value="all">All Sections</option>
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
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
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
const sections = ref([]);
const activitySections = ref([]); // all activity-section mappings
const students = ref([]); // all students
const chartRawData = ref({
  labels: [],
  registeredCounts: [],
  attendeesCounts: [],
});

// Compute unique category list from sections
const categoryList = computed(() => {
  const cats = new Set();
  sections.value.forEach((sec) => {
    if (sec.name) cats.add(sec.name.toLowerCase());
  });
  return Array.from(cats);
});

// Fetch all sections
async function fetchSections() {
  try {
    const res = await api.get("/section");
    sections.value = res.data;
  } catch (e) {
    console.error("Failed to fetch sections:", e);
  }
}

// Fetch all students
async function fetchStudents() {
  try {
    const res = await api.get("/section/student");
    students.value = res.data;
  } catch (e) {
    console.error("Failed to fetch students:", e);
  }
}

// Fetch all events (activities)
async function fetchEvents() {
  try {
    const res = await api.get("/activity");
    events.value = res.data;
  } catch (e) {
    console.error("Failed to fetch activities:", e);
  }
}

// Fetch all activity-section mappings by fetching per event
async function fetchActivitySections() {
  activitySections.value = [];
  if (!events.value.length) return;
  await Promise.all(
    events.value.map(async (event) => {
      try {
        const res = await api.get(`/activity/${event.id}/section`);
        const mappings = res.data.map((sec) => ({
          activityId: event.id,
          sectionId: sec.id || sec.sectionId || sec,
        }));
        activitySections.value.push(...mappings);
      } catch (e) {
        // Ignore errors for individual event requests
      }
    })
  );
}

// Get activity entries for an event
async function getEventEntries(eventId) {
  try {
    const res = await api.get(`/activity/${eventId}/entry`);
    return res.data;
  } catch {
    return [];
  }
}

// Get attendances for an activity entry
async function getAttendancesForEntry(entryId) {
  try {
    const res = await api.get(`/attendance/activity-entry/${entryId}`);
    return res.data;
  } catch {
    return [];
  }
}

async function fetchChartData() {
  await Promise.all([fetchEvents(), fetchSections(), fetchStudents()]);
  await fetchActivitySections();

  let filteredEvents = events.value;

  if (selectedCategory.value !== "all") {
    const selectedCatLower = selectedCategory.value.toLowerCase();

    // Filter sections by category name
    const matchingSections = sections.value.filter(
      (sec) => sec.name.toLowerCase() === selectedCatLower
    );
    const matchingSectionIds = matchingSections.map((sec) => sec.id);

    // Filter events that have any linked section in matchingSectionIds
    filteredEvents = filteredEvents.filter((event) =>
      activitySections.value.some(
        (as) =>
          as.activityId === event.id &&
          matchingSectionIds.includes(as.sectionId)
      )
    );
  }

  const labels = [];
  const registeredCounts = [];
  const attendeesCounts = [];

  for (const event of filteredEvents) {
    labels.push(event.name);

    // Find all sectionIds linked to this event from activitySections
    const linkedSectionIds = activitySections.value
      .filter((as) => as.activityId === event.id)
      .map((as) => as.sectionId);

    // Count registered students: number of students with sectionId in linkedSectionIds
    const registered = students.value.filter((stu) =>
      linkedSectionIds.includes(stu.sectionId)
    ).length;

    // Get activity entries for event
    const entries = await getEventEntries(event.id);

    // Sum total attendance records for all entries (attendees)
    let attendees = 0;
    for (const entry of entries) {
      const entryAttendances = await getAttendancesForEntry(entry.id);
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

// Accent color helpers
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

/* Responsive styling omitted for brevity */
</style>
