<template>
  <div class="table-wrapper">
    <!-- Header -->
    <div class="table-header">
      <div class="header-top">
        <div class="relative search-wrapper">
          <input v-model="q" type="search" placeholder="Search by student, activity or status..." class="search-input" />
          <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 search-icon"></i>
        </div>
      </div>

      <div class="header-bottom">
        <select v-model="perPage" class="select-input">
          <option v-for="n in [5, 10, 20, 50]" :key="n" :value="n">{{ n }} / page</option>
        </select>

        <select v-model="statusFilter" class="select-input">
          <option value="all">All Status</option>
          <option value="paid">Paid</option>
          <option value="partial">Partial</option>
          <option value="unpaid">Unpaid</option>
        </select>

        <button @click="refreshData" class="btn-refresh">
          <i class="fa-solid fa-arrows-rotate"></i>
          <span class="btn-text">Refresh</span>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="empty-state-mobile">
      <i class="fa-solid fa-spinner fa-spin"></i>
      <span>Loading violations...</span>
    </div>

    <!-- Desktop Table -->
    <div v-else class="desktop-table">
      <table class="w-full text-left text-sm">
        <thead class="table-head">
          <tr>
            <th class="p-3">#</th>
            <th class="p-3 cursor-pointer" @click="sortBy('studentName')">Student <SortIcon field="studentName" :sort="sort" /></th>
            <th class="p-3 cursor-pointer" @click="sortBy('activityName')">Activity <SortIcon field="activityName" :sort="sort" /></th>
            <th class="p-3 cursor-pointer" @click="sortBy('fine')">Fine <SortIcon field="fine" :sort="sort" /></th>
            <th class="p-3 cursor-pointer" @click="sortBy('totalPaid')">Paid <SortIcon field="totalPaid" :sort="sort" /></th>
            <th class="p-3 cursor-pointer" @click="sortBy('remaining')">Balance <SortIcon field="remaining" :sort="sort" /></th>
            <th class="p-3">Status</th>
            <th class="p-3 cursor-pointer" @click="sortBy('createdAt')">Date <SortIcon field="createdAt" :sort="sort" /></th>
            <th class="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(v, idx) in paged" :key="v.id" class="table-row">
            <td class="p-3 row-number">{{ startIndex + idx + 1 }}</td>
            <td class="p-3">
              <div class="student-name">{{ v.studentName }}</div>
              <div class="student-id">{{ v.studentSid }}</div>
            </td>
            <td class="p-3">
              <div class="student-name">{{ v.activityName }}</div>
              <div class="student-id">{{ v.entryName }}</div>
            </td>
            <td class="p-3"><span class="badge badge-violation">₱{{ v.fine.toLocaleString() }}</span></td>
            <td class="p-3"><span class="badge badge-amount">₱{{ v.totalPaid.toLocaleString() }}</span></td>
            <td class="p-3"><span class="badge" :class="v.remaining > 0 ? 'badge-violation' : 'badge-amount'">₱{{ v.remaining.toLocaleString() }}</span></td>
            <td class="p-3"><span class="badge" :class="getStatusBadge(v)"><i :class="getStatusIcon(v)"></i> {{ getStatusText(v) }}</span></td>
            <td class="p-3"><span class="badge badge-date">{{ formatDate(v.createdAt) }}</span></td>
            <td class="p-3">
              <div class="flex items-center gap-2">
                <button @click="handleView(v)" class="action-btn btn-view"><i class="fa-solid fa-eye"></i></button>
              </div>
            </td>
          </tr>
          <tr v-if="paged.length === 0"><td colspan="9" class="p-6 text-center empty-state">No violation records found.</td></tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Cards -->
    <div v-if="!loading" class="mobile-cards">
      <div v-for="(v, idx) in paged" :key="v.id" class="payment-card">
        <div class="card-header">
          <div class="card-number">{{ startIndex + idx + 1 }}</div>
          <div class="card-actions">
            <span class="badge" :class="getStatusBadge(v)">{{ getStatusText(v) }}</span>
            <button @click="handleView(v)" class="action-btn btn-view"><i class="fa-solid fa-eye"></i></button>
          </div>
        </div>
        <div class="card-content">
          <div class="card-row">
            <div class="card-label">Student</div>
            <div class="card-value"><div class="student-name">{{ v.studentName }}</div><div class="student-id">{{ v.studentSid }}</div></div>
          </div>
          <div class="card-row">
            <div class="card-label">Activity</div>
            <div class="card-value"><div class="student-name">{{ v.activityName }}</div><div class="student-id">{{ v.entryName }}</div></div>
          </div>
          <div class="card-row">
            <div class="card-label">Fine</div>
            <div class="card-value"><span class="badge badge-violation">₱{{ v.fine.toLocaleString() }}</span></div>
          </div>
          <div class="card-row">
            <div class="card-label">Paid</div>
            <div class="card-value"><span class="badge badge-amount">₱{{ v.totalPaid.toLocaleString() }}</span></div>
          </div>
          <div class="card-row">
            <div class="card-label">Balance</div>
            <div class="card-value"><span class="badge" :class="v.remaining > 0 ? 'badge-violation' : 'badge-amount'">₱{{ v.remaining.toLocaleString() }}</span></div>
          </div>
          <div class="card-row">
            <div class="card-label">Date</div>
            <div class="card-value"><span class="badge badge-date">{{ formatDate(v.createdAt) }}</span></div>
          </div>
        </div>
      </div>
      <div v-if="paged.length === 0" class="empty-state-mobile">No violation records found.</div>
    </div>

    <!-- Pagination -->
    <div class="table-footer">
      <div class="pagination-info">Showing {{ paged.length ? startIndex + 1 : 0 }} - {{ startIndex + paged.length }} of {{ filtered.length }}</div>
      <div class="flex items-center gap-2">
        <button class="pagination-btn" :disabled="page === 1" @click="page--">Prev</button>
        <div class="pagination-current">{{ page }}</div>
        <button class="pagination-btn" :disabled="page >= totalPages" @click="page++">Next</button>
      </div>
    </div>

    <!-- View Modal -->
    <ReadViolation :open="isViewModalOpen" :onClose="closeViewModal" :violation="selectedViolation" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import axios from "axios";
