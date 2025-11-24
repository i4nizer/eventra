<template>
  <div class="attendance-logs">
    <attendanceTable 
      :attendances 
      :entries
      :students
      :activities
      @delete="onDeleteAttendance"
    />
  </div>
</template>

<script setup>
import { useApi } from "@/composables/api";
import { onBeforeMount, ref } from "vue";
import attendanceTable from "@/components/Attendance/attendanceTable.vue";

//

// --- Auth Api
const { api } = useApi()

// --- Attendances
const attendances = ref([]);

const getAttendances = async () => {
  await api.get("/attendance")
    .then((res) => attendances.value = res.data)
    .catch(console.error)
}

const onDeleteAttendance = async (data) => {
  await api.delete(`/attendance/${data.id}`)
    .then(() => attendances.value.findIndex((a) => a.id == data.id))
    .then((idx) => attendances.value.splice(idx, 1))
    .catch(console.error)
}

// --- Activity entries of the attendances
const entries = ref([])

const getEntries = async (idarr = []) => {
  const query = new URLSearchParams()
  idarr.forEach((i) => query.append("idarr", i))
  await api.get(`/activity/entry?${query.toString()}`)
    .then((res) => entries.value = res.data)
    .catch(console.error)
}

// --- Students in the attendances 
const students = ref([])

const getStudents = async (idarr = []) => {
  const query = new URLSearchParams()
  idarr.forEach((i) => query.append("idarr", i))
  await api.get(`/section/student?${query.toString()}`)
    .then((res) => students.value = res.data)
    .catch(console.error)
}

// --- Activities from entries
const activities = ref([])

const getActivities = async (idarr = []) => {
  const query = new URLSearchParams()
  idarr.forEach((i) => query.append("idarr", i))
  await api.get(`/activity?${query.toString()}`)
    .then((res) => activities.value = res.data)
    .catch(console.error)
}

// --- Data Fetching
const getData = async () => {
  await getAttendances().catch(console.error)
  if (attendances.value.length <= 0) return

  const entids = attendances.value.map((a) => a.entryId)
  const stuids = attendances.value.map((a) => a.studentId)
  await Promise.all([getEntries(entids), getStudents(stuids)]).catch(console.error)

  if (entries.value.length <= 0) return
  const actids = entries.value.map((e) => e.activityId)
  await getActivities(actids).catch(console.error)
}

onBeforeMount(getData)

//

</script>