import ReadViolation from "@/components/CRUD/readViolation.vue";

const SortIcon = {
  props: ["field", "sort"],
  template: `<span class="inline-block ml-1 sort-icon"><i v-if="sort.field===field && sort.dir==='asc'" class="fa-solid fa-arrow-up"></i><i v-else-if="sort.field===field && sort.dir==='desc'" class="fa-solid fa-arrow-down"></i></span>`,
};

const props = defineProps({
  studentId: { type: Number, default: null },
  defaultPerPage: { type: Number, default: 10 },
  apiUrl: { type: String, default: "http://localhost:4000" },
});

const emit = defineEmits(["error", "success", "pay-violation"]);
const API_BASE = props.apiUrl;
const getAuthHeader = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

const violations = ref([]);
const loading = ref(false);
const q = ref("");
const page = ref(1);
const perPage = ref(props.defaultPerPage);
const statusFilter = ref("all");
const sort = ref({ field: "createdAt", dir: "desc" });
const isViewModalOpen = ref(false);
const selectedViolation = ref(null);

async function fetchViolations() {
  loading.value = true;
  try {
    const [violationsRes, studentsRes, paymentsRes, activitiesRes] = await Promise.all([
      axios.get(`${API_BASE}/violation${props.studentId ? `/student/${props.studentId}` : ''}`, { headers: getAuthHeader() }),
      axios.get(`${API_BASE}/section/student`, { headers: getAuthHeader() }),
      axios.get(`${API_BASE}/payment`, { headers: getAuthHeader() }),
      axios.get(`${API_BASE}/activity`, { headers: getAuthHeader() }).catch(() => ({ data: [] }))
    ]);

    const activities = activitiesRes.data;
    const activityMap = new Map(activities.map(a => [a.id, a]));

    // Fetch entries for each activity
    const allEntries = [];
    for (const activity of activities) {
      try {
        const entriesRes = await axios.get(`${API_BASE}/activity/${activity.id}/entry`, { headers: getAuthHeader() });
        entriesRes.data.forEach(e => allEntries.push({ ...e, activityId: activity.id }));
      } catch { /* no entries for this activity */ }
    }

    const studentMap = new Map(studentsRes.data.map(s => [s.id, s]));
    const entryMap = new Map(allEntries.map(e => [e.id, e]));
    const paymentsByViolation = paymentsRes.data.reduce((acc, p) => { (acc[p.violationId] = acc[p.violationId] || []).push(p); return acc; }, {});

    violations.value = violationsRes.data.map(v => {
      const student = studentMap.get(v.studentId) || {};
      const entry = entryMap.get(v.entryId) || {};
      const activity = activityMap.get(entry?.activityId) || {};
      const payments = paymentsByViolation[v.id] || [];
      const totalPaid = payments.reduce((sum, p) => sum + Number(p.value), 0);
      const entryTime = entry.startAt ? new Date(entry.startAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : `Entry #${v.activityEntryId}`;
      return { ...v, studentName: student.name || 'Unknown', studentSid: student.sid || 'N/A', activityName: activity.name || 'Unknown Activity', entryName: entryTime, totalPaid, remaining: Math.max(0, v.fine - totalPaid), payments };
    });
  } catch (e) { emit('error', e.response?.data || 'Failed to fetch violations'); }
  finally { loading.value = false; }
}

async function refreshData() { await fetchViolations(); emit('success', 'Violations refreshed'); }

function sortBy(field) { sort.value = sort.value.field === field ? { field, dir: sort.value.dir === 'asc' ? 'desc' : 'asc' } : { field, dir: field === 'createdAt' ? 'desc' : 'asc' }; }
function handleView(v) { selectedViolation.value = v; isViewModalOpen.value = true; }
function closeViewModal() { isViewModalOpen.value = false; selectedViolation.value = null; }
function getStatusBadge(v) { return v.remaining <= 0 ? 'badge-amount' : v.totalPaid > 0 ? 'badge-date' : 'badge-violation'; }
function getStatusIcon(v) { return v.remaining <= 0 ? 'fa-solid fa-check' : v.totalPaid > 0 ? 'fa-solid fa-clock' : 'fa-solid fa-xmark'; }
function getStatusText(v) { return v.remaining <= 0 ? 'Paid' : v.totalPaid > 0 ? 'Partial' : 'Unpaid'; }

const filtered = computed(() => violations.value.filter(v => {
  if (statusFilter.value === 'paid' && v.remaining > 0) return false;
  if (statusFilter.value === 'partial' && (v.remaining <= 0 || v.totalPaid === 0)) return false;
  if (statusFilter.value === 'unpaid' && v.totalPaid > 0) return false;
  const qq = q.value.trim().toLowerCase();
  return !qq || [v.studentName, v.studentSid, v.activityName, v.entryName].some(x => (x || '').toLowerCase().includes(qq));
}));

const sorted = computed(() => [...filtered.value].sort((a, b) => {
  const f = sort.value.field, dir = sort.value.dir === 'asc' ? 1 : -1;
  if (f === 'createdAt') return (new Date(a[f]) - new Date(b[f])) * dir;
  if (['fine', 'totalPaid', 'remaining'].includes(f)) return (a[f] - b[f]) * dir;
  return ((a[f] || '').toString().localeCompare((b[f] || '').toString())) * dir;
}));

const totalPages = computed(() => Math.max(1, Math.ceil(sorted.value.length / perPage.value)));
const startIndex = computed(() => (page.value - 1) * perPage.value);
const paged = computed(() => sorted.value.slice(startIndex.value, startIndex.value + perPage.value));
const formatDate = (d) => new Date(d).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });

watch([q, perPage, statusFilter], () => (page.value = 1));
onMounted(fetchViolations);
</script>

<style scoped>
.desktop-table { display: none; overflow-x: auto; }
@media (min-width: 768px) { .desktop-table { display: block; } }
</style>